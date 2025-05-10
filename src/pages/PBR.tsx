import React from "react";
import Layout from "../components/Layout";
import ReactorCalculator from "../components/ReactorCalculator";

const PBR = () => {
  const pbrInputs = [
    { label: "Conversion (X)", name: "conversion", unit: "" },
    { label: "Initial Conc. C₀ (mol/L)", name: "initialConc", unit: "mol/L" },
    { label: "Volumetric Flow F₀ (L/hr)", name: "flowRate", unit: "L/hr" },
    { label: "Reaction Order (n)", name: "order", unit: "" },
    { label: "Temperature T (K)", name: "temperature", unit: "K" },
    { label: "k @ 300 K (1/s·kg⁻¹)", name: "k300", unit: "1/s·kg⁻¹" },
    {
      label: "Activation Energy Eₐ (kJ/mol)",
      name: "activationEnergy",
      unit: "kJ/mol",
    },
    { label: "Epsilon (Δn/n₀)", name: "epsilon", unit: "" },
    { label: "Pressure‐drop coeff. α", name: "alpha", unit: "" },
  ];

  const calculatePBRCatalyst = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. extract & convert to SI
    const X_target = vals.conversion; // target conversion
    const C0_liq = vals.initialConc * 1e3; // mol/L → mol/m³
    const F0 = vals.flowRate / 3600 / 1e3; // L/hr → m³/s
    const FA0 = F0 * C0_liq; // mol/s (inlet)
    const n = vals.order;
    const T = vals.temperature; // K
    const k300 = vals.k300; // 1/s·kg⁻¹
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0; // default 0
    const α = vals.alpha ?? 0; // pressure‐drop coeff.

    // 2. Arrhenius correction
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. ODE definitions:
    //    dX/dW = (kT * CA(X)^n) / FA0
    //    dp/dW = - (α / (2 p)) * (1 + ε X)
    //    where CA(X) = C0_liq*(1-X)/(1+ε X) * p
    const CA = (X: number, p: number) => ((C0_liq * (1 - X)) / (1 + ε * X)) * p;

    const dXdW = (X: number, p: number) => {
      const rate = kT * Math.pow(CA(X, p), n);
      return rate / FA0;
    };

    const dPdW = (X: number, p: number) => -(α / (2 * p)) * (1 + ε * X);

    // 4. Integrate until X ≥ X_target
    let W = 0; // kg
    let X = 0; // conversion
    let p = 1; // P/P0 starts at 1
    const dW = X_target > 0 ? 0.001 : 0.001; // step in kg

    while (X < X_target) {
      // advance X and p by first‐order Euler
      const dx = dXdW(X, p) * dW;
      const dp = dPdW(X, p) * dW;

      X += dx;
      p += dp;
      W += dW;

      if (p <= 0) {
        throw new Error(
          "Non‐physical pressure drop (p ≤ 0). Try reducing α or dW."
        );
      }
    }

    return W; // kg
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          PBR Catalyst Mass Calculator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            PBR Reactor Image Placeholder
          </div>
          {/* Right: calculator */}
          <div>
            <p className="text-gray-600 mb-4">
              Integrates:
              <br />
              • &nbsp; dX/dW = k(T)·Cₐ(X,p)ⁿ ∕ Fₐ₀
              <br />
              • &nbsp; dp/dW = –[α ⁄ (2p)]·(1+εX)
              <br />
              until X reaches target, returning W (kg). Use ε=0 for no volume
              change.
            </p>
            <ReactorCalculator
              title="Packed Bed Reactor w/ Pressure Drop"
              description="Solves coupled ODEs for conversion & pressure drop to find catalyst mass."
              inputs={pbrInputs}
              calculateResult={calculatePBRCatalyst}
              resultLabel="Catalyst Mass"
              resultUnit="kg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PBR;
