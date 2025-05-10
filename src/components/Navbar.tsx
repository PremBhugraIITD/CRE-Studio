
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { BeakerIcon } from './icons/BeakerIcon';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BeakerIcon className="h-8 w-8 text-cre-navy" />
          <span className="text-xl font-bold text-cre-navy">CRE Calculator</span>
        </Link>
        
        <div className="hidden md:flex space-x-1">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/batch">
            <Button variant="ghost">Batch</Button>
          </Link>
          <Link to="/cstr">
            <Button variant="ghost">CSTR</Button>
          </Link>
          <Link to="/pfr">
            <Button variant="ghost">PFR</Button>
          </Link>
          <Link to="/pbr">
            <Button variant="ghost">PBR</Button>
          </Link>
        </div>
        
        <div className="md:hidden">
          <Button variant="outline" size="sm">Menu</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
