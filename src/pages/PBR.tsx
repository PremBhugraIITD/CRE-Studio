import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const PBR = () => {
  const pbrInputs = [
    { label: "Conversion", name: "conversion", unit: "X" },
    { label: "Inlet Concentration", name: "initialConc", unit: "mol/L" },
    { label: "Flow Rate", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order", name: "order", unit: "n" },
    { label: "Temperature", name: "temperature", unit: "K" },
    { label: "Rate Constant", name: "k300", unit: "At 300K" },
    { label: "Activation Energy", name: "activationEnergy", unit: "kJ/mol" },
    { label: "Epsilon", name: "epsilon", unit: "ε" },
    { label: "Pressure‐Drop Param.", name: "alpha", unit: "α" },
  ];

  const calculatePBRCatalyst = (
    vals: Record<string, number>
  ): [number, number] => {
    const R = 8.314;

    // 1. Basic validations
    const {
      conversion: X,
      initialConc: C0_L,
      flowRate: F0_L,
      order: n,
      temperature: T,
      k300,
      activationEnergy: Ea_kJ,
      epsilon: ε = 0,
      alpha: α = 0,
    } = vals;

    if ([X, C0_L, F0_L, n, T, k300, Ea_kJ].some((v) => v == null || isNaN(v))) {
      alert("Please fill in all required fields with valid numbers.");
      throw new Error("Missing inputs");
    }
    if (X <= 0 || X >= 1) {
      alert("Conversion must be between 0 and 1.");
      throw new Error("Invalid conversion");
    }
    if (
      C0_L <= 0 ||
      F0_L <= 0 ||
      n <= 0 ||
      T <= 0 ||
      T > 2000 ||
      k300 <= 0 ||
      Ea_kJ < 0
    ) {
      alert("One or more inputs out of valid range (positive, T≤2000K).");
      throw new Error("Invalid input range");
    }
    if (α < 0) {
      alert("Epsilon and alpha must be >= 0.");
      throw new Error("Negative ε/α");
    }
    if (ε > 0 && α > 0) {
      alert("Cannot handle both ε>0 and α>0 simultaneously.");
      throw new Error("Mutually exclusive ε/α");
    }

    // 2. Convert to SI
    const C0_m3 = C0_L * 1e3; // mol/L → mol/m³
    const F0 = F0_L / 1000 / 3600; // L/hr → m³/s
    const FA0 = F0 * C0_m3; // mol/s
    const Ea = Ea_kJ * 1e3; // kJ/mol → J/mol

    // Arrhenius
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // Helper for CA without pressure drop
    const CA_noPD = (x: number) => (C0_m3 * (1 - x)) / (1 + ε * x);

    // Case 2 & liquid (ε>0 & α=0, or both zero): trapezoid
    if (α === 0) {
      const integrand = (x: number) => {
        const CA = CA_noPD(x);
        return FA0 / (kT * Math.pow(CA, n));
      };
      const steps = 1000,
        dX = X / steps;
      let sum = 0.5 * (integrand(0) + integrand(X));
      for (let i = 1; i < steps; i++) sum += integrand(i * dX);
      const W_kg = sum * dX; // actually mass equivalent
      const Cout_m3 = CA_noPD(X);
      const Cout_L = Cout_m3 / 1e3;
      if (!(W_kg > 0) || !(Cout_L >= 0)) {
        alert("Calculated values invalid; check inputs.");
        throw new Error("Invalid result");
      }
      return [W_kg, Cout_L];
    }

    // Case 3: pressure drop (ε=0 & α>0)
    let W = 0,
      x = 0,
      step = 0.001;
    while (x < X) {
      const pRat = Math.sqrt(Math.max(0, 1 - α * W));
      const CA = CA_noPD(x) * pRat;
      const rate = kT * Math.pow(CA, n);
      const dx = (rate / FA0) * step;
      x += dx;
      W += step;
      if (1 - α * W <= 0) {
        alert("Pressure drop too great before reaching desired conversion.");
        throw new Error("Nonphysical pressure drop");
      }
    }
    // final outlet conc with PD
    const pFinal = Math.sqrt(1 - α * W);
    const Cout_m3 = CA_noPD(X) * pFinal;
    const Cout_L = Cout_m3 / 1e3;
    if (!(W > 0) || !(Cout_L >= 0)) {
      alert("Calculated values invalid; check inputs.");
      throw new Error("Invalid result");
    }
    return [W, Cout_L];
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PBR Calculations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            <img
              src="/pbr.jpg"
              alt="PBR Reactor"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right */}
          <div>
            <p className="text-gray-600 mb-4">
              Computes catalyst weight (Kg) and outlet concentration (mol/L).
            </p>
            <ReactorCalculator
              title="Catalyst Weight & Outlet Concentration"
              description="Rate of reaction should follow a Power Law model in terms of the concentration of a single species only (rₐ = -kCₐⁿ). For gas-phase: enter ε (mole change). Pressure drop calculations can be done only with ε = 0."
              inputs={pbrInputs}
              calculateResult={calculatePBRCatalyst}
              resultLabels={["Catalyst Weight", "Outlet Conc."]}
              resultUnits={["kg", "mol/L"]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PBR;
