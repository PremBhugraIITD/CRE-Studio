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
    {
      label: "Activation Energy",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    // gas-phase parameters:
    { label: "Epsilon", name: "epsilon", unit: "ε" },
    { label: "Pressure Factor", name: "pressureFactor", unit: "P/Po" },
  ];

  const calculateBatchTime = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. Extract & convert
    const X_target = vals.conversion; // unitless
    const C0_liq = vals.initialConc * 1e3; // mol/L → mol/m³
    const n = vals.order;
    const T = vals.temperature; // K
    const k300 = vals.k300; // 1/s
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0; // default 0
    const φ = vals.pressureFactor ?? 1; // default 1

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. Gas-phase adjusted initial concentration

    // 4. Define concentration profile CA(X)
    const CA = (X: number) => (C0_liq * φ * (1 - X)) / (1 + ε * X);

    // 5. Integrand: dt = C0 / (kT * CA(X)^n) dX
    const integrand = (X: number) => C0_liq / (kT * Math.pow(CA(X), n));

    // 6. Trapezoidal integration from 0 → X_target
    const steps = 1000;
    const dX = X_target / steps;
    let sum = 0.5 * (integrand(0) + integrand(X_target));
    for (let i = 1; i < steps; i++) {
      sum += integrand(i * dX);
    }
    const t_s = sum * dX; // seconds

    return t_s;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          Batch Reactor Time Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img src="/batch.webp" className="w-[100%] h-[100%]" />
          </div>

          {/* Right: calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                aA + bB → cC + dD
              </p>
            </div>

            <ReactorCalculator
              title="Batch Reactor Time Calculation"
              description="For gas phase reactions, enter ε (mole change) and P/P₀. For liquid phase, set ε=0 and P/P₀=1 or leave the fields empty."
              inputs={batchInputs}
              calculateResult={calculateBatchTime}
              resultLabel="Reaction Time"
              resultUnit="seconds"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Batch;
