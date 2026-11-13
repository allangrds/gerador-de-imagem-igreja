export type Photo = {
  src: string
  name: string
  detail: string
}

export function loadImage(src: string, crossOrigin?: 'anonymous') {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    if (crossOrigin) {
      image.crossOrigin = crossOrigin
    }

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Could not load image: ${src}`))
    image.src = src
  })
}

export function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function fileNameFromUrl(url: string) {
  try {
    const name = new URL(url).pathname.split('/').filter(Boolean).pop()

    return name ? decodeURIComponent(name) : url
  } catch {
    return url
  }
}
