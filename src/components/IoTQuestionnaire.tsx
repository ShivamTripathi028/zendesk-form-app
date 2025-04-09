
import React, { useState } from "react";
import { FormData, initialFormData, isStepValid } from "@/utils/formUtils";
import ClientInformation from "./steps/ClientInformation";
import RegionSelection from "./steps/RegionSelection";
import DeploymentEnvironment from "./steps/DeploymentEnvironment";
import ApplicationType from "./steps/ApplicationType";
import DeploymentScale from "./steps/DeploymentScale";
import ConnectivityAndPower from "./steps/ConnectivityAndPower";
import AdditionalDetails from "./steps/AdditionalDetails";
import SummaryPage from "./steps/SummaryPage";

const IoTQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSummary, setShowSummary] = useState(false);

  const steps = [
    "Client Info",
    "Region",
    "Environment",
    "Application",
    "Scale",
    "Connectivity & Power",
    "Details",
  ];

  const nextStep = () => {
    if (currentStep === steps.length) {
      setShowSummary(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (showSummary) {
      setShowSummary(false);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowSummary(false);
  };

  const renderStep = () => {
    if (showSummary) {
      return (
        <SummaryPage
          formData={formData}
          onPrev={prevStep}
          onReset={resetForm}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ClientInformation
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <RegionSelection
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <DeploymentEnvironment
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ApplicationType
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <DeploymentScale
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <ConnectivityAndPower
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <AdditionalDetails
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center mb-2 px-4 py-1 bg-iot-light-blue rounded-full text-sm font-medium text-iot-blue">
          Step {currentStep} of {steps.length}
          {showSummary && <span> - Summary</span>}
        </div>
        <h3 className="text-xl font-medium text-gray-700">{showSummary ? "Review" : steps[currentStep - 1]}</h3>
      </div>
      <div className="mt-4">{renderStep()}</div>
    </div>
  );
};

export default IoTQuestionnaire;
