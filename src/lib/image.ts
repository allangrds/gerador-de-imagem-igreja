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

export function fitWithin(width: number, height: number, max: number) {
  const scale = Math.min(1, max / Math.max(width, height))

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

// Shrinks uploads so they fit in localStorage and keep the exported files light.
export async function readImageFile(file: File, max = 1600): Promise<Photo> {
  const image = await loadImage(await readAsDataUrl(file))
  const size = fitWithin(image.naturalWidth, image.naturalHeight, max)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  canvas.getContext('2d')?.drawImage(image, 0, 0, size.width, size.height)

  // PNG keeps transparency (logos); everything else becomes a lighter JPEG.
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

  return {
    src: canvas.toDataURL(type, 0.85),
    name: file.name,
    detail: `${formatBytes(file.size)} · ${image.naturalWidth} × ${image.naturalHeight}`,
  }
}
