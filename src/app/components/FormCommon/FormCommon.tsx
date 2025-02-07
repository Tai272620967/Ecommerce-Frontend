import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

interface FormProps {
  onSubmit: SubmitHandler<FieldValues>;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  const { handleSubmit } = useForm();

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

export default Form;
