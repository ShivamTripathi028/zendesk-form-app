
import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData, deploymentScales } from "@/utils/formUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type DeploymentScaleProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const DeploymentScale: React.FC<DeploymentScaleProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handleScaleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      scale: value,
    }));
  };

  return (
    <QuestionContainer
      title="Deployment Scale"
      description="How many devices do you plan to deploy?"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.scale === ""}
    >
      <div className="space-y-6">
        <RadioGroup
          value={formData.scale}
          onValueChange={handleScaleChange}
          className="space-y-3"
        >
          {deploymentScales.map((scale) => (
            <div
              key={scale}
              className={`flex items-center space-x-2 p-4 border rounded-md transition-all ${
                formData.scale === scale
                  ? "border-iot-blue bg-iot-light-blue"
                  : "border-gray-200"
              }`}
            >
              <RadioGroupItem value={scale} id={scale} />
              <Label htmlFor={scale} className="flex-1 cursor-pointer">
                {scale}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {formData.scale && (
          <div className="p-4 bg-iot-light-blue rounded-md animate-fade-in">
            <h4 className="font-medium">Selected Scale: {formData.scale}</h4>
            <p className="mt-2 text-sm">
              {formData.scale === "Single Device" && 
                "Perfect for proof of concept or specific monitoring needs."}
              {formData.scale === "Small Deployment (1-10 devices)" && 
                "Suitable for small businesses or specific area monitoring."}
              {formData.scale === "Medium Deployment (11-50 devices)" && 
                "Ideal for medium-sized facilities or multi-location monitoring."}
              {formData.scale === "Large Deployment (50+ devices)" && 
                "Designed for large-scale industrial or commercial applications."}
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default DeploymentScale;
