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
    { label: "Activation Energy Eₐ (kJ/mol)", name: "activationEnergy", unit: "kJ/mol" },
  ];

  const calculateBatchTime = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. extract & convert
    const X = vals.conversion;                 // unitless
    const C0 = vals.initialConc * 1e3;         // mol/L → mol/m³
    const n = vals.order;
    const T = vals.temperature;                // K
    const k300 = vals.k300;                    // 1/s
    const Ea = vals.activationEnergy * 1e3;    // kJ/mol → J/mol

    // 2. Arrhenius correction
    const kT = k300 * Math.exp(-Ea / R * (1 / T - 1 / 300));

    // 3. batch time integral
    let t_s: number;
    if (n === 0) {
      // t = C0*X / k
      t_s = (C0 * X) / kT;
    } else if (n === 1) {
      // t = -1/k * ln(1-X)
      t_s = (-1 / kT) * Math.log(1 - X);
    } else {
      // t = [ (1-X)^(1-n) - 1 ] / [ k * C0^(n-1) * (n-1) ]
      const numerator = Math.pow(1 - X, 1 - n) - 1;
      const denom = kT * Math.pow(C0, n - 1) * (n - 1);
      t_s = numerator / denom;
    }

    return t_s; // already in seconds
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
                Compute the reaction time required to achieve conversion X in a closed batch reactor with Arrhenius‐corrected kinetics.
              </p>
            </div>

            <ReactorCalculator
              title="Batch Reactor Time Calculation"
              description="Uses the integral form of the batch‐reactor design equation with Arrhenius kinetics."
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
