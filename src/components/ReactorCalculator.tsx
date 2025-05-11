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
  calculateResult: (values: Record<string, number>) => number;
  resultLabel: string;
  resultUnit: string;
}

const ReactorCalculator = ({
  title,
  description,
  inputs,
  calculateResult,
  resultLabel,
  resultUnit,
}: ReactorCalculatorProps) => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);

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
      const calculatedResult = calculateResult(values);
      setResult(calculatedResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(null);
    }
  };

  const handleReset = () => {
    setValues({});
    setResult(null);
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
                {input.label} ({input.unit})
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

        {result !== null && (
          <div className="mt-6 p-4 bg-cre-light-gray rounded-lg border border-gray-300">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Result:</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-medium">{resultLabel}:</span>
              <span className="text-2xl font-bold text-cre-navy">
                {result.toFixed(4)} {resultUnit}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReactorCalculator;
