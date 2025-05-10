import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const CSTR = () => {
  // New inputs for CSTR calculations
  const cstrInputs = [
    { label: "Conversion (X)", name: "conversion", unit: "" },
    { label: "Initial Conc. C₀ (mol/L)", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow F₀ (L/hr)", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order (n)", name: "order", unit: "" },
    { label: "Temperature T (K)", name: "temperature", unit: "K" },
    { label: "k @ 300 K (1/s)", name: "k300", unit: "1/s" },
    { label: "Activation Energy Eₐ (kJ/mol)", name: "activationEnergy", unit: "kJ/mol" },
  ];

  const calculateCSTRVolume = (values: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. Extract & convert inputs to SI
    const X = values.conversion;                 // unitless
    const C0 = values.initialConc * 1e3;         // mol/L → mol/m³
    const F0 = values.flowRate / 3600 / 1e3;     // L/hr → (m³/hr) → m³/s
    const n = values.order;
    const T = values.temperature;                // K
    const k300 = values.k300;                    // 1/s at 300 K
    const Ea = values.activationEnergy * 1e3;    // kJ/mol → J/mol

    // 2. Temperature correction of rate constant
    const kT = k300 * Math.exp(-Ea / R * (1 / T - 1 / 300));

    // 3. Outlet conc. Ce = C0*(1-X)
    const Ce = C0 * (1 - X);

    // 4. CSTR design equation: V (m³) = F0*C0*X / [ k(T) * Ce^n ]
    const V_m3 = (F0 * C0 * X) / (kT * Math.pow(Ce, n));

    // 5. Convert to liters
    const V_L = V_m3 * 1e3;

    return V_L;
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
                Enter conversion, flow, kinetics and temperature to compute the reactor volume.
              </p>
            </div>

            <ReactorCalculator
              title="CSTR Volume Calculation"
              description="Computes V (L) using conversion-based CSTR design with Arrhenius kinetics."
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
