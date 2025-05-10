import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const PFR = () => {
  const pfrInputs = [
    { label: "Conversion (X)", name: "conversion", unit: "" },
    { label: "Initial Conc. C₀ (mol/L)", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow F₀ (L/hr)", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order (n)", name: "order", unit: "" },
    { label: "Temperature T (K)", name: "temperature", unit: "K" },
    { label: "k @ 300 K (1/s)", name: "k300", unit: "1/s" },
    {
      label: "Activation Energy Eₐ (kJ/mol)",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
  ];

  const calculatePFRVolume = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. extract & convert
    const X = vals.conversion; // unitless
    const C0 = vals.initialConc * 1e3; // mol/L → mol/m³
    const F0 = vals.flowRate / 3600 / 1e3; // L/hr → m³/s
    const n = vals.order;
    const T = vals.temperature; // K
    const k300 = vals.k300; // 1/s
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. evaluate the integral
    let V_m3: number;
    if (n === 1) {
      // ∫0^X (1-X)^(-1) dX = -ln(1-X)
      V_m3 = (F0 / (kT * Math.pow(C0, n - 1))) * -Math.log(1 - X);
    } else {
      // ∫0^X (1-X)^(-n) dX = [ (1-X)^(1-n) - 1 ]/(1-n)
      const factor = ((1 - X) ** (1 - n) - 1) / (1 - n);
      V_m3 = -(F0 / (kT * Math.pow(C0, n - 1))) * factor;
    }

    // 4. convert to liters
    return V_m3 * 1e3;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PFR Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            PFR Reactor Image Placeholder
          </div>

          {/* Right: calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Compute the tubular reactor volume based on conversion, kinetics
                and flow.
              </p>
            </div>

            <ReactorCalculator
              title="PFR Volume Calculation"
              description="Uses conversion-integral form of the PFR design equation with Arrhenius kinetics."
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
