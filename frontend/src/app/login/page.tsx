'use client'

import { capitalizeFirstLetter } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import { availableProviders } from '@/auth'
import { FcGoogle as GoogleIcon } from "react-icons/fc"
import { FaRegEye as EyeIcon, FaRegEyeSlash as EyeIconCrossed } from "react-icons/fa6"

function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const callback = searchParams.get('callback')

  const credentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const result = await signIn("credentials", { redirect: false, email: formData.get("email"), password: formData.get("password") })
    console.log(result)
  }

  console.log(availableProviders)

  return (
    <div className='min-w-96 w-fit self-center'>
      <form onSubmit={credentialsSignIn} className='flex flex-col gap-4'>
        <div>Do not have an account? <Link href={"/sign-up"} className="link">Register</Link></div>
        <input name="email" type="text" className='input outline outline-1 w-full' />
        <div className='relative'>
          <input name="password" type={showPassword ? "text" : "password"} className='input outline outline-1 w-full' />
          <span className='cursor-pointer absolute right-4 top-1/2 -translate-y-1/2' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeIconCrossed /> : <EyeIcon />}
          </span>
        </div>
        <Link href={"/forgot-password"} className="link">Forgot your password?</Link>
        <button className='btn btn-success text-neutral-100'>Login</button>
      </form>
      <div className="divider">OR</div>
      <div className='flex flex-col gap-4'>
        {availableProviders && Object.values(availableProviders!).filter(p => p.id != "credentials").map((provider) => (
          <div key={provider.name}>
            <button className='btn w-full' onClick={() => signIn(provider.id)}>
              {getProviderLogo(provider.id)} Sign in with {capitalizeFirstLetter(provider.name)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function getProviderLogo(id: string) {
  const iconSize = 24
  switch (id) {
    case "google":
      return <GoogleIcon size={iconSize} />
    default:
      return <></>
  }
}

export default LoginPage