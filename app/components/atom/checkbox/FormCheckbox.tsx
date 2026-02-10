'use client';

interface FormCheckboxProps {
  id: string;
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function FormCheckbox({ id, label, checked = false, onChange }: FormCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-teal-700 cursor-pointer accent-teal-700"
      />
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer font-medium">
        {label}
      </label>
    </div>
  );
}
