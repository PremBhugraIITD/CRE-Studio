import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const PFR = () => {
  const pfrInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow Rate", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300 K" },
    { label: "Activation Energy", name: "activationEnergy", unit: "kJ/mol" },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
  ];

  const calculatePFRVolume = (
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
      alert("Rate constant at 300 K must be positive.");
      throw new Error("Invalid rate constant");
    }
    if (Ea == null || Ea < 0) {
      alert("Activation energy must be non-negative.");
      throw new Error("Invalid activation energy");
    }
    // ε and φ can be any real, but φ must be >0
    const ε = vals.epsilon ?? 0;

    // 1. extract & convert
    const C0_m3 = C0 * 1e3; // mol/L → mol/m³
    const F0 = F0_L / 1000 / 3600; // L/hr → m³/s
    const kT = k300 * Math.exp(((-Ea * 1e3) / R) * (1 / T - 1 / 300));

    // 2. Molar flow
    const FA0 = F0 * C0_m3; // mol/s

    // 3. Integrand f(Xi)
    const integrand = (Xi: number) => {
      const CA_m3 = (C0_m3 * (1 - Xi)) / (1 + ε * Xi);
      return FA0 / (kT * Math.pow(CA_m3, n));
    };

    // 4. Trapezoidal integration to get V_m3
    const steps = 1000;
    const dX = X / steps;
    let sum = 0.5 * (integrand(0) + integrand(X));
    for (let i = 1; i < steps; i++) sum += integrand(i * dX);
    const V_m3 = sum * dX; // m³
    const V_L = V_m3 * 1e3; // → L

    // 5. Outlet concentration
    const Ce_m3 = (C0_m3 * (1 - X)) / (1 + ε * X);
    const Ce_L = Ce_m3 / 1e3; // → mol/L

    // --- OUTPUT VALIDATION ---
    if (!(V_L > 0) || !isFinite(V_L) || isNaN(V_L)) {
      alert("Calculated reactor volume is invalid; check inputs.");
      throw new Error("Invalid reactor volume");
    }
    if (!(Ce_L >= 0) || !isFinite(Ce_L) || isNaN(Ce_L)) {
      alert("Calculated outlet concentration is invalid; check inputs.");
      throw new Error("Invalid outlet concentration");
    }

    return [V_L, Ce_L];
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PFR Calculations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img
              src="/pfr.jpg"
              alt="PFR Reactor"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right */}
          <div>
            <p className="text-gray-600 mb-4">
              Computes reactor volume (L) and outlet concentration (mol/L).
            </p>
            <ReactorCalculator
              title="Reactor Volume & Outlet Concentration"
              description="Rate of reaction should follow a Power Law model in terms of the concentration of a single species only (rₐ = -kCₐⁿ). For gas-phase: enter ε (mole change). For liquid-phase,
              set ε=0."
              inputs={pfrInputs}
              calculateResult={calculatePFRVolume}
              resultLabels={["Reactor Volume", "Outlet Concentration"]}
              resultUnits={["L", "mol/L"]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PFR;
