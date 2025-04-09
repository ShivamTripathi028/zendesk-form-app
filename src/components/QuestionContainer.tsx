
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type QuestionContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextDisabled?: boolean;
};

const QuestionContainer: React.FC<QuestionContainerProps> = ({
  title,
  description,
  children,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  nextDisabled = false,
}) => {
  return (
    <div className="form-card animate-fade-in">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className="mb-8">{children}</div>
      
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          className={`${isFirstStep ? 'invisible' : ''} transition-all duration-300 hover:bg-iot-light-blue hover:text-iot-blue hover:border-iot-blue`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className="bg-iot-blue hover:bg-iot-blue/90 transition-all duration-300"
        >
          {isLastStep ? "Submit" : "Next"} {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default QuestionContainer;
