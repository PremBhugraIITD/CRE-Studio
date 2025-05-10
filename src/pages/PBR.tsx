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
    { label: "P / P₀ factor", name: "pressureFactor", unit: "" },
  ];

  const calculatePBRCatalyst = (vals: Record<string, number>) => {
    const R = 8.314; // J/(mol·K)

    // 1. Extract & convert inputs to SI
    const X_target = vals.conversion; // unitless
    const C0_liq = vals.initialConc * 1e3; // mol/L → mol/m³
    const F0 = vals.flowRate / 3600 / 1e3; // L/hr → m³/s
    const FA0 = F0 * C0_liq; // mol/s at inlet conditions
    const n = vals.order;
    const T = vals.temperature; // K
    const k300 = vals.k300; // 1/s·kg⁻¹
    const Ea = vals.activationEnergy * 1e3; // kJ/mol → J/mol
    const ε = vals.epsilon ?? 0; // default 0
    const φ = vals.pressureFactor ?? 1; // default 1

    // 2. Arrhenius correction of rate constant
    const kT = k300 * Math.exp((-Ea / R) * (1 / T - 1 / 300));

    // 3. Adjust inlet concentration for pressure
    //    C0_gas = C0_liq × (P/P0)
    // 4. Concentration profile in gas-phase:
    //    CA(X) = C0*(1 - X) / (1 + ε X)
    const CA = (X: number) => (C0_liq * φ * (1 - X)) / (1 + ε * X);

    // 5. Integrand for catalyst mass:
    //    dW/dX = FA0 / [ k(T) * CA(X)^n ]
    const integrand = (X: number) => FA0 / (kT * Math.pow(CA(X), n));

    // 6. Numerically integrate from 0 to X_target (trapezoidal rule)
    const steps = 1000;
    const dX = X_target / steps;
    let sum = 0.5 * (integrand(0) + integrand(X_target));
    for (let i = 1; i < steps; i++) {
      sum += integrand(i * dX);
    }
    const W_kg = sum * dX; // catalyst weight in kg

    return W_kg;
  };

  return (
    <Layout isReactorPage>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6 text-cre-navy">
          Packed Bed Reactor Catalyst Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: placeholder */}
          <div className="bg-[#ea384c] rounded-lg h-[300px] md:h-auto flex items-center justify-center text-white font-bold">
            PBR Reactor Image Placeholder
          </div>

          {/* Right column: calculator */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Integrates W = ∫₀ˣ FA₀ / [k(T)·Cₐ(X)ⁿ] dX to find catalyst mass
                (kg). For liquid phase, set ε = 0 and P/P₀ = 1.
              </p>
            </div>

            <ReactorCalculator
              title="PBR Catalyst Mass Calculation"
              description="Gas-phase PBR design with variable volume & Arrhenius kinetics."
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
