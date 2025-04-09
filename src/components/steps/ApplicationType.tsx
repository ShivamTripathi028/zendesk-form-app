
import React, { useState } from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData, applicationTypes } from "@/utils/formUtils";
import { Label } from "@/components/ui/label";
import { Cpu, Radio as RadioIcon, Power, Navigation, Plus } from "lucide-react";
import OptionCard from "../OptionCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type ApplicationTypeProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const ApplicationType: React.FC<ApplicationTypeProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const [selectedType, setSelectedType] = useState(formData.application.type);
  const [otherSubtype, setOtherSubtype] = useState(formData.application.otherSubtype || "");
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setFormData((prev) => ({
      ...prev,
      application: {
        type,
        subtypes: [],
        otherSubtype: prev.application.otherSubtype
      },
    }));
  };
  
  const handleSubtypeToggle = (subtype: string) => {
    setFormData((prev) => {
      const currentSubtypes = [...prev.application.subtypes];
      
      if (currentSubtypes.includes(subtype)) {
        return {
          ...prev,
          application: {
            ...prev.application,
            subtypes: currentSubtypes.filter((item) => item !== subtype),
          },
        };
      } else {
        return {
          ...prev,
          application: {
            ...prev.application,
            subtypes: [...currentSubtypes, subtype],
          },
        };
      }
    });
  };
  
  const handleOtherSubtypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherSubtype(value);
    
    setFormData((prev) => ({
      ...prev,
      application: {
        ...prev.application,
        otherSubtype: value
      }
    }));
    
    // Add or remove "Other" from subtypes based on whether there's text
    if (value && !formData.application.subtypes.includes("Other")) {
      handleSubtypeToggle("Other");
    } else if (!value && formData.application.subtypes.includes("Other")) {
      handleSubtypeToggle("Other");
    }
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "Monitoring":
        return <Cpu />;
      case "Communication":
        return <RadioIcon />;
      case "Control & Automation":
        return <Power />;
      case "Asset Tracking":
        return <Navigation />;
      default:
        return <Cpu />;
    }
  };
  
  const selectedAppType = applicationTypes.find(
    (app) => app.type === selectedType
  );
  
  return (
    <QuestionContainer
      title="Application Type"
      description="What is the primary use case for your IoT solution?"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.application.type === "" || formData.application.subtypes.length === 0}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Select Application Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {applicationTypes.map((app) => (
              <OptionCard
                key={app.type}
                icon={getIconForType(app.type)}
                title={app.type}
                selected={selectedType === app.type}
                onClick={() => handleTypeSelect(app.type)}
              />
            ))}
          </div>
        </div>
        
        {selectedType && selectedAppType && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-3">Select Application Subtypes (Choose one or more)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedAppType.subtypes.map((subtype) => (
                <div
                  key={subtype}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    formData.application.subtypes.includes(subtype)
                      ? "border-iot-blue bg-iot-light-blue"
                      : "border-gray-200 hover:border-iot-blue"
                  }`}
                  onClick={() => handleSubtypeToggle(subtype)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`subtype-${subtype.replace(/\s+/g, '-').toLowerCase()}`}
                      checked={formData.application.subtypes.includes(subtype)}
                      onCheckedChange={() => handleSubtypeToggle(subtype)}
                    />
                    <Label htmlFor={`subtype-${subtype.replace(/\s+/g, '-').toLowerCase()}`} className="cursor-pointer">
                      {subtype}
                    </Label>
                  </div>
                  
                  {subtype === "Other" && formData.application.subtypes.includes("Other") && (
                    <div className="mt-2 ml-7">
                      <Input
                        placeholder="Please specify"
                        value={otherSubtype}
                        onChange={handleOtherSubtypeChange}
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {formData.application.type && formData.application.subtypes.length > 0 && (
          <div className="p-4 bg-iot-light-blue rounded-md animate-fade-in">
            <h4 className="font-medium">Selected Application:</h4>
            <p className="mt-1">
              {formData.application.type} &gt; {formData.application.subtypes.join(", ")}
              {formData.application.subtypes.includes("Other") && otherSubtype && (
                <span> (Other: {otherSubtype})</span>
              )}
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default ApplicationType;
