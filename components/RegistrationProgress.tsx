import React, { useEffect } from "react";

type RegistrationStep = "registration" | "review" | "allocation";

interface RegistrationProgressProps {
  currentStep: RegistrationStep;
}

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  // Get status of each step to determine appearance
  const getStepStatus = (step: RegistrationStep): "completed" | "current" | "upcoming" => {
    const steps: RegistrationStep[] = ["registration", "review", "allocation"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  useEffect(() => {
    if (!document.getElementById("progress-pulse-keyframes")) {
      const style = document.createElement("style");
      style.id = "progress-pulse-keyframes";
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
          background-color: #FEF3C7;
          border: 2px solid #F59E0B;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Clean up
    return () => {
      const style = document.getElementById("progress-pulse-keyframes");
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="w-full mb-8 mt-4">
      <div className="relative h-24">
        {/* Progress line segments - positioned below circles */}
        <div className="absolute top-5 left-0 right-0 w-full flex justify-center z-10">
          {/* First line segment */}
          <div className="w-1/3 flex items-center justify-center pl-10 pr-6 md:pl-0">
            <div 
              className={`h-2 w-full rounded-full ${
                getStepStatus("registration") === "completed" 
                  ? "bg-green-500" 
                  : "bg-gray-200"
              }`}
            ></div>
          </div>
          
          {/* Second line segment */}
          <div className="w-1/3 flex items-center justify-center pr-8 md:pr-0 pl-8">
            <div 
              className={`h-2 w-full rounded-full ${
                getStepStatus("review") === "completed" 
                  ? "bg-green-500" 
                  : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
        
        {/* Step indicators with circles */}
        <div className="flex justify-between w-full px-8 relative z-20">
          {/* Registration Step */}
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                getStepStatus("registration") === "completed"
                  ? "bg-green-500 text-white" 
                  : getStepStatus("registration") === "current"
                    ? "text-yellow-600 animate-pulse-custom" 
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {getStepStatus("registration") === "completed" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm">1</span>
              )}
            </div>
            <span className={`text-xs font-medium ${
              getStepStatus("registration") === "completed"
                ? "text-green-600" 
                : getStepStatus("registration") === "current"
                  ? "text-yellow-600"
                  : "text-gray-500"
            }`}>
              Registration
            </span>
          </div>
          
          {/* Review Step */}
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                getStepStatus("review") === "completed"
                  ? "bg-green-500 text-white" 
                  : getStepStatus("review") === "current"
                    ? "text-yellow-600 animate-pulse-custom" 
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {getStepStatus("review") === "completed" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm">2</span>
              )}
            </div>
            <span className={`text-xs font-medium ${
              getStepStatus("review") === "completed"
                ? "text-green-600" 
                : getStepStatus("review") === "current"
                  ? "text-yellow-600"
                  : "text-gray-500"
            }`}>
              Review
            </span>
          </div>
            {/* Allocation Step */}
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                getStepStatus("allocation") === "completed" || getStepStatus("allocation") === "current"
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {getStepStatus("allocation") === "completed" || getStepStatus("allocation") === "current" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm">3</span>
              )}
            </div>            <span className={`text-xs font-medium ${
              getStepStatus("allocation") === "completed" || getStepStatus("allocation") === "current"
                ? "text-green-600" 
                : "text-gray-500"
            }`}>
              Allocation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
