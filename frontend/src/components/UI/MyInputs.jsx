import { useRef, useState, useEffect } from "react";
import { Pencil, Trash2, Plus, SquarePen, ScanBarcode, ChevronDown, Search } from "lucide-react";
import { Image, Select } from "antd";


export function SelectInput({
  value = "",
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
export function SearchSelectInput({
  value = "",
  onChange,
  disabled = false,
  editing = true,
  label = "",
  className = "",
  options = [],
  scanner = null,
  ...props
}) {
  return (
    <label
      className={`input w-full transition-colors duration-300 pr-1 ${!editing && "cursor-text! bg-base-200 text-base-content! border-neutral!"} ${className}`}
    >
      {label && <span className="label font-bold w-44">{label}</span>}
      <Select
        showSearch
        style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
        placeholder="Search and select..."
        className="w-full"
        value={value}
        disabled={disabled || !editing}
        options={options}
        onChange={onChange}
        optionFilterProp="label"
        {...props}
      />
      {editing && scanner &&
        <button className="btn btn-accent btn-sm btn-circle" onClick={() => {
          scanner(true);
        }}>
          <ScanBarcode size={16} />
        </button>
      }
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
  scanner = null,
  ...props
}) {
  return (
    <label
      className={`input w-full transition-colors duration-300 pr-1 ${!editing && "cursor-text! text-base-content! border-neutral!"} ${className}`}
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
      {editing && scanner &&
        <button className="btn btn-accent btn-sm btn-circle" onClick={() => {
          scanner(true);
        }}>
          <ScanBarcode size={16} />
        </button>
      }
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

export function FileInput({
  onChange,
  disabled = false,
  editing = true,
  clear,
  className = "",
  inputClassName = "",
  accept = "image/*",
  name = "file",
  previewUrl = null,
  existingImageUrl = null,
  defaultImage = null,
  altText = "Image preview",
  ...props
}) {
  const displayImage = previewUrl || existingImageUrl || defaultImage;
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`flex justify-center items-center w-fit sm:arrow relative ${className}`}>
      {displayImage && (
          <Image preview={!defaultImage && !editing} height={350} className="object-contain object-center rounded-lg" src={displayImage} alt={altText} />
      )}
      {editing &&
      <>
        <span onClick={handleImageClick} className="sm:opacity-0 transition-all hover:scale-115 bg-success/80 absolute top-1/2 -translate-y-1/2 translate-x-1/2 right-1/2 cursor-pointer rounded-full">
          {defaultImage && <Plus size={66} strokeWidth={3} className="text-success-content/80 m-2" />}
          {!defaultImage && <SquarePen size={50} className="text-success-content/80 m-4" />}
        </span>
        <span onClick={clear} className="sm:opacity-0 transition-all hover:scale-115 bg-error absolute top-1 right-1 cursor-pointer rounded-full">
          {!defaultImage && <Trash2 size={24} className="text-error-content m-1.5" />}
        </span>
      </>
      }

      <input
        type="file"
        name={name}
        ref={fileInputRef}
        className='hidden'
        onChange={onChange}
        disabled={disabled || !editing}
        accept={accept}
        {...props}
      />
    </div>
  );
}