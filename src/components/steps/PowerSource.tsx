
import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData, powerOptions } from "@/utils/formUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Battery, Sun, Plug } from "lucide-react";

type PowerSourceProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const PowerSource: React.FC<PowerSourceProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handlePowerOptionToggle = (option: string) => {
    setFormData((prev) => {
      const currentOptions = [...prev.power];
      
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          power: currentOptions.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          power: [...currentOptions, option],
        };
      }
    });
  };

  const getIconForPowerOption = (option: string) => {
    switch (option) {
      case "Battery Powered":
        return <Battery className="h-5 w-5" />;
      case "Solar Powered":
        return <Sun className="h-5 w-5" />;
      case "Mains Powered":
        return <Plug className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <QuestionContainer
      title="Power Source Availability"
      description="Select the available power sources for your IoT devices"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.power.length === 0}
    >
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {powerOptions.map((option) => (
            <div
              key={option}
              className={`p-4 border rounded-md cursor-pointer transition-all ${
                formData.power.includes(option)
                  ? "border-iot-blue bg-iot-light-blue"
                  : "border-gray-200 hover:border-iot-blue"
              }`}
              onClick={() => handlePowerOptionToggle(option)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox 
                  checked={formData.power.includes(option)}
                  onCheckedChange={() => handlePowerOptionToggle(option)}
                  id={option.replace(/\s+/g, '-').toLowerCase()}
                />
                <div className="space-y-1.5">
                  <Label 
                    htmlFor={option.replace(/\s+/g, '-').toLowerCase()}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    {getIconForPowerOption(option)}
                    <span>{option}</span>
                  </Label>
                  <p className="text-xs text-gray-500">
                    {option === "Battery Powered" && 
                      "Devices run on batteries, ideal for remote locations without power infrastructure."}
                    {option === "Solar Powered" && 
                      "Devices powered by solar panels, perfect for outdoor applications with sufficient sunlight."}
                    {option === "Mains Powered" && 
                      "Devices connected to electrical grid, providing consistent power for high-demand applications."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {formData.power.length > 0 && (
          <div className="p-4 bg-iot-light-blue rounded-md animate-fade-in">
            <h4 className="font-medium">Selected Power Sources:</h4>
            <ul className="list-disc list-inside mt-2">
              {formData.power.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default PowerSource;
