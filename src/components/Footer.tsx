import React from "react";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  const teamMembers = [
    { name: "Prem Bhugra", email: "ch7221038@iitd.ac.in" },
    { name: "Shaurya Kumar Maurya", email: "ch7221495@iitd.ac.in" },
    { name: "Rahul Arvind Masand", email: "ch7221476@iitd.ac.in" },
    { name: "Shubham Chawla", email: "ch7221507@iitd.ac.in" },
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
              <p className="font-medium">Instructor's Name</p>
              <p className="text-sm text-gray-300">Professor Manjesh Kumar</p>
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
                <a
                  href="mailto:ch7221038@iitd.ac.in"
                  className="flex items-center hover:text-cre-teal transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Email Us
                </a>
              </div>
            </div>

            <a
              href="https://home.iitd.ac.in/"
              target="_blank"
              className="absolute h-[20%] w-[12%] ml-[23%] mt-4"
            >
              <img src="/iitd-logo.png" alt="IIT Delhi Logo" className="w-auto h-auto"/>
            </a>

            <p className="text-sm mt-6 text-gray-300">
              © {new Date().getFullYear()} Copyright IIT Delhi. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
