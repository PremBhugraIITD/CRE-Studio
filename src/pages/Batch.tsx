import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const Batch = () => {
  const batchInputs = [
    { label: "Conversion (X)", name: "conversion", unit: "" },
    { label: "Initial Conc. C₀ (mol/L)", name: "initialConc", unit: "mol/L" },
    { label: "Reaction Order (n)", name: "order", unit: "" },
    { label: "Temperature T (K)", name: "temperature", unit: "K" },
    { label: "k @ 300 K (1/s)", name: "k300", unit: "1/s" },
    {
      label: "Activation Energy Eₐ (kJ/mol)",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    // gas-phase parameters:
    { label: "Epsilon (Δn/n₀)", name: "epsilon", unit: "" },
    { label: "P / P₀ factor", name: "pressureFactor", unit: "" },
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
            Batch Reactor Image Placeholder
          </div>

          {/* Right: calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Computes reaction time by numerically integrating dX/dt =
                k(T)·CA(X)^n with gas‐phase volume change. For liquid phase set
                ε=0, P/P₀=1.
              </p>
            </div>

            <ReactorCalculator
              title="Batch Reactor Time Calculation"
              description="Numerical integration of the batch‐reactor design equation with gas‐phase expansion & Arrhenius kinetics."
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
