
import React from 'react';
import Layout from '../components/Layout';
import ReactorCalculator from '../components/ReactorCalculator';

const PFR = () => {
  // Define inputs for PFR calculations
  const pfrInputs = [
    { label: "Inlet Concentration", name: "inletConc", unit: "mol/L" },
    { label: "Outlet Concentration", name: "outletConc", unit: "mol/L" },
    { label: "Flow Rate", name: "flowRate", unit: "L/min" },
    { label: "Rate Constant", name: "rateConstant", unit: "1/min" },
    { label: "Reaction Order", name: "reactionOrder", unit: "" },
  ];

  // Calculate PFR volume
  const calculatePFRVolume = (values: Record<string, number>) => {
    const { inletConc, outletConc, flowRate, rateConstant, reactionOrder } = values;
    
    let volume = 0;
    
    // First-order reaction
    if (reactionOrder === 1) {
      volume = (flowRate / rateConstant) * Math.log(inletConc / outletConc);
    }
    // Zero-order reaction
    else if (reactionOrder === 0) {
      volume = (flowRate * (inletConc - outletConc)) / rateConstant;
    }
    // Second-order reaction
    else if (reactionOrder === 2) {
      volume = (flowRate / rateConstant) * ((1 / outletConc) - (1 / inletConc));
    }
    // General formula for other reaction orders
    else {
      volume = (flowRate / rateConstant) * (1 / (reactionOrder - 1)) * 
               ((1 / Math.pow(outletConc, reactionOrder - 1)) - (1 / Math.pow(inletConc, reactionOrder - 1)));
    }
    
    return volume;
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">PFR Calculator</h1>
        
        <div className="mb-6">
          <p className="text-gray-600">
            A Plug Flow Reactor (PFR) is a tubular reactor where flow is assumed to move as a "plug" through 
            the reactor with no mixing in the axial direction. This calculator helps determine the required 
            reactor volume based on the kinetic parameters and desired conversion.
          </p>
        </div>

        <ReactorCalculator
          title="PFR Volume Calculation"
          description="Calculate the required reactor volume based on flow rate, concentrations, and reaction kinetics."
          inputs={pfrInputs}
          calculateResult={calculatePFRVolume}
          resultLabel="Reactor Volume"
          resultUnit="liters"
        />
      </div>
    </Layout>
  );
};

export default PFR;
