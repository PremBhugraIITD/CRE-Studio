import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const PBR = () => {
  const pbrInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow Rate", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300K" },
    { label: "Activation Energy", name: "activationEnergy", unit: "kJ/mol" },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
  ];

  const calculatePBRCatalyst = (
    vals: Record<string, number>
  ): [number, number] => {
    const R = 8.314; // J/(mol·K)

    // --- INPUT VALIDATION ---
    const X = vals.conversion;
    const C0 = vals.initialConc;
    const F0_L = vals.flowRate;
    const n = vals.order;
    const T = vals.temperature;
    const k300 = vals.k300;
    const Ea = vals.activationEnergy;

    if (X == null || X < 0 || X > 1) {
      alert("Conversion must be between 0 and 1.");
      throw new Error("Invalid conversion");
    }
    if (C0 == null || C0 <= 0) {
      alert("Inlet concentration must be positive.");
      throw new Error("Invalid concentration");
    }
    if (F0_L == null || F0_L <= 0) {
      alert("Flow rate must be positive.");
      throw new Error("Invalid flow rate");
    }
    if (n == null || n < 0) {
      alert("Reaction order must be a positive number.");
      throw new Error("Invalid reaction order");
    }
    if (T == null || T <= 0 || T > 2000) {
      alert("Temperature must be >0 K and ≤2000 K.");
      throw new Error("Invalid temperature");
    }
    if (k300 == null || k300 <= 0) {
      alert("Rate constant (at 300K) must be positive.");
      throw new Error("Invalid rate constant");
    }
    if (Ea == null || Ea < 0) {
      alert("Activation energy must be non-negative.");
      throw new Error("Invalid activation energy");
    }

    // 1. Convert to SI
    const C0_m3 = C0 * 1e3; // mol/L → mol/m³
    const F0 = F0_L / 1000 / 3600; // L/hr → m³/s
    const FA0 = F0 * C0_m3; // mol/s
    const Ea_J = Ea * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0;

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea_J / R) * (1 / T - 1 / 300));

    // 3. Concentration profile
    const CA = (x: number) => (C0_m3 * (1 - x)) / (1 + ε * x);

    // 4. Integrand: dW/dX = FA0 / [kT * CA^n]
    const integrand = (x: number) => FA0 / (kT * Math.pow(CA(x), n));

    // 5. Trapezoidal integration
    const steps = 1000;
    const dX = X / steps;
    let sum = 0.5 * (integrand(0) + integrand(X));
    for (let i = 1; i < steps; i++) sum += integrand(i * dX);
    const W_kg = sum * dX; // catalyst mass in kg

    // 6. Outlet concentration (mol/m³ → mol/L)
    const Cout_m3 = (C0_m3 * (1 - X)) / (1 + ε * X);
    const Cout_L = Cout_m3 / 1e3;

    // --- OUTPUT VALIDATION ---
    if (!(W_kg > 0) || !isFinite(W_kg) || isNaN(W_kg)) {
      alert("Calculated catalyst mass is invalid; check inputs.");
      throw new Error("Invalid catalyst mass");
    }
    if (!(Cout_L >= 0) || !isFinite(Cout_L) || isNaN(Cout_L)) {
      alert("Calculated outlet concentration is invalid; check inputs.");
      throw new Error("Invalid outlet concentration");
    }

    return [W_kg, Cout_L];
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PBR Catalyst Mass Calculator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img
              src="/pbr.jpg"
              alt="PBR Reactor"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right */}
          <div>
            <p className="text-gray-600 mb-4">
              Computes catalyst mass (kg) and outlet concentration (mol/L).
            </p>
            <ReactorCalculator
              title="PBR Catalyst Mass & Outlet Conc."
              description="Rate of reaction should follow a Power Law model in terms of the concentration of a single species only (rₐ = -kCₐⁿ). For reactions with pressure drop, enter ε and α which are both set to 0 by default."
              inputs={pbrInputs}
              calculateResult={calculatePBRCatalyst}
              resultLabels={["Catalyst Mass", "Outlet Conc."]}
              resultUnits={["kg", "mol/L"]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PBR;
