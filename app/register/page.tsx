"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationForm = () => {
  // Section navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [progress, setProgress] = useState(20);
  
  //The participant type - pls set ths to true if the participant is internal, else false ( for backend logic - pls delete comment after use)
  const [isInternal, setIsInternal] = useState(true);
  const [pref1, setPref1] = useState("delegate");
  const [pref2, setPref2] = useState("delegate");
  const [pref3, setPref3] = useState("delegate");
  const [role1, setRole1] = useState("reporter");
  const [role2, setRole2] = useState("reporter");
  const [role3, setRole3] = useState("reporter");
  const [groupDelegation, setGroupDelegation] = useState(false);
  const [isHeadOfDelegation, setIsHeadOfDelegation] = useState(false);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    // Personal details
    fullName: "",
    phoneNumber: "",
    email: "",
    rollNumber: "",
    
    // External participant fields
    residentialAddress: "",
    residentialPincode: "",
    universityName: "",
    universityAddress: "",
    universityPincode: "",
    accommodation: false,
    
    // Committee preferences
    committee1: "",
    country1: "",
    country2: "",
    country3: "",
    
    // Delegation details
    delegationName: "",
    
    // Payment details
    paymentId: "",
    termsAccepted: false,
    
    // File fields
    collegeIdFile: null as File | null,
    delegateExperienceFile: null as File | null,
    idProofFile: null as File | null,
    delegationSheetFile: null as File | null,
    paymentProofFile: null as File | null,
  });

  useEffect(() => {
    const steps = isInternal ? 5 : 6;
    setTotalSteps(steps);

    setProgress(Math.round((currentStep / steps) * 100));
  }, [currentStep, isInternal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0],
      });

      if (formErrors[fieldName]) {
        setFormErrors({
          ...formErrors,
          [fieldName]: '',
        });
      }
    }
  };

  const nextStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 2) { 
      if (isInternal) {
        if (!formData.fullName) errors.fullName = "Name is required";
        if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
        if (!formData.email) errors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Valid email is required";
        if (!formData.rollNumber) errors.rollNumber = "Roll number is required";
      } else {
        if (!formData.fullName) errors.fullName = "Name is required";
        if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
        if (!formData.email) errors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Valid email is required";
        if (!formData.residentialAddress) errors.residentialAddress = "Address is required";
        if (!formData.universityName) errors.universityName = "University name is required";
      }
    }

    else if (currentStep === 3 && !isInternal && groupDelegation) {
      if (!formData.delegationName) errors.delegationName = "Delegation name is required";
    }

    else if ((currentStep === 4 && isInternal) || (currentStep === 5 && !isInternal)) {
      if (isInternal) {
        if (!formData.collegeIdFile) errors.collegeIdFile = "College ID is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
      } else {
        if (!formData.idProofFile) errors.idProofFile = "ID proof is required";
        if (!formData.delegateExperienceFile) errors.delegateExperienceFile = "Delegate experience is required";
        if (isHeadOfDelegation && !formData.delegationSheetFile) errors.delegationSheetFile = "Delegation sheet is required";
      }
    }
    else if ((currentStep === 5 && isInternal) || (currentStep === 6 && !isInternal)) {
      if (!formData.paymentId) errors.paymentId = "Payment ID is required";
      if (!formData.paymentProofFile) errors.paymentProofFile = "Payment proof is required";
      if (!formData.termsAccepted) errors.termsAccepted = "Please accept the terms";
    }
    
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

  const PreferenceSection = ({ 
    num, 
    pref, 
    setPref, 
    role, 
    setRole 
  }: { 
    num: number; 
    pref: string; 
    setPref: (value: string) => void; 
    role: string; 
    setRole: (value: string) => void; 
  }) => (
    <div className="space-y-3 md:space-y-4 border border-gray-100 p-3 md:p-4 rounded-lg">
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
              <Input placeholder="Committee 1" className="mt-1" />
              <Input placeholder="Committee 2" />
              <Input placeholder="Committee 3" />
            </div>
          )}
        </div>
      )}

      {pref === "delegate" && (
        <div className="grid grid-cols-1 gap-3 mt-2">
          <Label className="text-sm md:text-base">Committee Preference</Label>
          <Input placeholder="Committee" className="mt-1" />
          <Label className="text-sm md:text-base mt-1">Country Preferences</Label>
          <Input placeholder="Country 1" className="mt-1" />
          <Input placeholder="Country 2" />
          <Input placeholder="Country 3" />
        </div>
      )}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex flex-col px-2 md:px-4 pt-20 md:pt-24 pb-6 max-w-4xl mx-auto">
      
      {/* Progress bar and step indicators */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 p-3 md:p-4 shadow">
        <div className="max-w-4xl mx-auto">
          <Progress value={progress} className="mb-1 md:mb-2" />
          <div className="flex justify-between text-sm text-gray-500 px-1 md:px-0">
            {[...Array(totalSteps)].map((_, i) => (
              <button 
                key={i} 
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm 
                  ${currentStep > i+1 ? "bg-[#00B7FF] text-white" : 
                    currentStep === i+1 ? "bg-blue-50 text-[#00B7FF] border-2 border-[#00B7FF]" : 
                    "bg-gray-100 text-gray-400"}`}
                onClick={() => goToStep(i+1)}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-center mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[65vh] md:min-h-[75vh] flex flex-col"
          >
            {currentStep === 1 && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">

                <h2 className="text-xl md:text-3xl font-bold mt-4 md:mt-6 text-center text-[#00B7FF]">
                  Welcome to Amrita MUN'25
                </h2>
                
                <div className="flex-grow flex flex-col justify-center items-center">
                  <div className="text-center mb-5 md:mb-8">
                    <p className="text-base md:text-lg text-gray-700 mb-4">
                      Thank you for your interest in joining Amrita MUN'25. We're excited to have you participate!
                    </p>
                  </div>
                  
                  
                </div>
                
                <div className="flex justify-end mt-6 md:mt-8">
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-6 md:px-8 text-sm md:text-base bg-[#00B7FF] hover:bg-[#009FE0] transition-colors"
                  >
                    Begin Registration
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Personal Details</h2>
                {isInternal ? (
                  <div className="flex-grow grid grid-cols-1 gap-3 py-2">
                    <div>
                      <Input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name" 
                        required 
                        className={formErrors.fullName ? "border-red-500" : ""}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Input 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number" 
                        required 
                        className={formErrors.phoneNumber ? "border-red-500" : ""}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div>
                      <Input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email ID" 
                        required 
                        type="email"
                        className={formErrors.email ? "border-red-500" : ""} 
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Input 
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        placeholder="Roll Number" 
                        required 
                        className={formErrors.rollNumber ? "border-red-500" : ""}
                      />
                      {formErrors.rollNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.rollNumber}</p>
                      )}
                    </div>
                  </div>) : (
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-2">
                    <div className="md:col-span-1">
                      <Input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name" 
                        required 
                        className={formErrors.fullName ? "border-red-500" : ""}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <Input 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number" 
                        required 
                        className={formErrors.phoneNumber ? "border-red-500" : ""}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email ID" 
                        required 
                        type="email" 
                        className={`md:col-span-2 ${formErrors.email ? "border-red-500" : ""}`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Input 
                        name="residentialAddress"
                        value={formData.residentialAddress}
                        onChange={handleInputChange}
                        placeholder="Residential Address" 
                        className={`md:col-span-2 ${formErrors.residentialAddress ? "border-red-500" : ""}`}
                      />
                      {formErrors.residentialAddress && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.residentialAddress}</p>
                      )}
                    </div>
                    <div>
                      <Input 
                        name="residentialPincode"
                        value={formData.residentialPincode}
                        onChange={handleInputChange}
                        placeholder="Residential Pincode" 
                      />
                    </div>
                    <div>
                      <Input 
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleInputChange}
                        placeholder="University Name"
                        className={formErrors.universityName ? "border-red-500" : ""}
                      />
                      {formErrors.universityName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.universityName}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Input 
                        name="universityAddress"
                        value={formData.universityAddress}
                        onChange={handleInputChange}
                        placeholder="University Address" 
                        className="md:col-span-2" 
                      />
                    </div>
                    <div>
                      <Input 
                        name="universityPincode"
                        value={formData.universityPincode}
                        onChange={handleInputChange}
                        placeholder="University Pincode" 
                      />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2 mt-1">
                      <Checkbox 
                        id="accommodation" 
                        name="accommodation"
                        checked={formData.accommodation}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            accommodation: !!checked
                          });
                        }}
                      />
                      <Label htmlFor="accommodation">Accommodation needed?</Label>
                    </div>
                  </div>
                  ) }
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && !isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Delegation Details</h2>
                <div className="flex-grow space-y-4 md:space-y-6 py-2">
                  <div>
                    <Label className="mb-2 block text-sm md:text-base">Are you participating as an individual or part of a group?</Label>
                    <Select onValueChange={(val) => setGroupDelegation(val === "group")}>
                      <SelectTrigger>{groupDelegation ? "Group Delegation" : "Individual Delegate"}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Delegate</SelectItem>
                        <SelectItem value="group">Group Delegation</SelectItem>
                      </SelectContent>
                    </Select>
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
                        {formErrors.delegationName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.delegationName}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="headOfDelegation" 
                          checked={isHeadOfDelegation}
                          onCheckedChange={(checked) => setIsHeadOfDelegation(!!checked)} 
                        />
                        <Label htmlFor="headOfDelegation" className="text-sm md:text-base">Are you Head of Delegation?</Label>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Committee Preferences</h2>
                <div className="flex-grow space-y-4 md:space-y-6 py-2">
                  <PreferenceSection
                    num={1}
                    pref={pref1}
                    setPref={setPref1}
                    role={role1}
                    setRole={setRole1}
                  />
                  <PreferenceSection
                    num={2}
                    pref={pref2}
                    setPref={setPref2}
                    role={role2}
                    setRole={setRole2}
                  />
                  <PreferenceSection
                    num={3}
                    pref={pref3}
                    setPref={setPref3}
                    role={role3}
                    setRole={setRole3}
                  />
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 4 && !isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Committee Preferences</h2>
                <div className="flex-grow space-y-4 md:space-y-6 py-2">
                  <PreferenceSection
                    num={1}
                    pref={pref1}
                    setPref={setPref1}
                    role={role1}
                    setRole={setRole1}
                  />
                  <PreferenceSection
                    num={2}
                    pref={pref2}
                    setPref={setPref2}
                    role={role2}
                    setRole={setRole2}
                  />
                  <PreferenceSection
                    num={3}
                    pref={pref3}
                    setPref={setPref3}
                    role={role3}
                    setRole={setRole3}
                  />
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 4 && isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Required Documents</h2>
                <div className="flex-grow space-y-4 md:space-y-6 py-2">
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">College ID</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "collegeIdFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.collegeIdFile ? "border-red-500" : ""}`} 
                    />
                    {formErrors.collegeIdFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.collegeIdFile}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">Delegate Experience (PDF)</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "delegateExperienceFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.delegateExperienceFile ? "border-red-500" : ""}`} 
                    />
                    {formErrors.delegateExperienceFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.delegateExperienceFile}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 5 && !isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Required Documents</h2>
                <div className="flex-grow space-y-4 md:space-y-6 py-2">
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">ID Proof (Aadhar/Passport)</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "idProofFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.idProofFile ? "border-red-500" : ""}`} 
                    />
                    {formErrors.idProofFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.idProofFile}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">Delegate Experience (PDF)</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "delegateExperienceFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.delegateExperienceFile ? "border-red-500" : ""}`} 
                    />
                    {formErrors.delegateExperienceFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.delegateExperienceFile}</p>
                    )}
                  </div>
                  
                  {isHeadOfDelegation && (
                    <div className="space-y-2">
                      <Label className="text-sm md:text-base">Delegation Sheet</Label>
                      <Input 
                        type="file"
                        onChange={(e) => handleFileChange(e, "delegationSheetFile")}
                        className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.delegationSheetFile ? "border-red-500" : ""}`} 
                      />
                      {formErrors.delegationSheetFile && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.delegationSheetFile}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="text-sm md:text-base">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 5 && isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Payment</h2>
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
                    {formErrors.paymentId && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.paymentId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">Payment Proof</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "paymentProofFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.paymentProofFile ? "border-red-500" : ""}`} 
                    />
                    {formErrors.paymentProofFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.paymentProofFile}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms-internal" 
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          termsAccepted: !!checked
                        });
                        if (formErrors.termsAccepted) {
                          setFormErrors({
                            ...formErrors,
                            termsAccepted: ''
                          });
                        }
                      }}
                    />
                    <Label 
                      htmlFor="terms-internal" 
                      className={`text-xs md:text-sm ${formErrors.termsAccepted ? "text-red-500" : "text-gray-600"}`}
                    >
                      I agree to receive emails and opportunities from Amrita MUN'25 and its official partners
                    </Label>
                  </div>
                  {formErrors.termsAccepted && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.termsAccepted}</p>
                  )}
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-sm md:text-base">
                    Submit Application
                  </Button>
                </div>
              </Card>
            )}
            
            {currentStep === 6 && !isInternal && (
              <Card className="p-3 md:p-6 flex-grow flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#00B7FF]">Payment</h2>
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
                    {formErrors.paymentId && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.paymentId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base">Payment Proof</Label>
                    <Input 
                      type="file"
                      onChange={(e) => handleFileChange(e, "paymentProofFile")}
                      className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#00B7FF] hover:file:bg-blue-100 ${formErrors.paymentProofFile ? "border-red-500" : ""}`}
                    />
                    {formErrors.paymentProofFile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.paymentProofFile}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms-external"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          termsAccepted: !!checked
                        });
                        if (formErrors.termsAccepted) {
                          setFormErrors({
                            ...formErrors,
                            termsAccepted: ''
                          });
                        }
                      }}
                    />
                    <Label 
                      htmlFor="terms-external" 
                      className={`text-xs md:text-sm ${formErrors.termsAccepted ? "text-red-500" : "text-gray-600"}`}
                    >
                      I agree to receive emails and opportunities from Amrita MUN'25 and its official partners
                    </Label>
                  </div>
                  {formErrors.termsAccepted && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.termsAccepted}</p>
                  )}
                </div>
                
                <div className="flex justify-between mt-6 md:mt-8">
                  <Button type="button" onClick={prevStep} variant="outline" className="text-sm md:text-base">
                    Back
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-sm md:text-base">
                    Submit Application
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
};

export default RegistrationForm;
