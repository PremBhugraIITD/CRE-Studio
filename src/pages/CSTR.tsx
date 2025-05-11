import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const CSTR = () => {
  const cstrInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow Rate", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300 K" },
    { label: "Activation Energy", name: "activationEnergy", unit: "kJ/mol" },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
  ];

  const calculateCSTRVolume = (
    values: Record<string, number>
  ): [number, number] => {
    const R = 8.314; // J/(mol·K)

    // --- INPUT VALIDATION ---
    const X = values.conversion;
    const C0 = values.initialConc;
    const F0_L = values.flowRate;
    const T = values.temperature;
    const k300 = values.k300;

    if (X == null || X < 0 || X > 1) {
      alert("Conversion must be between 0 and 1.");
      throw new Error("Invalid conversion");
    }
    if (C0 == null || C0 <= 0) {
      alert("Inlet concentration must be positive.");
      throw new Error("Invalid inlet concentration");
    }
    if (F0_L == null || F0_L <= 0) {
      alert("Volumetric flow rate must be positive.");
      throw new Error("Invalid flow rate");
    }
    if (T == null || T <= 0 || T > 2000) {
      alert("Temperature must be >0 K and ≤2000 K.");
      throw new Error("Invalid temperature");
    }
    if (k300 == null || k300 <= 0) {
      alert("Rate constant at 300 K must be positive.");
      throw new Error("Invalid rate constant");
    }
    if (values.order == null || values.order < 0) {
      alert("Reaction order must be positive.");
      throw new Error("Invalid reaction order");
    }

    // 1. Convert to SI
    const C0_m3 = C0 * 1e3; // mol/L → mol/m³
    const F0 = F0_L / 1000 / 3600; // L/hr → m³/s
    const n = values.order;
    const Ea = (values.activationEnergy ?? 0) * 1e3; // kJ/mol → J/mol
    const ε = values.epsilon ?? 0;

    if (Ea == null || Ea < 0) {
      alert("Activation energy must be non-negative.");
      throw new Error("Invalid activation energy");
    }

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. Outlet concentration (mol/m³)
    const Ce_m3 = (C0_m3 * (1 - X)) / (1 + ε * X);
    // Convert outlet conc to mol/L
    const Ce_L = Ce_m3 / 1e3;

    // 4. CSTR design equation
    const V_m3 = (F0 * C0_m3 * X) / (kT * Math.pow(Ce_m3, n));
    const V_L = V_m3 * 1e3;

    // --- OUTPUT VALIDATION ---
    if (!(V_L > 0) || isNaN(V_L) || !isFinite(V_L)) {
      alert("Calculated reactor volume is non-positive; check inputs.");
      throw new Error("Invalid reactor volume");
    }
    if (!(Ce_L >= 0) || isNaN(Ce_L) || !isFinite(Ce_L)) {
      alert("Calculated outlet concentration is invalid; check inputs.");
      throw new Error("Invalid outlet concentration");
    }

    return [V_L, Ce_L];
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          CSTR Calculations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reactor image */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img
              src="/cstr.jpg"
              alt="CSTR Reactor"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right column - Calculator */}
          <div>
            <p className="text-gray-600 mb-4">
              Computes reactor volume (L) and outlet concentration (mol/L).
            </p>
            <ReactorCalculator
              title="Reactor Volume & Outlet Concentration"
              description="Rate of reaction should follow a Power Law model in terms of the concentration of a single species only (rₐ = -kCₐⁿ). For gas-phase: enter ε (mole change). For liquid-phase,
              set ε=0."
              inputs={cstrInputs}
              calculateResult={calculateCSTRVolume}
              resultLabels={["Reactor Volume", "Outlet Conc."]}
              resultUnits={["L", "mol/L"]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CSTR;
