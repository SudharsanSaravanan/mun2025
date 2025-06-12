import React from "react";
import { Progress } from "@/components/ui/progress";

type RegistrationStep = "registration" | "review" | "allocation";

interface RegistrationProgressProps {
  currentStep: RegistrationStep;
}

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {

  const getProgressValue = (): number => {
    switch (currentStep) {
      case "registration":
        return 33;
      case "review":
        return 66;
      case "allocation":
        return 100;
      default:
        return 0;
    }
  };


  const getStepStatus = (step: RegistrationStep): "completed" | "current" | "upcoming" => {
    const steps: RegistrationStep[] = ["registration", "review", "allocation"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full mb-8">
      <Progress value={getProgressValue()} className="h-2 mb-6" />
      
      <div className="flex justify-between text-sm px-1">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-2
            ${getStepStatus("registration") === "completed" 
              ? "bg-[#00B7FF] text-white" 
              : getStepStatus("registration") === "current" 
                ? "bg-blue-100 border-2 border-[#00B7FF] text-[#00B7FF]" 
                : "bg-gray-100 text-gray-400"}`}
          >
            1
          </div>
          <span className={`text-xs font-medium 
            ${getStepStatus("registration") === "completed" 
              ? "text-[#00B7FF]" 
              : getStepStatus("registration") === "current" 
                ? "text-[#00B7FF]" 
                : "text-gray-400"}`}
          >
            Registration
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-2
            ${getStepStatus("review") === "completed" 
              ? "bg-[#00B7FF] text-white" 
              : getStepStatus("review") === "current" 
                ? "bg-blue-100 border-2 border-[#00B7FF] text-[#00B7FF]" 
                : "bg-gray-100 text-gray-400"}`}
          >
            2
          </div>
          <span className={`text-xs font-medium 
            ${getStepStatus("review") === "completed" 
              ? "text-[#00B7FF]" 
              : getStepStatus("review") === "current" 
                ? "text-[#00B7FF]" 
                : "text-gray-400"}`}
          >
            Review
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-2
            ${getStepStatus("allocation") === "completed" 
              ? "bg-[#00B7FF] text-white" 
              : getStepStatus("allocation") === "current" 
                ? "bg-blue-100 border-2 border-[#00B7FF] text-[#00B7FF]" 
                : "bg-gray-100 text-gray-400"}`}
          >
            3
          </div>
          <span className={`text-xs font-medium 
            ${getStepStatus("allocation") === "completed" 
              ? "text-[#00B7FF]" 
              : getStepStatus("allocation") === "current" 
                ? "text-[#00B7FF]" 
                : "text-gray-400"}`}
          >
            Allocation
          </span>
        </div>
      </div>
    </div>
  );
}
