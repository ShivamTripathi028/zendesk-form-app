import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData } from "@/utils/formUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wifi, Signal, Network } from "lucide-react";

type ConnectivityOptionsProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const ConnectivityOptions: React.FC<ConnectivityOptionsProps> = ({
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

  const handleAdditionalOptionToggle = (option: string) => {
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

  return (
    <QuestionContainer
      title="Connectivity Options"
      description="Select network type and connectivity options"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.connectivity.lorawanType === null}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">LoRaWAN Network Type</h3>
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
          <h3 className="text-lg font-medium mb-3">Additional Connectivity Options</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 border rounded-md">
              <Checkbox 
                id="cellular"
                checked={formData.connectivity.options.includes("Cellular")}
                onCheckedChange={() => handleAdditionalOptionToggle("Cellular")}
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
                onCheckedChange={() => handleAdditionalOptionToggle("Wi-Fi")}
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
                onCheckedChange={() => handleAdditionalOptionToggle("Ethernet")}
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
    </QuestionContainer>
  );
};

export default ConnectivityOptions;
