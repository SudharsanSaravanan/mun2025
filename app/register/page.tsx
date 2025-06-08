"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { continueButtonStyle, backButtonStyle } from "./ButtonStyles";

const UNIVERSITIES = [
  "Amrita Vishwa Vidyapeetham, Chennai",
  "Amrita Vishwa Vidyapeetham, Amritapuri",
  "Amrita Vishwa Vidyapeetham, Bengaluru",
  "Vellore Institute of Technology (VIT)",
  "Vellore Institute of Technology, Chennai (VIT-C)",
  "PSG College of Technology",
  "SSN College of Engineering",
  "Shiv Nadar University (SNU)",
  "Kumaraguru College of Technology (KCT)",
  "SRM Institute of Science and Technology",
];

const RegistrationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isInternal, setIsInternal] = useState(false);
  const [groupDelegation, setGroupDelegation] = useState(false);
  const [isHeadOfDelegation, setIsHeadOfDelegation] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  
  // Preferences state
  const [prefs, setPrefs] = useState({
    pref1: "delegate", pref2: "delegate", pref3: "delegate",
    role1: "reporter", role2: "reporter", role3: "reporter"
  });

  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "", email: "", rollNumber: "",
    residentialAddress: "", residentialPincode: "", universityName: "",
    universityAddress: "", universityPincode: "", accommodation: false,
    committee1: "", country1: "", country2: "", country3: "",
    delegationName: "", paymentId: "", termsAccepted: false,
    collegeIdFile: null as File | null, delegateExperienceFile: null as File | null,
    idProofFile: null as File | null, delegationSheetFile: null as File | null,
    paymentProofFile: null as File | null
  });

  const totalSteps = isInternal ? 5 : 6;
  const progress = Math.round((currentStep / totalSteps) * 100);

  useEffect(() => {
    const fetchUser = async () => {
        try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();

        if (!authUser?.user) {
          router.replace("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.user.id)
          .single();

        if (userError || !userData) {
          console.error("Error fetching user data:", userError);
          router.replace("/login");
          return;
        }

        setUser(userData);
        setIsInternal(userData.is_internal);
      } catch (error) {
        console.error("Authentication error:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

   useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
      if (formErrors[fieldName]) {
        setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (step === 2) {
      if (isInternal) {
        const requiredFields = [
          ['fullName', 'Name'],
          ['phoneNumber', 'Phone number'],
          ['email', 'Email'],
          ['rollNumber', 'Roll number']
        ];
        requiredFields.forEach(([field, label]) => {
          if (!formData[field as keyof typeof formData]) {
            errors[field] = `${label} is required`;
          }
        });
      } else {
        const requiredFields = [
          ['fullName', 'Name'],
          ['phoneNumber', 'Phone number'],
          ['email', 'Email'],
          ['residentialAddress', 'Residential address'],
          ['residentialPincode', 'Residential pincode'],
          ['universityName', 'University name'],
          ['universityAddress', 'University address'],
          ['universityPincode', 'University pincode']
        ];
        requiredFields.forEach(([field, label]) => {
          if (!formData[field as keyof typeof formData]) {
            errors[field] = `${label} is required`;
          }
        });
      }
      
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Valid email is required";
      }
    } else if (step === 3 && !isInternal && groupDelegation) {
      if (!formData.delegationName) errors.delegationName = "Delegation name is required";
    } else if ((step === 4 && isInternal) || (step === 5 && !isInternal)) {
      if (isInternal) {
        if (!formData.collegeIdFile) errors.collegeIdFile = "College ID is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
      } else {
        if (!formData.idProofFile) errors.idProofFile = "ID proof is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
        if (isHeadOfDelegation && !formData.delegationSheetFile) errors.delegationSheetFile = "Delegation sheet is required";
      }
    } else if ((step === 5 && isInternal) || (step === 6 && !isInternal)) {
      if (!formData.paymentId) errors.paymentId = "Payment ID is required";
      if (!formData.paymentProofFile) errors.paymentProofFile = "Payment proof is required";
      if (!formData.termsAccepted) errors.termsAccepted = "Please accept the terms";
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step: number) => {
    if (step <= totalSteps && step > 0) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Render form field helper
  const renderField = (name: string, label: string, props: any = {}) => {
    const isPrePopulated = ["fullName", "phoneNumber", "email"].includes(name);
    const disabled = isPrePopulated;
    
    return (
      <div className={props.className || ""}>
        <Label htmlFor={name} className="text-sm md:text-base mb-1 block">{label}</Label>
        <Input
          id={name}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          disabled={disabled}
          className={`${formErrors[name] ? "border-red-500" : ""}`}
          {...props}
        />
        {formErrors[name] && <p className="text-red-500 text-xs mt-1">{formErrors[name]}</p>}
      </div>
    );
  };

  const renderFileField = (name: keyof typeof formData, label: string) => (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type="file"
          onChange={(e) => handleFileChange(e, name)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2">
          {formData[name] instanceof File ? (formData[name] as File).name : "No file chosen"}
        </div>
      </div>
      {formErrors[name] && <p className="text-red-500 text-xs mt-1">{formErrors[name]}</p>}
    </div>
  );

  const PreferenceSection = ({ num, pref, setPref, role, setRole }: {
    num: number; pref: string; setPref: (value: string) => void; role: string; setRole: (value: string) => void;
  }) => (
    <div className="space-y-2 md:space-y-3">
      <Label className="text-sm md:text-base font-medium">Preference {num}</Label>
      <Select value={pref} onValueChange={setPref}>
        <SelectTrigger>{pref === "delegate" ? "Delegate" : "IP"}</SelectTrigger>
        <SelectContent>
          <SelectItem value="delegate">Delegate</SelectItem>
          <SelectItem value="ip">IP</SelectItem>
        </SelectContent>
      </Select>

      {pref === "ip" && (
        <div className="mt-2">
          <Label className="text-sm md:text-base">Preferred Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="mt-1">{role === "reporter" ? "Reporter" : "Photojournalist"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="reporter">Reporter</SelectItem>
              <SelectItem value="photojournalist">Photojournalist</SelectItem>
            </SelectContent>
          </Select>
          {role === "reporter" && (
            <div className="grid grid-cols-1 gap-2 mt-3">
              <Label className="text-sm md:text-base">Committee Preferences</Label>
              {[1, 2, 3].map(i => <Input key={i} placeholder={`Committee ${i}`} className={i === 1 ? "mt-1" : ""} />)}
            </div>
          )}
        </div>
      )}

      {pref === "delegate" && (
        <div className="grid grid-cols-1 gap-3 mt-2">
          <Label className="text-sm md:text-base">Committee Preference</Label>
          <Input placeholder="Committee" className="mt-1" />
          <Label className="text-sm md:text-base mt-1">Country Preferences</Label>
          {["Country 1", "Country 2", "Country 3"].map((placeholder, i) => (
            <Input key={i} placeholder={placeholder} className={i === 0 ? "mt-1" : ""} />
          ))}
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    const stepConfigs = [
      {
        step: 1,
        title: "Welcome to Amrita MUN'25",
        content: (
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="w-full text-center">
              <p className="mt-2 md:mt-4 text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Thank you for your interest in joining Amrita MUN'25. We're excited to have you participate!
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
                <h3 className="text-lg md:text-lg font-semibold text-gray-800 mb-3">Read the Guidelines</h3>
                <ul className="text-gray-700 text-left space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00B7FF] mr-2">•</span>
                    Guideline 1
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B7FF] mr-2">•</span>
                    Guideline 2
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B7FF] mr-2">•</span>
                    Guideline 3
                  </li>
                </ul>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Please complete this registration form to secure your spot in Amrita MUN'25
              </p>
            </div>
          </div>
        ),
        buttonText: "Start Registration"
      },
      {
        step: 2,
        title: "Personal Details",
        content: isInternal ? (
          <div className="flex-grow grid grid-cols-1 gap-3 py-2">
            {renderField("fullName", "Full Name", { placeholder: "Enter your full name", required: true })}
            {renderField("phoneNumber", "Phone Number", { placeholder: "Enter your phone number", required: true })}
            {renderField("email", "Email ID", { placeholder: "Enter your email address", required: true, type: "email" })}
            {renderField("rollNumber", "Roll Number", { placeholder: "Enter your roll number", required: true })}
          </div>
        ) : (
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-2">
            {renderField("fullName", "Full Name", { placeholder: "Enter your full name", required: true, className: "md:col-span-1" })}
            {renderField("phoneNumber", "Phone Number", { placeholder: "Enter your phone number", required: true, className: "md:col-span-1" })}
            {renderField("email", "Email ID", { placeholder: "Enter your email address", required: true, type: "email", className: "md:col-span-2" })}
            {renderField("residentialAddress", "Residential Address", { placeholder: "Enter your residential address", required: true, className: "md:col-span-2" })}
            {renderField("residentialPincode", "Residential Pincode", { placeholder: "Enter pincode", required: true })}
            
            <div className={`relative ${formErrors.universityName ? "text-red-500" : ""}`}>
              <Label className="text-sm md:text-base mb-1 block">University Name</Label>
              <Input
                type="text"
                placeholder="Enter university name"
                value={formData.universityName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, universityName: value }));
                  setShowCollegeDropdown(true);
                  if (formErrors.universityName) {
                    setFormErrors(prev => ({ ...prev, universityName: "" }));
                  }
                }}
                onFocus={() => setShowCollegeDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowCollegeDropdown(false), 200);
                }}
                autoComplete="off"
                className={`${formErrors.universityName ? "border-red-500" : ""}`}
              />
              {showCollegeDropdown && (formData.universityName || "").length > 0 && UNIVERSITIES.filter(college => 
                college.toLowerCase().includes(formData.universityName.toLowerCase())
              ).length > 0 && (
                <div className="absolute w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200 z-50">
                  {UNIVERSITIES.filter(college => 
                    college.toLowerCase().includes(formData.universityName.toLowerCase())
                  ).map((college, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, universityName: college }));
                        setShowCollegeDropdown(false);
                        if (formErrors.universityName) {
                          setFormErrors(prev => ({ ...prev, universityName: "" }));
                        }
                      }}
                    >
                      {college}
                    </div>
                  ))}
                </div>
              )}
              {formErrors.universityName && <p className="text-red-500 text-xs mt-1">{formErrors.universityName}</p>}
            </div>

            {renderField("universityAddress", "University Address", { placeholder: "Enter university address", required: true, className: "md:col-span-2" })}
            {renderField("universityPincode", "University Pincode", { placeholder: "Enter pincode", required: true })}

            <div className="md:col-span-2 mt-1">
              <Label className="mb-2 block text-sm md:text-base">Accommodation needed?</Label>
              <Select 
                value={formData.accommodation ? "yes" : "no"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation: value === "yes" }))}>
                <SelectTrigger>{formData.accommodation ? "Yes" : "No"}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      }
    ];

    // Delegation Details Step (only for external)
    if (!isInternal && currentStep === 3) {
      return (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00B7FF]">Delegation Details</h2>
          <div className="flex-grow space-y-4 md:space-y-6 py-2">
            <div>
              <Label className="mb-2 block text-sm md:text-base">Are you participating as an individual or part of a group?</Label>
              <div className="relative isolate">
                <Select onValueChange={(val) => setGroupDelegation(val === "group")}>
                  <SelectTrigger>{groupDelegation ? "Group Delegation" : "Individual Delegate"}</SelectTrigger>
                  <SelectContent className="relative">
                    <SelectItem value="individual">Individual Delegate</SelectItem>
                    <SelectItem value="group">Group Delegation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {groupDelegation && (
              <div className="space-y-4 mt-3">
                <div>
                  <Input
                    name="delegationName"
                    value={formData.delegationName}
                    onChange={handleInputChange}
                    placeholder="Delegation Name"
                    className={formErrors.delegationName ? "border-red-500" : ""}
                  />
                  {formErrors.delegationName && <p className="text-red-500 text-xs mt-1">{formErrors.delegationName}</p>}
                </div>
                <div>
                  <Label className="mb-2 block text-sm md:text-base">Are you Head of Delegation?</Label>
                  <Select 
                    value={isHeadOfDelegation ? "yes" : "no"} 
                    onValueChange={(value) => setIsHeadOfDelegation(value === "yes")}>
                    <SelectTrigger>{isHeadOfDelegation ? "Yes" : "No"}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

    // Preferences Step
    const isCommitteeStep = (currentStep === 3 && isInternal) || (currentStep === 4 && !isInternal);
    if (isCommitteeStep) {
      return (
        <>          
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#00B7FF]">Preferences</h2>
          <div className="flex-grow space-y-3 md:space-y-4 py-2">
            <PreferenceSection num={1} pref={prefs.pref1} setPref={(val) => setPrefs(prev => ({...prev, pref1: val}))} role={prefs.role1} setRole={(val) => setPrefs(prev => ({...prev, role1: val}))} />
            <PreferenceSection num={2} pref={prefs.pref2} setPref={(val) => setPrefs(prev => ({...prev, pref2: val}))} role={prefs.role2} setRole={(val) => setPrefs(prev => ({...prev, role2: val}))} />
            <PreferenceSection num={3} pref={prefs.pref3} setPref={(val) => setPrefs(prev => ({...prev, pref3: val}))} role={prefs.role3} setRole={(val) => setPrefs(prev => ({...prev, role3: val}))} />
          </div>
        </>
      );
    }

    // Documents Step
    const isDocumentsStep = (currentStep === 4 && isInternal) || (currentStep === 5 && !isInternal);
    if (isDocumentsStep) {
      return (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00B7FF]">Required Documents</h2>
          <div className="flex-grow space-y-4 md:space-y-6 py-2">
            {isInternal ? (
              <>
                {renderFileField("collegeIdFile", "College ID")}
                {renderFileField("delegateExperienceFile", "Delegate Experience (PDF)")}
              </>
            ) : (
              <>
                {renderFileField("idProofFile", "ID Proof (Any Valid ID)")}
                {renderFileField("delegateExperienceFile", "Delegate Experience (PDF)")}
                {isHeadOfDelegation && renderFileField("delegationSheetFile", "Delegation Sheet")}
              </>
            )}
          </div>
        </>
      );
    }

    // Payment Step
    const isPaymentStep = (currentStep === 5 && isInternal) || (currentStep === 6 && !isInternal);
    if (isPaymentStep) {
      const termsId = `terms-${isInternal ? 'internal' : 'external'}`;
      return (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00B7FF]">Payment</h2>
          <div className="flex-grow space-y-4 md:space-y-6 py-2">
            <div className="space-y-2">
              <Label className="text-sm md:text-base">Payment ID</Label>
              <Input
                name="paymentId"
                value={formData.paymentId}
                onChange={handleInputChange}
                placeholder="Enter payment reference ID"
                className={formErrors.paymentId ? "border-red-500" : ""}
              />
              {formErrors.paymentId && <p className="text-red-500 text-xs mt-1">{formErrors.paymentId}</p>}
            </div>
            {renderFileField("paymentProofFile", "Payment Proof")}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id={termsId}
                name="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, termsAccepted: !!checked }));
                  if (formErrors.termsAccepted) {
                    setFormErrors(prev => ({ ...prev, termsAccepted: '' }));
                  }
                }}
              />
              <Label htmlFor={termsId} className={`text-xs md:text-sm ${formErrors.termsAccepted ? "text-red-500" : "text-gray-600"}`}>
                I agree to receive emails and opportunities from Amrita MUN'25 and its official partners
              </Label>
            </div>
            {formErrors.termsAccepted && <p className="text-red-500 text-xs mt-1">{formErrors.termsAccepted}</p>}
          </div>
        </>
      );
    }

    // Default steps (1 and 2)
    const config = stepConfigs.find(s => s.step === currentStep);
    if (config) {
      return (
        <>
          {config.step === 1 ? (
            <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-4 text-[#00B7FF] text-center">{config.title}</h2>
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#00B7FF]">{config.title}</h2>
          )}
          {config.content}
        </>
      );
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 mx-auto" />
          <p className="mt-3 text-gray-800 text-md">Loading...</p>
        </div>
      </div>
    );
  }

  const isLastStep = (currentStep === 5 && isInternal) || (currentStep === 6 && !isInternal);

  return (
    <div className="min-h-screen bg-blue-50 overflow-y-auto">
      <DashboardNavbar onLogout={handleLogout} />
      
      <div className="flex flex-col px-2 md:px-4 pt-22 md:pt-18 pb-6 max-w-5xl mx-auto relative">
        {/* Progress bar and step indicators */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-blue/60 backdrop-blur-md">
          <div className="max-w-5xl mx-auto py-3 px-4">
            <div className="flex items-center gap-3">
              <Progress value={progress} className="flex-grow" />
              <span className="text-md text-gray-500 font-medium whitespace-nowrap">
                Step {currentStep}/{totalSteps}
              </span>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-center mt-16 px-2 md:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[65vh] md:min-h-[75vh] flex flex-col"
          >
            <Card className="p-4 md:p-6 flex-grow flex flex-col bg-white">
              {renderStepContent()}
              
              <div className="flex justify-between mt-4">
                {currentStep > 1 && (
                  <Button type="button" onClick={prevStep} variant="outline" className={currentStep === 1 ? "" : backButtonStyle}>
                    Back
                  </Button>
                )}
                {currentStep === 1 && <div />}
                <Button
                  type={isLastStep ? "submit" : "button"}
                  onClick={isLastStep ? undefined : nextStep}
                  className={isLastStep ? "bg-green-500 hover:bg-green-400 text-sm cursor-pointer md:text-base" : continueButtonStyle}
                >
                  {currentStep === 1 ? "Start Registration" : isLastStep ? "Submit" : "Continue"}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </form>
      </div>
    </div>
  );
};

export default RegistrationForm;