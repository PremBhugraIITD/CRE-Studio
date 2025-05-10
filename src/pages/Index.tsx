import React from "react";
import Layout from "../components/Layout";
import ReactorTile from "../components/ReactorTile";

const Index = () => {
  const reactors = [
    {
      title: "Batch Reactor",
      description:
        "A closed system where all reactants are loaded at once and no mass enters or leaves during reaction.",
      path: "/batch",
      iconType: "batch" as const,
    },
    {
      title: "CSTR",
      description:
        "Continuous Stirred Tank Reactor with perfect mixing and continuous flow.",
      path: "/cstr",
      iconType: "cstr" as const,
    },
    {
      title: "PFR",
      description:
        "Plug Flow Reactor with flow in a tubular vessel and no axial mixing.",
      path: "/pfr",
      iconType: "pfr" as const,
    },
    {
      title: "PBR",
      description:
        "Packed Bed Reactor containing solid catalyst particles with fluid flow.",
      path: "/pbr",
      iconType: "pbr" as const,
    },
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-cre-navy">
          Chemical Reaction Engineering Calculator
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select a reactor type below to begin your calculations
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reactors.map((reactor) => (
            <ReactorTile
              key={reactor.title}
              title={reactor.title}
              description={reactor.description}
              path={reactor.path}
              iconType={reactor.iconType}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
