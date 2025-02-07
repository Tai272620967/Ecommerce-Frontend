/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  // label: string;
  name: string;
  register?: any; // Thay đổi type này tùy theo usage của bạn
  error?: FieldError;
  required?: boolean;
  type?: string;
  className?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, register, error, required, type = 'text', className, placeholder }) => {
  return (
    <div className="input-wrap">
      {/* <label htmlFor={name}>{label}</label> */}
      <input className={className} id={name} {...(register ? register(name, { required }) : {})} type={type} placeholder={placeholder} />
      {error && <span>{error.message}</span>}
    </div>
  );
};

export default InputField;

