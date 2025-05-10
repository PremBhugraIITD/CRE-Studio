
import React from 'react';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const teamMembers = [
    { name: "Team Member 1", email: "member1@example.com" },
    { name: "Team Member 2", email: "member2@example.com" },
    { name: "Team Member 3", email: "member3@example.com" },
    { name: "Team Member 4", email: "member4@example.com" },
  ];
  
  return (
    <footer className="bg-cre-navy text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-300">{member.email}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="font-medium">Professor</p>
              <p className="text-sm text-gray-300">Dr. Jane Smith</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://home.iitd.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-cre-teal transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  IIT Delhi
                </a>
                <a 
                  href="https://www.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-cre-teal transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Google
                </a>
              </div>
            </div>
            
            <p className="text-sm mt-6 text-gray-300">
              © {new Date().getFullYear()} Chemical Reaction Engineering Calculator
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
