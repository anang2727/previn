"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}

const InputField = ({ id, label, type = "text", placeholder }: InputFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} className="w-full" />
    </div>
  );
};

export default InputField;
