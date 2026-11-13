import { useCallback, useEffect, useRef, useState } from 'react'
import { getStoredJson, setStoredJson } from '../../lib/storage'
import {
  fileNameFromUrl,
  formatBytes,
  loadImage,
  readAsDataUrl,
} from '../../lib/image'
import type { Photo } from '../../lib/image'

export type PhotoSource = 'file' | 'url'

type Fields = {
  title: string
  preacher: string
  photoSource: PhotoSource
  photoUrl: string
  photoPositionY: number
}

const STORAGE_KEY = 'youtube_thumbnail'

export const TITLE_MAX_LENGTH = 45

export const PHOTO_URL_ERROR =
  'Não conseguimos abrir essa imagem. Use o link direto do arquivo ou envie a foto pelo computador.'

export const PHOTO_FILE_ERROR = 'Esse arquivo não é uma imagem. Use JPG ou PNG.'

const DEFAULT_FIELDS: Fields = {
  title: '',
  preacher: '',
  photoSource: 'file',
  photoUrl: '',
  photoPositionY: 30,
}

export function useThumbnailForm() {
  const [fields, setFields] = useState<Fields>(() =>
    getStoredJson(STORAGE_KEY, DEFAULT_FIELDS)
  )
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  // Ignores results from photo loads that finished after a newer one started.
  const photoRequest = useRef(0)
  const initialFields = useRef(fields)

  useEffect(() => {
    setStoredJson(STORAGE_KEY, fields)
  }, [fields])

  const update = useCallback((patch: Partial<Fields>) => {
    setFields((current) => ({ ...current, ...patch }))
  }, [])

  const loadFromFile = useCallback(async (file: File) => {
    const request = ++photoRequest.current

    if (!file.type.startsWith('image/')) {
      setPhotoError(PHOTO_FILE_ERROR)
      return
    }

    try {
      const src = await readAsDataUrl(file)
      const image = await loadImage(src)

      if (request === photoRequest.current) {
        setPhoto({
          src,
          name: file.name,
          detail: `${formatBytes(file.size)} · ${image.naturalWidth} × ${image.naturalHeight}`,
        })
        setPhotoError(null)
      }
    } catch {
      if (request === photoRequest.current) {
        setPhotoError(PHOTO_FILE_ERROR)
      }
    }
  }, [])

  const loadFromUrl = useCallback(async (url: string) => {
    const request = ++photoRequest.current
    const src = url.trim()

    if (!src) {
      setPhoto(null)
      setPhotoError(null)
      return
    }

    try {
      // Loading with CORS up front: without it the export would fail later.
      const image = await loadImage(src, 'anonymous')

      if (request === photoRequest.current) {
        setPhoto({
          src,
          name: fileNameFromUrl(src),
          detail: `${image.naturalWidth} × ${image.naturalHeight}`,
        })
        setPhotoError(null)
      }
    } catch {
      if (request === photoRequest.current) {
        setPhoto(null)
        setPhotoError(PHOTO_URL_ERROR)
      }
    }
  }, [])

  useEffect(() => {
    const { photoSource, photoUrl } = initialFields.current

    if (photoSource === 'url' && photoUrl) {
      loadFromUrl(photoUrl)
    }
  }, [loadFromUrl])

  const setPhotoSource = useCallback(
    (photoSource: PhotoSource) => {
      photoRequest.current += 1
      setPhoto(null)
      setPhotoError(null)
      update({ photoSource })

      if (photoSource === 'url' && fields.photoUrl) {
        loadFromUrl(fields.photoUrl)
      }
    },
    [fields.photoUrl, loadFromUrl, update]
  )

  const removePhoto = useCallback(() => {
    photoRequest.current += 1
    setPhoto(null)
    setPhotoError(null)
    update({ photoUrl: '' })
  }, [update])

  const clear = useCallback(() => {
    photoRequest.current += 1
    setFields(DEFAULT_FIELDS)
    setPhoto(null)
    setPhotoError(null)
  }, [])

  return {
    ...fields,
    photo,
    photoError,
    canExport: fields.title.trim() !== '' && fields.preacher.trim() !== '',
    update,
    loadFromFile,
    loadFromUrl,
    setPhotoSource,
    removePhoto,
    clear,
  }
}
