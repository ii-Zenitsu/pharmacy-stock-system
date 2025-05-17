import React from "react";

export function SelectInput({
  value,
  onChange,
  disabled = false,
  editing = true,
  label = "",
  className = "",
  options = [],
  ...props
}) {
  return (
    <label
      className={`select w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"} ${className}`}
    >
      {label && <span className="label font-bold w-44">{label}</span>}
      <select
        className="disabled:cursor-text!"
        value={value}
        onChange={onChange}
        disabled={disabled || !editing}
        {...props}
      >
        {options.map(opt =>
          typeof opt === "string"
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  disabled = false,
  editing = true,
  label = "",
  className = "",
  type = "text",
  placeholder = "",
  ...props
}) {
  return (
    <label
      className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"} ${className}`}
    >
      {label && <span className="label font-bold w-44">{label}</span>}
      <input
        type={type}
        placeholder={placeholder}
        className="disabled:cursor-text!"
        value={value}
        onChange={onChange}
        disabled={disabled || !editing}
        {...props}
      />
    </label>
  );
}

export function CheckboxInput({
  checked,
  onChange,
  disabled = false,
  editing = true,
  label = "",
  className = "",
  ...props
}) {
  return (
    <label
      className={`input w-full justify-between transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"} ${className}`}
    >
      {label && <span className="label font-bold w-44">{label}</span>}
      <span className="font-semibold opacity-75">{checked ? "On" : "Off"}</span>
      <input
        type="checkbox"
        className="checkbox border-2 checkbox-primary disabled:cursor-text! disabled:opacity-60"
        checked={checked}
        onChange={onChange}
        disabled={disabled || !editing}
        {...props}
      />
    </label>
  );
}