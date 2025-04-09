
import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData } from "@/utils/formUtils";
import OptionCard from "../OptionCard";
import { Home, Trees, HomeIcon } from "lucide-react";

type DeploymentEnvironmentProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const DeploymentEnvironment: React.FC<DeploymentEnvironmentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handleEnvironmentSelect = (environment: "Indoor" | "Outdoor" | "Both") => {
    setFormData((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        environment,
      },
    }));
  };

  return (
    <QuestionContainer
      title="Deployment Environment"
      description="Where will the IoT devices be deployed?"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.deployment.environment === null}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OptionCard
          icon={<Home />}
          title="Indoor"
          selected={formData.deployment.environment === "Indoor"}
          onClick={() => handleEnvironmentSelect("Indoor")}
        />
        <OptionCard
          icon={<Trees />}
          title="Outdoor"
          selected={formData.deployment.environment === "Outdoor"}
          onClick={() => handleEnvironmentSelect("Outdoor")}
        />
        <OptionCard
          icon={<div className="flex space-x-1"><Home className="w-5 h-5" /><Trees className="w-5 h-5" /></div>}
          title="Both Indoor & Outdoor"
          selected={formData.deployment.environment === "Both"}
          onClick={() => handleEnvironmentSelect("Both")}
        />
      </div>
      
      {formData.deployment.environment && (
        <div className="mt-6 p-4 bg-iot-light-blue rounded-md animate-fade-in">
          <h4 className="font-medium">Selected Environment: {formData.deployment.environment}</h4>
          {formData.deployment.environment === "Indoor" && (
            <p className="mt-2 text-sm">
              Indoor deployments typically require less robust enclosures but may need strong signal penetration through walls and floors.
            </p>
          )}
          {formData.deployment.environment === "Outdoor" && (
            <p className="mt-2 text-sm">
              Outdoor deployments need weatherproof enclosures and may require extended range capabilities.
            </p>
          )}
          {formData.deployment.environment === "Both" && (
            <p className="mt-2 text-sm">
              Mixed deployments need to balance indoor penetration with outdoor durability and range.
            </p>
          )}
        </div>
      )}
    </QuestionContainer>
  );
};

export default DeploymentEnvironment;
