/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { Button } from '@/base/components/Button/Button';

type Inputs = Record<string, any>;

interface FormContainerProps {
  onSubmit: SubmitHandler<Inputs>;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function FormContainer({ onSubmit, className, children, isLoading }: FormContainerProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, { register, errors });
      })}
      <Button className="login-button mt-0" isLoading={isLoading}>{!isLoading && "Log in"}</Button>
    </form>
  );
}


