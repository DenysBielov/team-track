import React, { MouseEvent, useEffect, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'

export const readFile = (file: any): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number, y: number, width: number, height: number },
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = image.width
  canvas.height = image.height

  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(file!)
    }, 'image/png')
  })
}

const ImageCropper = ({ imageFile, onImageSave }: { imageFile: File, onImageSave: Function }) => {
  const [image, setImage] = useState<string>()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  useEffect(() => {
    if (!imageFile) {
      return
    }

    readFile(imageFile).then(imageDataUrl => {
      setImage(imageDataUrl);
    })
  }, [imageFile])

  const saveImage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      const croppedImage = await getCroppedImg(
        image!,
        croppedAreaPixels!
      )
      console.log('done', { croppedImage })
      onImageSave(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <button onClick={saveImage} className='btn w-full btn-success'>Save</button>
        <div className="relative w-full aspect-[1]">
          {image && <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            aspect={1 / 1}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />}
        </div>
      </div>
    </div>
  );
};

export default ImageCropper