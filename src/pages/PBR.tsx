
import React from 'react';
import Layout from '../components/Layout';
import ReactorCalculator from '../components/ReactorCalculator';

const PBR = () => {
  // Define inputs for PBR calculations
  const pbrInputs = [
    { label: "Inlet Concentration", name: "inletConc", unit: "mol/L" },
    { label: "Outlet Concentration", name: "outletConc", unit: "mol/L" },
    { label: "Flow Rate", name: "flowRate", unit: "L/min" },
    { label: "Catalyst Density", name: "catalystDensity", unit: "kg/L" },
    { label: "Rate Constant", name: "rateConstant", unit: "L/min·kg" },
    { label: "Reaction Order", name: "reactionOrder", unit: "" },
  ];

  // Calculate PBR catalyst weight
  const calculatePBRCatalyst = (values: Record<string, number>) => {
    const { 
      inletConc, 
      outletConc, 
      flowRate, 
      catalystDensity,
      rateConstant, 
      reactionOrder 
    } = values;
    
    let catalystWeight = 0;
    
    // First-order reaction
    if (reactionOrder === 1) {
      catalystWeight = (flowRate / rateConstant) * Math.log(inletConc / outletConc);
    }
    // Zero-order reaction
    else if (reactionOrder === 0) {
      catalystWeight = (flowRate * (inletConc - outletConc)) / rateConstant;
    }
    // Second-order reaction
    else if (reactionOrder === 2) {
      catalystWeight = (flowRate / rateConstant) * ((1 / outletConc) - (1 / inletConc));
    }
    // General formula for other reaction orders
    else {
      catalystWeight = (flowRate / rateConstant) * (1 / (reactionOrder - 1)) * 
                      ((1 / Math.pow(outletConc, reactionOrder - 1)) - (1 / Math.pow(inletConc, reactionOrder - 1)));
    }
    
    // Calculate volume from catalyst weight and density
    const reactorVolume = catalystWeight / catalystDensity;
    
    return reactorVolume;
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">PBR Calculator</h1>
        
        <div className="mb-6">
          <p className="text-gray-600">
            A Packed Bed Reactor (PBR) contains solid catalyst particles with fluid flowing through the bed. 
            This calculator helps determine the required reactor volume based on catalyst properties, 
            flow parameters, and desired conversion.
          </p>
        </div>

        <ReactorCalculator
          title="PBR Volume Calculation"
          description="Calculate the required reactor volume based on catalyst properties, flow rate, and reaction kinetics."
          inputs={pbrInputs}
          calculateResult={calculatePBRCatalyst}
          resultLabel="Reactor Volume"
          resultUnit="liters"
        />
      </div>
    </Layout>
  );
};

export default PBR;
