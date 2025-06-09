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
import { PreferenceSection } from "./PreferenceSection";
import type { Committee, Country } from "./PreferenceSection";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    committee1: "", committee2: "", committee3: "",
    country1_1: "", country1_2: "", country1_3: "",
    country2_1: "", country2_2: "", country2_3: "",
    country3_1: "", country3_2: "", country3_3: "",
    delegationName: "", paymentId: "", termsAccepted: false,
    collegeIdFile: null as File | null, delegateExperienceFile: null as File | null,
    idProofFile: null as File | null, delegationSheetFile: null as File | null,
    paymentProofFile: null as File | null
  });

  const [committees, setCommittees] = useState<Committee[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const totalSteps = isInternal ? 7 : 8;
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

  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        const { data: committeesData, error: committeesError } = await supabase
          .from('committees')
          .select('*');

        if (committeesError) throw committeesError;

        const { data: countriesData, error: countriesError } = await supabase
          .from('countries')
          .select('*');

        if (countriesError) throw countriesError;

        setCommittees(committeesData || []);
        setCountries(countriesData || []);
      } catch (error) {
        console.error('Error fetching committee data:', error);
      }
    };

    fetchCommitteeData();
  }, []);

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

    if (isInternal) {
      if (step === 2) {
        if (!formData.rollNumber) errors.rollNumber = "Roll number is required";
      } else if (step == 3 || step == 4 || step == 5) {
        // Preferences Validation
      } else if (step == 6) {
        if (!formData.collegeIdFile) errors.collegeIdFile = "College ID is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
      } else if (step === 7) {
        const paymentFields = [
          ["paymentId", "Payment ID"],
          ["paymentProofFile", "Payment proof"],
          ["termsAccepted", "Terms acceptance"]
        ];
        
        paymentFields.forEach(([field, label]) => {
          const value = formData[field as keyof typeof formData];
          if (!value || (typeof value === "boolean" && !value)) {
            errors[field] = `${label} is required`;
          }
        });
      }
    } else {
      if (step === 2) {
        const requiredFields = [
          ["residentialAddress", "Residential address"],
          ["residentialPincode", "Residential pincode"],
          ["universityName", "University name"],
          ["universityAddress", "University address"],
          ["universityPincode", "University pincode"]
        ];
        requiredFields.forEach(([field, label]) => {
          if (!formData[field as keyof typeof formData]) {
            errors[field] = `${label} is required`;
          } else if ((field === "residentialPincode" || field === "universityPincode") && !/^\d{6}$/.test(formData[field as keyof typeof formData] as string)) {
            errors[field] = `${label} must be a valid Pin code`;
          }
        });
      } else if (step === 3 && groupDelegation) {
        if (!formData.delegationName) errors.delegationName = "Delegation name is required";
      } else if (step === 4 || step === 5 || step === 6) {
        // Preferences Validation
      } else if (step === 7) {
        if (!formData.idProofFile) errors.idProofFile = "ID proof is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
        if (isHeadOfDelegation && !formData.delegationSheetFile) errors.delegationSheetFile = "Delegation sheet is required";
      } else if (step === 8) {
        const paymentFields = [
          ["paymentId", "Payment ID"],
          ["paymentProofFile", "Payment proof"],
          ["termsAccepted", "Terms acceptance"]
        ];
        
        paymentFields.forEach(([field, label]) => {
          const value = formData[field as keyof typeof formData];
          if (!value || (typeof value === "boolean" && !value)) {
            errors[field] = `${label} is required`;
          }
        });
      }
      }
    return errors;
  };

  const validateSubmission = () => {
    let allErrors = {};
    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = validateStep(step);
      allErrors = { ...allErrors, ...stepErrors };
    }
    return Object.keys(allErrors).length === 0;
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

    // Preference Steps
    const isPref1Step = (currentStep === 3 && isInternal) || (currentStep === 4 && !isInternal);
    const isPref2Step = (currentStep === 4 && isInternal) || (currentStep === 5 && !isInternal);
    const isPref3Step = (currentStep === 5 && isInternal) || (currentStep === 6 && !isInternal);

    if (isPref1Step || isPref2Step || isPref3Step) {
      const prefNum = isPref1Step ? 1 : isPref2Step ? 2 : 3;
      const prefKey = `pref${prefNum}` as keyof typeof prefs;
      const roleKey = `role${prefNum}` as keyof typeof prefs;
      
      return (
        <>          
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#00B7FF]">Preference {prefNum}</h2>
          <div className="flex-grow space-y-3 md:space-y-4 py-2">
            <PreferenceSection 
              num={prefNum} 
              pref={prefs[prefKey]} 
              setPref={(val) => setPrefs(prev => ({...prev, [prefKey]: val}))} 
              role={prefs[roleKey]} 
              setRole={(val) => setPrefs(prev => ({...prev, [roleKey]: val}))} 
              formData={formData}
              handleInputChange={handleInputChange}
              committees={committees}
              countries={countries}
            />
          </div>
        </>
      );
    }

    // Documents Step
    const isDocumentsStep = (currentStep === 6 && isInternal) || (currentStep === 7 && !isInternal);
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
                {isHeadOfDelegation && ( 
                  <p className="text-sm text-gray-700 mt-4">Heads of a Delegation must submit the <strong>Delegation Sheet</strong> with details of the delegation. Reference: Google Sheets Link</p>
                )}
              </>
            )}
          </div>
        </>
      );
    }

    // Payment Step
    const isPaymentStep = (currentStep === 7 && isInternal) || (currentStep === 8 && !isInternal);
    if (isPaymentStep) {
      const termsId = `terms-${isInternal ? 'internal' : 'external'}`;
      return (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00B7FF]">Payment</h2>
          <div className="flex-grow space-y-4 md:space-y-6 py-2">
            <div className="space-y-2">
              {isInternal && (
                <p className="mb-4">Please make the payment of <strong>₹1500/-</strong> for internal delegates at "PayU Link"</p>
              )}
              {!isInternal && (
                <p className="mb-4">Please make the payment of <strong>₹1800/-</strong> for external delegates at "PayU Link"</p>
              )}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubmission() || !user) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const now = Date.now()
      
      const uploadFile = async (file: File | null, fieldName: string) => {
        if (!file) return null;
        const filePath = `${user.id}/${fieldName}_${now}_${file.name}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('registration-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return uploadData.path;
      };

      const fileUploads = {
        collegeIdUrl: isInternal ? await uploadFile(formData.collegeIdFile, "CollegeID") : null,
        idProofUrl: !isInternal ? await uploadFile(formData.idProofFile, "IDProof") : null,
        experienceUrl: await uploadFile(formData.delegateExperienceFile, "DelExperience"),
        paymentProofUrl: await uploadFile(formData.paymentProofFile, "PaymentProof"),
        delegationSheetUrl: groupDelegation && isHeadOfDelegation
          ? await uploadFile(formData.delegationSheetFile, "DelegationSheet")
          : null,
      }

      const { data: transaction, error: transactionError } = await supabase.rpc('start_transaction');
      if (transactionError) throw transactionError;

      try {
        if (isInternal) {
          const { error: internalRegError } = await supabase
            .from('internal_registrations')
            .insert({
              user_id: user.id,
              roll_number: formData.rollNumber,
              college_id_photo_url: fileUploads.collegeIdUrl,
              delegate_experience_doc_url: fileUploads.experienceUrl,
              payment_id: formData.paymentId,
              payment_proof_url: fileUploads.paymentProofUrl,
            });
          
          if (internalRegError) throw internalRegError;
        } else { 
          const { error: externalRegError } = await supabase
            .from('external_registrations')
            .insert({
              user_id: user.id,
              residential_address: formData.residentialAddress,
              residential_pincode: formData.residentialPincode,
              university_name: formData.universityName,
              university_address: formData.universityAddress,
              university_pincode: formData.universityPincode,
              id_proof_url: fileUploads.idProofUrl,
              accomodation_required: formData.accommodation,
              delegation_type: groupDelegation ? 'group' : 'individual',
              delegation_name: groupDelegation ? formData.delegationName : null,
              is_head_of_delegation: groupDelegation ? isHeadOfDelegation : null,
              delegation_sheet_url: fileUploads.delegationSheetUrl || null,
              delegate_experience_doc_url: fileUploads.experienceUrl,
              payment_id: formData.paymentId,
              payment_proof_url: fileUploads.paymentProofUrl,
            });

          if (externalRegError) throw externalRegError;
        }

        for (let i = 1; i <= 3; i++) {
          const prefKey = `pref${i}` as keyof typeof prefs;
          const roleKey = `role${i}` as keyof typeof prefs;

          const { data: prefData, error: prefError } = await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              preference_order: i,
              role: prefs[prefKey],
              ip_subrole: prefs[prefKey] === 'IP' ? prefs[roleKey] : null,
              committee_id: prefs[prefKey] === 'delegate' ? formData[`committee${i}` as keyof typeof formData] as string : null
            })
            .select()
            .single();

          if (prefError) throw prefError;

          if (prefs[prefKey] === 'delegate') {
            const countryPrefs = [];
            for (let j = 1; j <= 3; j++) {
              const countryId = formData[`country${i}_${j}` as keyof typeof formData];
              if (countryId) {
                countryPrefs.push({
                  user_id: user.id,
                  preference_order: i,
                  country_order: j,
                  country_id: countryId
                });
              }
            }

            if (countryPrefs.length > 0) {
              const { error: countryError } = await supabase
                .from('delegate_country_preferences')
                .insert(countryPrefs);

              if (countryError) throw countryError;
            }
          }

          if (prefs[prefKey] === 'IP' && prefs[roleKey] === 'reporter') {
            const committeePrefs = [];
            for (let j = 1; j <= 3; j++) {
              const committeeId = formData[`committee${j}` as keyof typeof formData];
              if (committeeId) {
                committeePrefs.push({
                  user_id: user.id,
                  preference_order: i,
                  committee_order: j,
                  committee_id: committeeId
                });
              }
            }

            if (committeePrefs.length > 0) {
              const { error: reporterError } = await supabase
                .from('ip_reporter_preferences')
                .insert(committeePrefs);

              if (reporterError) throw reporterError;
            }
          }
        }
        const { error: commitError } = await supabase.rpc('commit_transaction', { transaction_id: transaction.id });
        if (commitError) throw commitError;

        router.push('/dashboard');
      } catch (error) {
        await supabase.rpc('rollback_transaction', { transaction_id: transaction.id });
        throw error;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const isLastStep = (currentStep === 7 && isInternal) || (currentStep === 8 && !isInternal);

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
                <div className="flex items-center gap-2">
                  {isLastStep && !validateSubmission() && (
                    <p className="text-red-500 text-sm">
                      Please complete all required fields
                    </p>
                  )}
                  <Button
                    type={isLastStep ? "submit" : "button"}
                    onClick={isLastStep ? undefined : nextStep}
                    disabled={isLastStep ? !validateSubmission() || isSubmitting : false}
                    className={`${isLastStep ? "bg-green-500 hover:bg-green-400 text-sm cursor-pointer md:text-base" : continueButtonStyle}`}
                  >
                    {currentStep === 1 ? (
                      "Start Registration"
                    ) : isLastStep ? (
                      isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Submit"
                      )
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
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
