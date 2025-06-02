"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const RegistrationForm = () => {
  const [isInternal, setIsInternal] = useState(true);
  const [pref1, setPref1] = useState("delegate");
  const [pref2, setPref2] = useState("delegate");
  const [pref3, setPref3] = useState("delegate");
  const [role1, setRole1] = useState("reporter");
  const [role2, setRole2] = useState("reporter");
  const [role3, setRole3] = useState("reporter");
  const [groupDelegation, setGroupDelegation] = useState(false);
  const [isHeadOfDelegation, setIsHeadOfDelegation] = useState(false);

  const PreferenceSection = ({ num, pref, setPref, role, setRole }: any) => (
    <Card className="mb-4 p-4">
      <Label>Preference {num}</Label>
      <Select value={pref} onValueChange={setPref}>
        <SelectTrigger>{pref === "delegate" ? "Delegate" : "IP"}</SelectTrigger>
        <SelectContent>
          <SelectItem value="delegate">Delegate</SelectItem>
          <SelectItem value="ip">IP</SelectItem>
        </SelectContent>
      </Select>

      {pref === "ip" && (
        <div className="mt-2">
          <Label>Preferred Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>{role === "reporter" ? "Reporter" : "Photojournalist"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="reporter">Reporter</SelectItem>
              <SelectItem value="photojournalist">Photojournalist</SelectItem>
            </SelectContent>
          </Select>
          {role === "reporter" && (
            <div className="grid grid-cols-1 gap-2 mt-2">
              <Label>Committee Preferences</Label>
              <Input placeholder="Committee 1" />
              <Input placeholder="Committee 2" />
              <Input placeholder="Committee 3" />
            </div>
          )}
        </div>
      )}

      {pref === "delegate" && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Label>Committee Preference</Label>
          <Input placeholder="Committee" />
          <Label>Country Preferences</Label>
          <Input placeholder="Country 1" />
          <Input placeholder="Country 2" />
          <Input placeholder="Country 3" />
        </div>
      )}
    </Card>
  );

  return (
    <form className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="p-4">
        <Label>Are you an Internal or External participant?</Label>
        <Switch
          checked={isInternal}
          onCheckedChange={() => setIsInternal((prev) => !prev)}
        />
        <span className="ml-2">{isInternal ? "Internal" : "External"}</span>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Personal Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <Input placeholder="Full Name" required />
          <Input placeholder="Phone Number" required />
          <Input placeholder="Email ID" required />
          {isInternal ? (
            <Input placeholder="Roll Number" required />
          ) : (
            <>
              <Input placeholder="Residential Address" />
              <Input placeholder="Residential Pincode" />
              <Input placeholder="University Name" />
              <Input placeholder="University Address" />
              <Input placeholder="University Pincode" />
              <Label>Accommodation needed?</Label>
              <Checkbox />
            </>
          )}
        </div>
      </Card>

      {!isInternal && (
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-2">Delegation Details</h2>
          <Select onValueChange={(val) => setGroupDelegation(val === "group")}>
            <SelectTrigger>{groupDelegation ? "Group Delegation" : "Individual Delegate"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual Delegate</SelectItem>
              <SelectItem value="group">Group Delegation</SelectItem>
            </SelectContent>
          </Select>
          {groupDelegation && (
            <div className="mt-2 space-y-2">
              <Input placeholder="Delegation Name" />
              <Label>Are you Head of Delegation?</Label>
              <Checkbox onCheckedChange={(checked) => setIsHeadOfDelegation(!!checked)} />
            </div>
          )}
        </Card>
      )}

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

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Documents</h2>
        <Label>{isInternal ? "College ID" : "Aadhar/ID"}</Label>
        <Input type="file" />
        <Label>Delegate Experience</Label>
        <Input type="file" />
        {isHeadOfDelegation && (
          <>
            <Label>Delegation Sheet</Label>
            <Input type="file" />
          </>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Payment</h2>
        <Input placeholder="Payment ID" />
        <Label>Payment Proof</Label>
        <Input type="file" />
        <div className="mt-2 flex items-center">
          <Checkbox />
          <span className="ml-2 text-sm">
            I agree to receive emails and opportunities from Amrita MUN’25 and its official partners
          </span>
        </div>
      </Card>

      <Button type="submit" className="w-full mt-4">
        Submit
      </Button>
    </form>
  );
};

export default RegistrationForm;