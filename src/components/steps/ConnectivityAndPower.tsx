
import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData, powerOptions } from "@/utils/formUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wifi, Signal, Network, Battery, Sun, Plug } from "lucide-react";

type ConnectivityAndPowerProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const ConnectivityAndPower: React.FC<ConnectivityAndPowerProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handleLoRaWANTypeChange = (value: "Public" | "Private") => {
    setFormData((prev) => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        lorawanType: value,
      },
    }));
  };

  const handleConnectivityOptionToggle = (option: string) => {
    setFormData((prev) => {
      const currentOptions = [...prev.connectivity.options];
      
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          connectivity: {
            ...prev.connectivity,
            options: currentOptions.filter((item) => item !== option),
          },
        };
      } else {
        return {
          ...prev,
          connectivity: {
            ...prev.connectivity,
            options: [...currentOptions, option],
          },
        };
      }
    });
  };

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
      title="Connectivity & Power Options"
      description="Select network type, connectivity options, and power sources"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.connectivity.lorawanType === null || formData.power.length === 0}
    >
      <div className="space-y-8">
        {/* Connectivity Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Connectivity Options</h3>
          
          <div>
            <h4 className="text-lg font-medium mb-3">LoRaWAN Network Type</h4>
            <RadioGroup
              value={formData.connectivity.lorawanType || ""}
              onValueChange={(value) => handleLoRaWANTypeChange(value as "Public" | "Private")}
              className="space-y-3"
            >
              <div className={`flex items-center space-x-2 p-4 border rounded-md transition-all ${
                formData.connectivity.lorawanType === "Public"
                  ? "border-iot-blue bg-iot-light-blue"
                  : "border-gray-200"
              }`}>
                <RadioGroupItem value="Public" id="public" />
                <Label htmlFor="public" className="flex-1 cursor-pointer">
                  Public LoRaWAN Network (e.g., The Things Network)
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-4 border rounded-md transition-all ${
                formData.connectivity.lorawanType === "Private"
                  ? "border-iot-blue bg-iot-light-blue"
                  : "border-gray-200"
              }`}>
                <RadioGroupItem value="Private" id="private" />
                <Label htmlFor="private" className="flex-1 cursor-pointer">
                  Private LoRaWAN Network
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-3">Additional Connectivity Options</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="cellular"
                  checked={formData.connectivity.options.includes("Cellular")}
                  onCheckedChange={() => handleConnectivityOptionToggle("Cellular")}
                />
                <div className="space-y-1">
                  <Label htmlFor="cellular" className="flex items-center space-x-2">
                    <Signal className="h-4 w-4" />
                    <span>Cellular (4G/5G Backup)</span>
                  </Label>
                  <p className="text-sm text-gray-500">
                    Provides backup connectivity when LoRaWAN is unavailable.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="wifi"
                  checked={formData.connectivity.options.includes("Wi-Fi")}
                  onCheckedChange={() => handleConnectivityOptionToggle("Wi-Fi")}
                />
                <div className="space-y-1">
                  <Label htmlFor="wifi" className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4" />
                    <span>Wi-Fi</span>
                  </Label>
                  <p className="text-sm text-gray-500">
                    Enables connectivity to local Wi-Fi networks.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="ethernet"
                  checked={formData.connectivity.options.includes("Ethernet")}
                  onCheckedChange={() => handleConnectivityOptionToggle("Ethernet")}
                />
                <div className="space-y-1">
                  <Label htmlFor="ethernet" className="flex items-center space-x-2">
                    <Network className="h-4 w-4" />
                    <span>Ethernet</span>
                  </Label>
                  <p className="text-sm text-gray-500">
                    Provides wired connectivity for stable, high-bandwidth applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6"></div>
        
        {/* Power Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Power Source Options</h3>
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
        </div>
        
        {/* Summary Section */}
        {(formData.connectivity.lorawanType || formData.connectivity.options.length > 0 || formData.power.length > 0) && (
          <div className="p-4 bg-iot-light-blue rounded-md animate-fade-in">
            <h4 className="font-medium">Your Selections:</h4>
            <div className="mt-2 space-y-2">
              {formData.connectivity.lorawanType && (
                <div>
                  <span className="font-medium">LoRaWAN Network:</span> {formData.connectivity.lorawanType}
                </div>
              )}
              
              {formData.connectivity.options.length > 0 && (
                <div>
                  <span className="font-medium">Additional Connectivity:</span> {formData.connectivity.options.join(", ")}
                </div>
              )}
              
              {formData.power.length > 0 && (
                <div>
                  <span className="font-medium">Power Sources:</span> {formData.power.join(", ")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default ConnectivityAndPower;
