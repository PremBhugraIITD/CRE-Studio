import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ReactorInput {
  label: string;
  name: string;
  unit: string;
}

interface ReactorCalculatorProps {
  title: string;
  description: string;
  inputs: ReactorInput[];
  calculateResult: (values: Record<string, number>) => [number, number]; // Updated to return an array
  resultLabels: [string, string]; // Updated to handle two result labels
  resultUnits: [string, string]; // Updated to handle two result units
}

const ReactorCalculator = ({
  title,
  description,
  inputs,
  calculateResult,
  resultLabels,
  resultUnits,
}: ReactorCalculatorProps) => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<[number, number] | null>(null); // Updated to store two results

  const handleInputChange = (name: string, value: string) => {
    if (value === "") {
      setValues((prev) => {
        const updatedValues = { ...prev };
        delete updatedValues[name]; // Remove the key when the input is empty
        return updatedValues;
      });
    } else {
      const numValue = parseFloat(value);
      setValues((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    }
  };

  const handleCalculate = () => {
    try {
      const calculatedResults = calculateResult(values); // Get two results
      setResults(calculatedResults);
    } catch (error) {
      console.error("Calculation error:", error);
      setResults(null);
    }
  };

  const handleReset = () => {
    setValues({});
    setResults(null);
  };

  return (
    <Card className="calculator-section">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-cre-navy">
          {title}
        </CardTitle>
        <p className="text-center text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inputs.map((input) => (
            <div key={input.name} className="input-field">
              <label htmlFor={input.name} className="input-label">
                {input.label} ({input.unit}) :
              </label>
              <input
                id={input.name}
                type="number"
                value={values[input.name] ?? ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                className="calculator-input"
                placeholder={`Enter ${input.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={handleCalculate}
            className="bg-cre-navy hover:bg-cre-navy/90"
          >
            Calculate
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {results !== null && (
          <div className="mt-6 p-4 bg-cre-light-gray rounded-lg border border-gray-300">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Results:</h3>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">{resultLabels[0]}:</span>
                <span className="text-2xl font-bold text-cre-navy">
                  {results[0].toFixed(8)} {resultUnits[0]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">{resultLabels[1]}:</span>
                <span className="text-2xl font-bold text-cre-navy">
                  {results[1].toFixed(4)} {resultUnits[1]}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReactorCalculator;
