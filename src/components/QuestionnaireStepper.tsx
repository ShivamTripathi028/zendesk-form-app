
import React from "react";
import { Check } from "lucide-react";

type StepperProps = {
  steps: string[];
  currentStep: number;
};

const QuestionnaireStepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center items-center py-4 sm:py-8">
      <div className="flex flex-wrap justify-center items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-item ${currentStep === index + 1 ? "active" : ""} ${
              currentStep > index + 1 ? "complete" : ""
            }`}
          >
            <div
              className={`step ${currentStep === index + 1 ? "active" : ""} ${
                currentStep > index + 1 ? "complete" : ""
              }`}
            >
              {currentStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <p className="text-center mt-2 text-xs sm:text-sm">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireStepper;
