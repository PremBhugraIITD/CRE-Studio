import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BatchIcon } from "./icons/BatchIcon";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-cre-navy shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BatchIcon className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">CRE Calculator</span>
        </Link>

        <div className="hidden md:flex space-x-1">
          <Link to="/">
            <Button
              variant="ghost"
              className={`text-white ${
                isActive("/") ? "bg-black" : "hover:text-black"
              }`}
            >
              Home
            </Button>
          </Link>
          <Link to="/batch">
            <Button
              variant="ghost"
              className={`text-white ${
                isActive("/batch") ? "bg-black" : "hover:text-black"
              }`}
            >
              Batch
            </Button>
          </Link>
          <Link to="/cstr">
            <Button
              variant="ghost"
              className={`text-white ${
                isActive("/cstr") ? "bg-black" : "hover:text-black"
              }`}
            >
              CSTR
            </Button>
          </Link>
          <Link to="/pfr">
            <Button
              variant="ghost"
              className={`text-white ${
                isActive("/pfr") ? "bg-black" : "hover:text-black"
              }`}
            >
              PFR
            </Button>
          </Link>
          <Link to="/pbr">
            <Button
              variant="ghost"
              className={`text-white ${
                isActive("/pbr") ? "bg-black" : "hover:text-black"
              }`}
            >
              PBR
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Button variant="outline" size="sm" className="text-white bg-black border-black">
            Menu
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
