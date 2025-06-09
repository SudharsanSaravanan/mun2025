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
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>(
    () => {
      return [1, 2, 3].map(index => {
        const value = formData[`committee${num}_${index}`];
        return typeof value === 'string' ? value : '';
      });
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
    if (pref === 'delegate') {
      const committeeValue = formData[`committee${num}`];
      setSelectedCommittee(typeof committeeValue === 'string' ? committeeValue : '');
    } else if (pref === 'IP' && role === 'reporter') {
      const committeeValues = [1, 2, 3].map(index => {
        const value = formData[`committee${num}_${index}`];
        return typeof value === 'string' ? value : '';
      });
      setSelectedCommittees(committeeValues);
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

  const handleCommitteeChange = (value: string, index?: number) => {
    setIsUserAction(true);
    const actualValue = value === 'none' ? '' : value;
    
    if (pref === 'delegate') {
      setSelectedCommittee(actualValue);
      handleInputChange({
        target: { name: `committee${num}`, value: actualValue }
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (typeof index === 'number') {
      const newSelectedCommittees = [...selectedCommittees];
      newSelectedCommittees[index - 1] = actualValue;
      setSelectedCommittees(newSelectedCommittees);
      handleInputChange({
        target: { name: `committee${num}_${index}`, value: actualValue }
      } as React.ChangeEvent<HTMLInputElement>);
    }
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

  return (
    <div className="space-y-2 md:space-y-3">
      <Label className="text-sm md:text-base font-medium">Preference {num}</Label>
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
              <Label className="text-sm md:text-base">Committee Preferences</Label>
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-[300px] sm:w-[400px]">
                  <Label className="text-sm text-gray-600">Committee {index}</Label>
                  <Select 
                    value={getStringValue(`committee${num}_${index}`) || "none"} 
                    onValueChange={(value) => handleCommitteeChange(value, index)} 
                    required
                  >
                    <SelectTrigger 
                      className={`w-full mt-1 ${!validateSelection(getStringValue(`committee${num}_${index}`)) ? 'border-red-500' : ''}`}
                    >
                      {committees.find(c => c.id === getStringValue(`committee${num}_${index}`))?.name || "Select Committee"}
                    </SelectTrigger>
                    <SelectContent className="w-[300px] sm:w-[400px]">
                      <SelectItem value="none">Select Committee</SelectItem>
                      {committees
                        .filter(committee => !selectedCommittees.includes(committee.id) || 
                          getStringValue(`committee${num}_${index}`) === committee.id)
                        .map(committee => (
                          <SelectItem key={committee.id} value={committee.id}>
                            {committee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
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

          <Label className="text-sm md:text-base mt-1">Country Preferences</Label>
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
                  {countries.find(c => c.id === getStringValue(`country${num}_${index}`))?.name || `Select Country ${index}`}
                </SelectTrigger>
                <SelectContent className="w-[300px] sm:w-[400px]">
                  <SelectItem value="none">{`Select Country ${index}`}</SelectItem>
                  {getAvailableCountries(index).map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
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
