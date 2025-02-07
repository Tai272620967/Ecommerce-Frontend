/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface InputFieldProps {
  name: string;
  register: any;
  errors: any;
  label?: string;
  className?: string;
  placeHolder?: string;
  isCustom?: boolean;
  isCustomLabel?: boolean;
  // maxLength?: number;
  type?: string;
  value?: any;
  onChange?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  register,
  errors,
  label,
  className,
  placeHolder,
  isCustom,
  isCustomLabel,
  // maxLength,
  type,
  value,
}) => {
  return (
    <div className={`input-field ${isCustom ? "input-field--custom": ""}`}>
      {label && <label htmlFor={name} className={`input-field__label ${isCustomLabel ? "custom" : ""}`}>{label}</label>}
      <input
        {...register(name)}
        id={name}
        className={`${className} ${errors?.[name] ? "input-field--border-red" : ""}`}
        placeholder={placeHolder}
        // maxlength={maxLength}
        type={type}
        value={value}
      />
        {errors?.[name] && (
          <p
            className="input-error-message"
            style={{ color: "red" }}
          >{`${errors?.[name]?.message}`}</p>
        )}
    </div>
  );
};

export default InputField;
