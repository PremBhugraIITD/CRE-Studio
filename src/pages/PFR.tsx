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
    { label: "Rate Constant", name: "k300", unit: "At 300K" },
    {
      label: "Activation Energy",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
    { label: "Pressure Factor", name: "pressureFactor", unit: "P/Po" },
  ];

  const calculatePFRVolume = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. extract & convert
    const X = vals.conversion; // unitless
    const C0_liq = vals.initialConc * 1e3; // mol/L → mol/m³
    const F0 = vals.flowRate / 3600 / 1e3; // L/hr → m³/s
    const n = vals.order;
    const T = vals.temperature; // K
    const k300 = vals.k300; // 1/s
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0; // default 0
    const φ = vals.pressureFactor ?? 1; // default 1

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. gas-phase adjusted C0 and molar flow
    const FA0 = F0 * C0_liq; // molar flow A0 = volumetric * C0

    // 4. integrand f(Xi) = FA0 / [ kT * ( C_A(Xi) )^n ]
    const integrand = (Xi: number) => {
      const CA = (C0_liq * φ * (1 - Xi)) / (1 + ε * Xi);
      return FA0 / (kT * Math.pow(CA, n));
    };

    // 5. trapezoidal integration from 0 to X
    const steps = 1000;
    const dX = X / steps;
    let sum = 0.5 * (integrand(0) + integrand(X));
    for (let i = 1; i < steps; i++) {
      sum += integrand(i * dX);
    }
    const V_m3 = sum * dX; // m³

    // 6. convert to liters
    return V_m3 * 1e3;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PFR Volume Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img src="/pfr.jpg" className="w-[100%] h-[100%]" />
          </div>

          {/* Right: calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">aA + bB → cC + dD</p>
            </div>

            <ReactorCalculator
              title="PFR Volume Calculation"
              description="For gas phase reactions, enter ε (mole change) and P/P₀. For liquid phase, set ε=0 and P/P₀=1 or leave the fields empty."
              inputs={pfrInputs}
              calculateResult={calculatePFRVolume}
              resultLabel="Reactor Volume"
              resultUnit="liters"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PFR;
