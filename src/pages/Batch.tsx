import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const Batch = () => {
  const batchInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300K" },
    { label: "Activation Energy", name: "activationEnergy", unit: "kJ/mol" },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
  ];

  const calculateBatchTime = (
    vals: Record<string, number>
  ): [number, number] => {
    const R = 8.314; // J/(mol·K)

    // --- INPUT VALIDATION ---
    const X_target = vals.conversion;
    const C0_liq = vals.initialConc;
    const T = vals.temperature;
    const k300 = vals.k300;

    if (X_target == null || X_target < 0 || X_target > 1) {
      alert("Please enter a conversion between 0 and 1.");
      throw new Error("Invalid conversion");
    }
    if (C0_liq == null || C0_liq <= 0) {
      alert("Initial concentration must be positive.");
      throw new Error("Invalid initial concentration");
    }
    if (T == null || T <= 0 || T > 2000) {
      alert("Temperature must be >0 K and ≤2000 K.");
      throw new Error("Invalid temperature");
    }
    if (k300 == null || k300 <= 0) {
      alert("Rate constant at 300 K must be positive.");
      throw new Error("Invalid rate constant");
    }
    if (vals.order == null || vals.order < 0) {
      alert("Reaction order must be positive.");
      throw new Error("Invalid reaction order");
    }

    // 1. Extract & convert
    const C0_m3 = C0_liq * 1e3; // mol/L → mol/m³
    const n = vals.order;
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0;

    if (Ea == null || Ea < 0) {
      alert("Activation energy must be non-negative.");
      throw new Error("Invalid activation energy");
    }

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. Concentration profile CA(X)
    const CA = (X: number) => (C0_m3 * (1 - X)) / (1 + ε * X);

    // 4. Integrand: dt = C0_m3 / [kT * CA(X)^n] dX
    const integrand = (X: number) => C0_m3 / (kT * Math.pow(CA(X), n));

    // 5. Trapezoidal integration from 0 → X_target
    const steps = 1000;
    const dX = X_target / steps;
    let sum = 0.5 * (integrand(0) + integrand(X_target));
    for (let i = 1; i < steps; i++) {
      sum += integrand(i * dX);
    }
    const t_s = sum * dX; // seconds

    // 6. Final concentration for reporting (mol/m³ → mol/L)
    const C_out_m3 = (C0_m3 * (1 - X_target)) / (1 + ε * X_target);
    const C_out_L = C_out_m3 / 1e3;

    // --- OUTPUT VALIDATION ---
    if (!(t_s > 0) || isNaN(t_s) || !isFinite(t_s)) {
      alert("Calculated reaction time is non‐positive; check your inputs.");
      throw new Error("Invalid reaction time");
    }
    if (!(C_out_L >= 0) || isNaN(C_out_L) || !isFinite(C_out_L)) {
      alert("Calculated outlet concentration is invalid; check your inputs.");
      throw new Error("Invalid outlet concentration");
    }

    return [t_s, C_out_L];
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          Batch Reactor Calculations
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img
              src="/batch.webp"
              alt="Batch Reactor"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: calculator */}
          <div>
            <p className="text-gray-600 mb-4">
              Computes reaction time (s) and outlet concentration (mol/L).
            </p>
            <ReactorCalculator
              title="Reaction Time & Outlet Concentration"
              description="Rate of reaction should follow a Power Law model in terms of the concentration of a single species only (rₐ = -kCₐⁿ). For gas-phase: enter ε (mole change). For liquid-phase,
              set ε=0."
              inputs={batchInputs}
              calculateResult={calculateBatchTime}
              resultLabels={["Reaction Time", "Outlet Concentration"]}
              resultUnits={["s", "mol/L"]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Batch;
