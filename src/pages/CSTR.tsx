import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const CSTR = () => {
  const cstrInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow Rate", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature T", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300K" },
    {
      label: "Activation Energy",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    // New gas-phase parameters:
    {
      label: "Epsilon",
      name: "epsilon",
      unit: "ε",
    },
    {
      label: "Pressure Factor",
      name: "pressureFactor",
      unit: "P/Po",
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
          CSTR Volume Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reactor image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img src="/cstr.jpg" className="w-[100%] h-[100%]" />
          </div>

          {/* Right column - Reactor calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">aA + bB → cC + dD</p>
            </div>

            <ReactorCalculator
              title="CSTR Volume Calculation"
              description="For gas phase reactions, enter ε (mole change) and P/P₀. For liquid phase, set ε=0 and P/P₀=1 or leave the fields empty."
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
