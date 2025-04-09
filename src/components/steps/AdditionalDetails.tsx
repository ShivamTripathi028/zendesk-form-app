
import React from "react";
import QuestionContainer from "../QuestionContainer";
import { FormData } from "@/utils/formUtils";
import { Textarea } from "@/components/ui/textarea";

type AdditionalDetailsProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetails: e.target.value,
    }));
  };

  return (
    <QuestionContainer
      title="Additional Project Details"
      description="Please provide any specific requirements or challenges"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={true}
      nextDisabled={false}
    >
      <div className="space-y-4">
        <Textarea
          placeholder="Enter any additional project details, specific requirements, challenges, or expectations..."
          className="min-h-[200px]"
          value={formData.additionalDetails}
          onChange={handleDetailsChange}
        />
        <p className="text-sm text-gray-500">
          This information helps our team better understand your project needs and provide more accurate recommendations.
        </p>
      </div>
    </QuestionContainer>
  );
};

export default AdditionalDetails;
