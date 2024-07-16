'use client'

import ImageCropper from '@/components/ImageCropper'
import { createUser } from '@/lib/requests/user'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaRegEye as EyeIcon, FaRegEyeSlash as EyeIconCrossed } from "react-icons/fa6"

function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File>()
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob>()

  const signup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    console.log(event.currentTarget)
    formData.set("image", croppedImageBlob!);
    for (var [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await createUser(formData)
  }

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;
    const file = files && files[0];
    if (file) {
      setCroppedImageBlob(undefined)
      setImageFile(file)
    }
  }

  return (
    <div className='min-w-96 w-fit self-center flex flex-col gap-4'>
      <h1 className='text-center text-2xl'>Sign Up</h1>
      <form onSubmit={signup} className='flex flex-col gap-4'>
        <div>
          <label htmlFor="email">Email</label>
          <input name='email' id='email' className='input w-full input-bordered' type="email" />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input name='name' id='name' className='input w-full input-bordered' type="text" />
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input name='surname' id='surname' className='input w-full input-bordered' type="text" />
        </div>
        <div className='relative'>
          <label htmlFor="password">Password</label>
          <input name='password' id='password' className='input w-full input-bordered' type={showPassword ? "text" : "password"} />
          <span className='cursor-pointer absolute right-4 top-1/2 translate-y-1/4' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeIconCrossed /> : <EyeIcon />}
          </span>
        </div>
        <div className='relative'>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input id='confirm-password' className='input w-full input-bordered' type={showConfirmPassword ? "text" : "password"} />
          <span className='cursor-pointer absolute right-4 top-1/2 translate-y-1/4' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeIconCrossed /> : <EyeIcon />}
          </span>
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input id='image' className='file-input w-full input-bordered' type="file" onChange={uploadImage} />
        </div>
        <div>
          {
            croppedImageBlob ?
              // TODO Add animation while image is loading (or placeholder)
              <img className='w-96 self-center' src={URL.createObjectURL(croppedImageBlob)} alt="profile image" /> :
              imageFile && <ImageCropper imageFile={imageFile} onImageSave={setCroppedImageBlob} />
          }
        </div>
        <button className='btn btn-success text-neutral-100' type='submit'>Sign Up</button>
        <Link href={"/login"} className='link text-center'>Login</Link>
      </form>
    </div>
  )
}

export default SignUpPage