import React from 'react';
import { Spinner } from 'react-bootstrap';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  colorSpinner?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export const Button: React.FC<IButtonProps> = ({ isLoading, children, colorSpinner = 'light', ...props }: IButtonProps) => (
  <button className="px-3" {...props} disabled={isLoading || props.disabled}>
    {isLoading && (
      <Spinner className="mr-2" as="span" animation="border" size="sm" role="status" aria-hidden="true" variant={colorSpinner} />
    )}
    {children}
  </button>
);
