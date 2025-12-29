/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import "./TextArea.scss";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  labelClassName?: string;
  // register?: any,
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  className = '',
  labelClassName,
  // register,
  ...props
}, ref) => {
  return (
    <div className={`textarea-container ${className}`.trim()}>
      {label && <label className={`textarea-label ${labelClassName}`}>{label}</label>}
      <textarea
        ref={ref}
        className={`textarea ${error ? 'textarea-error' : ''}`.trim()}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
