import React from "react";
import { Link } from "react-router-dom";

interface ReactorTileProps {
  title: string;
  description: string;
  path: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // Prop for the SVG component
}

const ReactorTile = ({ title, description, path, Icon }: ReactorTileProps) => {
  return (
    <Link to={path} className="block h-full">
      <div className="reactor-tile">
        <div className="flex justify-center mb-4">
          <Icon className="h-16 w-16 text-cre-grey" />{" "}
          {/* Render the passed SVG */}
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
