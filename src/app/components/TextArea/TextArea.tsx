/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, TextareaHTMLAttributes } from 'react';
import "./TextArea.scss";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  labelClassName?: string;
  // register?: any,
};

const TextArea: FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  labelClassName,
  // register,
  ...props
}) => {
  return (
    <div className={`textarea-container ${className}`.trim()}>
      {label && <label className={`textarea-label ${labelClassName}`}>{label}</label>}
      <textarea
        className={`textarea ${error ? 'textarea-error' : ''}`.trim()}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
};

export default TextArea;
