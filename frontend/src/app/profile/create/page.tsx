import React from 'react'

function ProfileCreate() {
  const loadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;
    const file = files && files[0];
    if (file) {
      setImageFile(file)
    }
  }

  const uploadImage = async (image: Blob) => {
    setIsLoading(true)
    if (!userId) {
      setIsLoading(false)
      console.error("userID is not set")
      return
    }
    updateProfileImage(image, userId).then(() => {
      setIsLoading(false)
    }).catch((error: AxiosError) => {
      error?.response?.data && setError(error.response.data.message)
      setIsLoading(false)
    })
  }

  return (
    <div>
      <div className={classNames({ "hidden": step != 3 }, "flex flex-col gap-4")}>
        <div>
          <label htmlFor="name">Name</label>
          <input name='name' id='name' className='input w-full input-bordered' type="text" />
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input name='surname' id='surname' className='input w-full input-bordered' type="text" />
        </div>

        <button className='btn btn-primary text-neutral-100' type='submit' onClick={signup}>Next</button>
      </div>

      <div className={classNames({ "hidden": step != 4 }, "flex flex-col gap-4")}>
        <div>
          <label htmlFor="image">Image</label>
          <input id='image' className='file-input w-full input-bordered' type="file" onChange={loadImage} />
        </div>
        <div>
          {
            imageFile && <ImageCropper imageFile={imageFile} onImageSave={uploadImage} />
          }
        </div>
        <button className='btn btn-ghost text-neutral-100' onClick={() => setStep(5)}>Skip</button>
        <button className={classNames('btn btn-success text-neutral-100', { "disabled": !!imageFile })} onClick={() => setStep(5)}>Update</button>
      </div>
    </div>
  )
}

export default page