import React from "react";
import Layout from "../components/Layout";
import ReactorTile from "../components/ReactorTile";
import { CSTRIcon } from "../components/icons/CSTRIcon";
import { BatchIcon } from "../components/icons/BatchIcon";
import { PFRIcon } from "../components/icons/PFRIcon";
import { PBRIcon } from "../components/icons/PBRIcon";
import PBR from "./PBR";

const Index = () => {
  const reactors = [
    {
      title: "Batch Reactor",
      description:
        "A closed system where all reactants are loaded at once and no mass enters or leaves during reaction.",
      path: "/batch",
      iconType: BatchIcon,
    },
    {
      title: "CSTR",
      description:
        "Continuous Stirred Tank Reactor with perfect mixing and continuous flow.",
      path: "/cstr",
      iconType: CSTRIcon,
    },
    {
      title: "PFR",
      description:
        "Plug Flow Reactor with flow in a tubular vessel and no axial mixing.",
      path: "/pfr",
      iconType: PFRIcon,
    },
    {
      title: "PBR",
      description:
        "Packed Bed Reactor containing solid catalyst particles with fluid flow.",
      path: "/pbr",
      iconType: PBRIcon,
    },
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-cre-navy">
          CRE Studio (An Isothermal Reactor Design Tool)
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
              Icon={reactor.iconType} // Pass the icon component
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
