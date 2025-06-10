"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface Committee {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
  committee_id: string;
}

interface PreferenceSectionProps {
  num: number;
  pref: string;
  setPref: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  formData: {
    [key: string]: string | boolean | File | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  committees: Committee[];
  countries: Country[];
}

export const PreferenceSection = React.memo(({ 
  num, 
  pref, 
  setPref, 
  role, 
  setRole,
  formData,
  handleInputChange,
  committees,
  countries,
}: PreferenceSectionProps) => {
  const [selectedCommittee, setSelectedCommittee] = useState<string>(
    () => {
      const value = formData[`committee${num}`];
      return typeof value === 'string' ? value : '';
    }
  );

  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    () => {
      return [1, 2, 3].map(index => {
        const value = formData[`country${num}_${index}`];
        return typeof value === 'string' ? value : '';
      });
    }
  );

  useEffect(() => {
    if (pref === 'delegate' || (pref === 'IP' && role === 'reporter')) {
      const committeeValue = formData[`committee${num}`];
      setSelectedCommittee(typeof committeeValue === 'string' ? committeeValue : '');
    }

    const countryValues = [1, 2, 3].map(index => {
      const value = formData[`country${num}_${index}`];
      return typeof value === 'string' ? value : '';
    });
    setSelectedCountries(countryValues);
  }, [formData, num, pref, role]);

  const [isUserAction, setIsUserAction] = useState(false);

  useEffect(() => {
    if (!isUserAction || !selectedCommittee) return;
    
    handleInputChange({
      target: { name: `country${num}_1`, value: "" }
    } as React.ChangeEvent<HTMLInputElement>);
    handleInputChange({
      target: { name: `country${num}_2`, value: "" }
    } as React.ChangeEvent<HTMLInputElement>);
    handleInputChange({
      target: { name: `country${num}_3`, value: "" }
    } as React.ChangeEvent<HTMLInputElement>);
    setSelectedCountries([]);
    setIsUserAction(false);
  }, [selectedCommittee, isUserAction, handleInputChange, num]);

  const handleCommitteeChange = (value: string) => {
    setIsUserAction(true);
    const actualValue = value === 'none' ? '' : value;
    setSelectedCommittee(actualValue);
    handleInputChange({
      target: { name: `committee${num}`, value: actualValue }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const validateSelection = (value: string) => {
    return value !== '' && value !== 'none';
  };

  const handleCountryChange = (value: string, index: number) => {
    const actualValue = value === "none" ? "" : value;
    const newSelectedCountries = [...selectedCountries];
    newSelectedCountries[index - 1] = actualValue;
    setSelectedCountries(newSelectedCountries);
    handleInputChange({
      target: { name: `country${num}_${index}`, value: actualValue }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const getAvailableCountries = (index: number) => {
    if (!selectedCommittee) return [];
    return countries
      .filter(country => country.committee_id === selectedCommittee)
      .filter(country => !selectedCountries.includes(country.id) || 
        selectedCountries[index - 1] === country.id);
  };

  const getStringValue = (key: string) => {
    const value = formData[key];
    return typeof value === "string" ? value : "";
  };

  const parties = [
    { name: "BJP", flagPath: "/parties/bjp.png", members: ["narendra modi", "amit shah"] },
    { name: "Congress", flagPath: "/parties/congress.svg", members: ["rahul gandhi", "sashi tharoor"] },
    { name: "AAP", flagPath: "/parties/aap.svg", members: ["arvind kejriwal"] },
    { name: "AITC", flagPath: "/parties/aitc.svg", members: ["mamata banerjee"] },
    { name: "Samajwadi Party", flagPath: "/parties/samajwadi-party.svg", members: ["akhilesh yadav"] },
  ];
  
  return (
    <div className="space-y-2 md:space-y-3">
      <Label className="text-sm md:text-base font-medium">Category</Label>
      <Select 
        value={pref} 
        onValueChange={setPref}
      >
        <SelectTrigger>{pref === "delegate" ? "Delegate" : "International Press"}</SelectTrigger>
        <SelectContent>
          <SelectItem value="delegate">Delegate</SelectItem>
          <SelectItem value="IP">International Press</SelectItem>
        </SelectContent>
      </Select>

      {pref === "IP" && (
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
              <Label className="text-sm md:text-base">Committee Preference</Label>
              <div className="w-[300px] sm:w-[400px]">
                <Select 
                  value={getStringValue(`committee${num}`) || "none"} 
                  onValueChange={(value) => handleCommitteeChange(value)} 
                  required
                >
                  <SelectTrigger 
                    className={`w-full mt-1 ${!validateSelection(getStringValue(`committee${num}`)) ? 'border-red-500' : ''}`}
                  >
                    {committees.find(c => c.id === getStringValue(`committee${num}`))?.name || "Select Committee"}
                  </SelectTrigger>
                  <SelectContent className="w-[300px] sm:w-[400px]">
                    <SelectItem value="none">Select Committee</SelectItem>
                    {committees.map(committee => (
                      <SelectItem key={committee.id} value={committee.id}>
                        {committee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {pref === "delegate" && (
        <div className="grid grid-cols-1 gap-3 mt-2">
          <Label className="text-sm md:text-base">Committee Preference</Label>
          <div className="w-[300px] sm:w-[400px]">
            <Select 
              value={getStringValue(`committee${num}`) || "none"} 
              onValueChange={(value) => handleCommitteeChange(value)} 
              required
            >
              <SelectTrigger 
                className={`w-full mt-1 ${!validateSelection(getStringValue(`committee${num}`)) ? 'border-red-500' : ''}`}
              >
                {committees.find(c => c.id === getStringValue(`committee${num}`))?.name || "Select Committee"}
              </SelectTrigger>
              <SelectContent className="w-[300px] sm:w-[400px]">
                <SelectItem value="none">Select Committee</SelectItem>
                {committees.map(committee => (
                  <SelectItem key={committee.id} value={committee.id}>
                    {committee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Label className="text-sm md:text-base mt-1">Country/Member Preferences</Label>
          {[1, 2, 3].map((index) => (
            <div key={index} className="w-[300px] sm:w-[400px]">
              <Select
                value={getStringValue(`country${num}_${index}`) || "none"}
                onValueChange={(value) => handleCountryChange(value, index)}
                required
              >
                <SelectTrigger 
                  className={`w-full mt-1 ${!validateSelection(getStringValue(`country${num}_${index}`)) ? 'border-red-500' : ''}`}
                >
                  {countries.find(c => c.id === getStringValue(`country${num}_${index}`))?.name || `Select Country/Member ${index}`}
                </SelectTrigger>
                <SelectContent className="w-[300px] sm:w-[400px]">
                  <SelectItem value="none">{`Select Country/Member ${index}`}</SelectItem>
                  {getAvailableCountries(index).map(country => {
                    const isConstituentAssembly = committees.find(c => c.id === selectedCommittee)?.name === "Constituent Assembly";
                    const defaultFlag = `/flags/${country.name.toLowerCase()}.svg`;
                    const party = parties.find(p => p.members.includes(country.name.toLowerCase()));
                    const flagPath = isConstituentAssembly ? (party?.flagPath ?? defaultFlag) : defaultFlag;
                    
                    return (
                      <SelectItem key={country.id} value={country.id}>
                        <div className="flex items-center">
                          <img 
                            src={flagPath} 
                            alt="flag" 
                            className="w-6 mr-2" 
                          />
                          {country.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

PreferenceSection.displayName = "PreferenceSection";

export type { Committee, Country };
