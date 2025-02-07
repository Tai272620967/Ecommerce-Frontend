import React from "react";
import Select from "react-select";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: SelectOption | undefined) => void;
  value?: SelectOption;
  isDisabled?: boolean;
  label?: string;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  value,
  isDisabled = false,
  label,
  className,
  labelClassName,
  selectClassName,
}) => {
  return (
    <div className={className}>
      <label className={labelClassName}>{label}</label>
      <Select
        options={options}
        placeholder={placeholder}
        onChange={(selected) => onChange(selected || undefined)}
        value={value}
        isDisabled={isDisabled}
        styles={{
          control: (provided) => ({
            ...provided,
            // borderRadius: "4px",
            // borderColor: "#ccc",
            // padding: "5px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#e0e0e0" : "#fff",
            color: "#000",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }),
        }}
        className={selectClassName}
      />
    </div>
  );
};

export default CustomSelect;
