import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const CSTR = () => {
  const cstrInputs = [
    { label: "Conversion (X)", name: "conversion", unit: "" },
    { label: "Initial Conc. C₀ (mol/L)", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow F₀ (L/hr)", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order (n)", name: "order", unit: "" },
    { label: "Temperature T (K)", name: "temperature", unit: "K" },
    { label: "k @ 300 K (1/s)", name: "k300", unit: "1/s" },
    {
      label: "Activation Energy Eₐ (kJ/mol)",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    // New gas-phase parameters:
    {
      label: "Epsilon (Δn/n₀)",
      name: "epsilon",
      unit: "",
    },
    {
      label: "P / P₀ factor",
      name: "pressureFactor",
      unit: "",
    },
  ];

  const calculateCSTRVolume = (values: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. Extract & convert inputs to SI
    const X = values.conversion; // unitless
    const C0 = values.initialConc * 1e3; // mol/L → mol/m³
    const F0 = values.flowRate / 3600 / 1e3; // L/hr → m³/s
    const n = values.order;
    const T = values.temperature; // K
    const k300 = values.k300; // 1/s at 300 K
    const Ea = values.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = values.epsilon ?? 0; // default 0 (liquid)
    const φ = values.pressureFactor ?? 1; // default 1 (P=P₀)

    // 2. Temperature correction of rate constant (Arrhenius)
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. Adjust inlet concentration for pressure
    //    C₀,gas = C₀,liquid × (P/P₀)
    const C0_gas = C0 * φ;

    // 4. Outlet concentration for gas‐phase with volume change:
    //    Cₑ = C₀,gas × (1 - X) / (1 + ε X)
    const Ce = (C0_gas * (1 - X)) / (1 + ε * X);

    // 5. CSTR design equation:
    //    V (m³) = [F₀ × C₀,gas × X] / [k(T) × Ceⁿ]
    const V_m3 = (F0 * C0_gas * X) / (kT * Math.pow(Ce, n));

    // 6. Convert m³ → L
    return V_m3 * 1e3;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          CSTR Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reactor image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            CSTR Reactor Image Placeholder
          </div>

          {/* Right column - Reactor calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Enter conversion, flow, kinetics, temperature—and for gas‐phase
                only, ε (mole‐change) and P/P₀—to compute reactor volume.
              </p>
            </div>

            <ReactorCalculator
              title="CSTR Volume Calculation"
              description="Handles both liquid (ε=0, P/P₀=1) and gas‐phase (ε≠0 or P/P₀≠1) cases with Arrhenius kinetics."
              inputs={cstrInputs}
              calculateResult={calculateCSTRVolume}
              resultLabel="Reactor Volume"
              resultUnit="liters"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CSTR;
