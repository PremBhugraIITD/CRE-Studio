import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BatchIcon } from "./icons/BatchIcon";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle dropdown

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-cre-navy shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BatchIcon className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">CRE Calculator</span>
        </Link>

        {/* Desktop Links */}
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-black border-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle dropdown
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      <div
        className={`md:hidden bg-cre-navy text-white border-t border-gray-700 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <div
            className={`p-3 ${
              isActive("/") ? "bg-black" : "hover:bg-gray-800"
            }`}
          >
            Home
          </div>
        </Link>
        <Link to="/batch" onClick={() => setIsMenuOpen(false)}>
          <div
            className={`p-3 ${
              isActive("/batch") ? "bg-black" : "hover:bg-gray-800"
            }`}
          >
            Batch
          </div>
        </Link>
        <Link to="/cstr" onClick={() => setIsMenuOpen(false)}>
          <div
            className={`p-3 ${
              isActive("/cstr") ? "bg-black" : "hover:bg-gray-800"
            }`}
          >
            CSTR
          </div>
        </Link>
        <Link to="/pfr" onClick={() => setIsMenuOpen(false)}>
          <div
            className={`p-3 ${
              isActive("/pfr") ? "bg-black" : "hover:bg-gray-800"
            }`}
          >
            PFR
          </div>
        </Link>
        <Link to="/pbr" onClick={() => setIsMenuOpen(false)}>
          <div
            className={`p-3 ${
              isActive("/pbr") ? "bg-black" : "hover:bg-gray-800"
            }`}
          >
            PBR
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;