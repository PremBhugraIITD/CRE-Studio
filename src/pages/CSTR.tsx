
import React from 'react';
import Layout from '../components/Layout';
import ReactorCalculator from '../components/ReactorCalculator';

const CSTR = () => {
  // Define inputs for CSTR calculations
  const cstrInputs = [
    { label: "Inlet Concentration", name: "inletConc", unit: "mol/L" },
    { label: "Outlet Concentration", name: "outletConc", unit: "mol/L" },
    { label: "Flow Rate", name: "flowRate", unit: "L/min" },
    { label: "Rate Constant", name: "rateConstant", unit: "1/min" },
    { label: "Reaction Order", name: "reactionOrder", unit: "" },
  ];

  // Calculate CSTR volume
  const calculateCSTRVolume = (values: Record<string, number>) => {
    const { inletConc, outletConc, flowRate, rateConstant, reactionOrder } = values;
    
    let reactionRate;
    
    // Calculate reaction rate based on order
    if (reactionOrder === 0) {
      reactionRate = rateConstant;
    } else if (reactionOrder === 1) {
      reactionRate = rateConstant * outletConc;
    } else {
      reactionRate = rateConstant * Math.pow(outletConc, reactionOrder);
    }
    
    // Calculate volume using CSTR design equation
    const volume = (flowRate * (inletConc - outletConc)) / reactionRate;
    
    return volume;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">CSTR Calculator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reactor image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            CSTR Reactor Image Placeholder
          </div>
          
          {/* Right column - Reactor calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                A Continuous Stirred Tank Reactor (CSTR) is a common reactor type where reactants are continuously 
                fed while products are continuously removed. The reactor contents are well-mixed, resulting in uniform 
                conditions throughout the reactor.
              </p>
            </div>

            <ReactorCalculator
              title="CSTR Volume Calculation"
              description="Calculate the required reactor volume based on flow rate, concentrations, and reaction kinetics."
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
