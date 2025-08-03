'use client'

import Loader from '@/components/Loader'
import React, { ChangeEvent, useRef, useState } from 'react'
import { FaRegEye as EyeIcon, FaRegEyeSlash as EyeIconCrossed } from "react-icons/fa6"
import { register as registerUser } from '@/lib/requests/auth'
import { AxiosError } from 'axios'
import { redirect } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'

interface SignUpFormInputs {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await registerUser(data.email, data.password)
      
      if (response.requiresEmailConfirmation) {
        router.push(`/email-verification?email=${encodeURIComponent(data.email)}`);
      } else {
        // If email confirmation is not required, redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError;
      const errorResponse = axiosError?.response?.data as any;
      
      if (errorResponse?.message) {
        setError(errorResponse.message);
      } else if (errorResponse?.errors) {
        setError(errorResponse.errors.map((e: any) => e.description || e.errorMessage).join(', '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-w-96 w-fit self-center flex flex-col gap-4 relative'>
      {isLoading && <Loader className="absolute bg-black/55 inset-0 -m-4" />}
      <h1 className='text-2xl'>Sign Up</h1>
      {error && <div className='text-error'>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input {...register('email')} id='email' className='input w-full input-bordered' type="email" />
            {errors.email && <span className='text-error'>{errors.email.message}</span>}
          </div>
          <div className='relative'>
            <label htmlFor="password">Password</label>
            <input {...register('password')} id='password' className='input w-full input-bordered' type={showPassword ? "text" : "password"} />
            <span className='cursor-pointer absolute right-4 top-1/2 translate-y-1/4' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeIconCrossed /> : <EyeIcon />}
            </span>
            {errors.password && <span className='text-error'>{errors.password.message}</span>}
          </div>
          <button className='btn btn-primary text-neutral-100' type='submit'>Next</button>
        </div>
      </form>
    </div>
  )
}

export default SignUpPage