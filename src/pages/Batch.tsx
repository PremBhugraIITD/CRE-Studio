import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const Batch = () => {
  // Define inputs for batch reactor calculations
  const batchInputs = [
    { label: "Initial Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Final Concentration", name: "finalConc", unit: "mol/L" },
    { label: "Rate Constant", name: "rateConstant", unit: "1/min" },
    { label: "Reaction Order", name: "reactionOrder", unit: "" },
  ];

  // Calculate batch reactor volume
  const calculateBatchVolume = (values: Record<string, number>) => {
    const { initialConc, finalConc, rateConstant, reactionOrder } = values;
    let time = 0;

    // First-order reaction time calculation
    if (reactionOrder === 1) {
      time = (1 / rateConstant) * Math.log(initialConc / finalConc);
    }
    // Zero-order reaction time calculation
    else if (reactionOrder === 0) {
      time = (initialConc - finalConc) / rateConstant;
    }
    // Second-order reaction time calculation
    else if (reactionOrder === 2) {
      time = (1 / rateConstant) * (1 / finalConc - 1 / initialConc);
    }
    // General formula for other reaction orders
    else {
      time =
        (1 / rateConstant) *
        (1 / (reactionOrder - 1)) *
        (1 / Math.pow(finalConc, reactionOrder - 1) -
          1 / Math.pow(initialConc, reactionOrder - 1));
    }

    return time;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          Batch Reactor Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reactor image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            Batch Reactor Image Placeholder
          </div>

          {/* Right column - Reactor calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                A batch reactor is a closed system where all reactants are
                loaded at once, and the reaction proceeds with time. This
                calculator helps determine the time required for a reaction
                based on the kinetic parameters and conversion.
              </p>
            </div>

            <ReactorCalculator
              title="Batch Reactor Time Calculation"
              description="Calculate the time required to achieve desired conversion in a batch reactor."
              inputs={batchInputs}
              calculateResult={calculateBatchVolume}
              resultLabel="Reaction Time"
              resultUnit="minutes"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Batch;
