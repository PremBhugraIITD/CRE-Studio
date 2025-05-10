import React from "react";
import { Link } from "react-router-dom";
import { BeakerIcon } from "./icons/BeakerIcon";

interface ReactorTileProps {
  title: string;
  description: string;
  path: string;
  iconType: "batch" | "cstr" | "pfr" | "pbr";
}

const ReactorTile = ({
  title,
  description,
  path,
  iconType,
}: ReactorTileProps) => {
  return (
    <Link to={path} className="block h-full">
      <div className="reactor-tile">
        <div className="flex justify-center mb-4">
          <BeakerIcon className="h-16 w-16 text-cre-navy" />
        </div>
        <h3 className="text-xl font-bold text-center text-cre-navy mb-2">
          {title}
        </h3>
        <p className="text-center text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default ReactorTile;
