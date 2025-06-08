"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

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
}

export const PreferenceSection = React.memo(({ 
  num, 
  pref, 
  setPref, 
  role, 
  setRole,
  formData,
  handleInputChange 
}: PreferenceSectionProps) => {
  const getStringValue = (key: string) => {
    const value = formData[key];
    return typeof value === "string" ? value : "";
  };

  return (
    <div className="space-y-2 md:space-y-3">
      <Label className="text-sm md:text-base font-medium">Preference {num}</Label>
      <Select value={pref} onValueChange={setPref}>
        <SelectTrigger>{pref === "delegate" ? "Delegate" : "International Press"}</SelectTrigger>
        <SelectContent>
          <SelectItem value="delegate">Delegate</SelectItem>
          <SelectItem value="ip">International Press</SelectItem>
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
              <Label className="text-sm md:text-base">Committee Preference</Label>
              <Input 
                name={`committee${num}`}
                value={getStringValue(`committee${num}`)}
                onChange={handleInputChange}
                placeholder={"Committee"} 
                className="mt-1" 
              />
            </div>
          )}
        </div>
      )}

      {pref === "delegate" && (
        <div className="grid grid-cols-1 gap-3 mt-2">
          <Label className="text-sm md:text-base">Committee Preference</Label>
          <Input 
            name={`committee${num}`}
            value={getStringValue(`committee${num}`)}
            onChange={handleInputChange}
            placeholder="Committee" 
            className="mt-1" 
          />
          <Label className="text-sm md:text-base mt-1">Country Preferences</Label>
          <Input
            name={`country${num}_1`}
            value={getStringValue(`country${num}_1`)}
            onChange={handleInputChange}
            placeholder="Country 1"
            className="mt-1"
          />
          <Input
            name={`country${num}_2`}
            value={getStringValue(`country${num}_2`)}
            onChange={handleInputChange}
            placeholder="Country 2"
          />
          <Input
            name={`country${num}_3`}
            value={getStringValue(`country${num}_3`)}
            onChange={handleInputChange}
            placeholder="Country 3"
          />
        </div>
      )}
    </div>
  );
});

PreferenceSection.displayName = "PreferenceSection";
