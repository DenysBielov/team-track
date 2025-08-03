'use client'

import Loader from '@/components/Loader';
import { forgotPassword } from '@/lib/requests/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required')
});

type ForgotPasswordFormProps = {
  onEmailSent?: () => void
}

function ForgotPasswordForm({ onEmailSent }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    }
  });

  const submitForgotPassword = async (data: any) => {
    setIsLoading(true);
    forgotPassword(data.email).then(() => {
      onEmailSent && onEmailSent();
      setIsLoading(false);
    }).catch(({ response }) => {
      setIsLoading(false);
      const errorResponse = response.data as ErrorResponse;
      setError(errorResponse.errors.map(e => e.errorMessage).join(', '));
    });
  }

  return (
    <form onSubmit={handleSubmit(submitForgotPassword)} className='flex flex-col gap-4'>
      {error && <p className="text-error">{error}</p>}
      <Controller
        disabled={isLoading}
        name="email"
        control={control}
        render={({ field }) => (
          <input {...field} className='input input-bordered w-full text-neutral-content' type='email' />
        )}
      />
      {errors.email && <p className="text-error">{errors.email.message}</p>}
      <button disabled={isLoading} type='submit' className='btn btn-primary relative w-full'>
        {isLoading ? <Loader className="inset-0" /> : "Send"}
      </button>
    </form>
  )
}

export default ForgotPasswordForm