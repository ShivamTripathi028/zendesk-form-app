
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionContainer from "../QuestionContainer";
import { FormData } from "@/utils/formUtils";

type ClientInformationProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const ClientInformation: React.FC<ClientInformationProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const updateClientInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      clientInfo: {
        ...prev.clientInfo,
        [field]: value,
      },
    }));
  };

  const isFormValid = () => {
    const { name, email, contactNumber } = formData.clientInfo;
    return name.trim() !== "" && email.trim() !== "" && contactNumber.trim() !== "";
  };

  return (
    <QuestionContainer
      title="Client Information"
      description="Please provide your contact details"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={true}
      isLastStep={false}
      nextDisabled={!isFormValid()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.clientInfo.name}
            onChange={(e) => updateClientInfo("name", e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.clientInfo.email}
            onChange={(e) => updateClientInfo("email", e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company Name (Optional)</Label>
          <Input
            id="company"
            value={formData.clientInfo.company}
            onChange={(e) => updateClientInfo("company", e.target.value)}
            placeholder="Enter your company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
          <Input
            id="contactNumber"
            value={formData.clientInfo.contactNumber}
            onChange={(e) => updateClientInfo("contactNumber", e.target.value)}
            placeholder="Enter your contact number"
            required
          />
        </div>
      </div>
    </QuestionContainer>
  );
};

export default ClientInformation;
