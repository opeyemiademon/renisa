'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, RotateCcw, Info, RefreshCw, Upload, X } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Button } from './Button'

interface PhotoCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageFile: File) => void
  title?: string
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({ 
  isOpen, 
  onClose, 
  onCapture,
  title = 'Capture Photo'
}) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const initializeCamera = useCallback(
    async (mode: 'user' | 'environment' = facingMode) => {
      if (typeof window === 'undefined') return

      if (!window.isSecureContext) {
        setError('Camera capture requires a secure (https) connection or running on localhost. Please switch to a secure URL and try again.')
        setIsInitializing(false)
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported on this browser. Please update your browser or try another one.')
        setIsInitializing(false)
        return
      }

      setIsInitializing(true)
      setError(null)

      const constraintOptions: MediaStreamConstraints[] = [
        {
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        },
        {
          video: {
            facingMode: mode
          },
          audio: false
        },
        {
          video: true,
          audio: false
        }
      ]

      stopStream()

      let mediaStream: MediaStream | null = null

      for (const constraints of constraintOptions) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
          break
        } catch (err) {
          // Continue to next constraint
        }
      }

      if (!mediaStream) {
        setError('Unable to access the camera. Please grant permission and ensure no other app is using it.')
        setIsInitializing(false)
        return
      }

      try {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await new Promise(resolve => setTimeout(resolve, 100))
          await videoRef.current.play()
        }

        setStream(mediaStream)
        setFacingMode(mode)
      } catch (err) {
        setError('We accessed the camera, but the stream could not start. Please retry.')
        mediaStream.getTracks().forEach((track) => track.stop())
      } finally {
        setIsInitializing(false)
      }
    },
    [facingMode, stopStream]
  )

  useEffect(() => {
    if (isOpen) {
      initializeCamera()
    } else {
      stopStream()
      setCapturedImage(null)
      setError(null)
    }
    
    return () => {
      stopStream()
    }
  }, [isOpen])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(dataUrl)

    video.pause()
  }

  const handleRetake = () => {
    setCapturedImage(null)
    if (videoRef.current) {
      videoRef.current.play().catch(() => initializeCamera(facingMode))
    } else {
      initializeCamera(facingMode)
    }
  }

  const toggleCamera = () => {
    const mode = facingMode === 'environment' ? 'user' : 'environment'
    initializeCamera(mode)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file only.')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`File exceeds 5MB limit. File size is ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setCapturedImage(dataUrl)
        setError(null)
      }
      reader.onerror = () => {
        toast.error('Failed to read file')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      toast.error('Failed to process file')
    }
  }

  const handleUploadFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleConfirm = async () => {
    if (!capturedImage) return

    try {
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
      
      onCapture(file)
      onClose()
    } catch (err) {
      toast.error('Failed to process the image. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='relative mx-auto flex h-full max-h-[90vh] w-full max-w-6xl flex-col gap-6 overflow-y-auto rounded-3xl bg-white px-4 py-6 shadow-2xl md:px-8'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors'
        >
          <X className='w-5 h-5 text-gray-600' />
        </button>

        <header className='relative space-y-3 text-center'>
          <h1 className='text-2xl font-semibold text-slate-900 md:text-3xl'>{title}</h1>
          <p className='text-sm leading-relaxed text-slate-600'>Use your camera to capture a photo or upload an image from your device.</p>
        </header>

        <section className='relative grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-lg'>
            <div className='relative overflow-hidden rounded-xl bg-slate-900'>
              <div className='relative aspect-[4/3] w-full'>
                  {!capturedImage ? (
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <Image
                      src={capturedImage}
                      alt='Captured photo preview'
                      fill
                      className='object-contain'
                    />
                  )}
                {isInitializing && (
                  <div className='absolute inset-0 flex items-center justify-center bg-slate-900/70 text-white'>
                    <div className='flex flex-col items-center gap-2 text-sm font-medium'>
                      <span className='animate-pulse'>Initialising camera…</span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className='absolute inset-0 flex items-center justify-center bg-slate-900/70 px-6 text-center text-sm font-medium text-white'>
                    {error}
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className='hidden' />
            </div>

            <div className='mt-4 flex flex-wrap items-center gap-3'>
              {!capturedImage ? (
                <>
                  <Button
                    onClick={handleCapture}
                    disabled={isInitializing || !!error || !stream}
                    className='flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm shadow-lg'
                  >
                    <Camera className="w-4 h-4" /> Capture
                  </Button>
                  <Button
                    onClick={toggleCamera}
                    type='button'
                    variant='outline'
                    disabled={isInitializing || !!error || !stream}
                    className='flex items-center gap-2 rounded-lg border-slate-300 px-4 py-2.5 text-sm'
                  >
                    <RefreshCw className="w-4 h-4" /> Switch
                  </Button>
                  <Button
                    onClick={handleUploadFileClick}
                    type='button'
                    variant='outline'
                    className='flex items-center gap-2 rounded-lg border-blue-300 bg-blue-50 px-5 py-2.5 text-sm text-blue-700 hover:bg-blue-100'
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={handleRetake}
                    type='button'
                    variant='outline'
                    className='flex items-center gap-2 rounded-lg border-slate-300 px-5 py-2.5 text-sm'
                  >
                    <RotateCcw className="w-4 h-4" /> Retake
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    type='button'
                    className='flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm shadow-lg hover:bg-blue-700'
                  >
                    <Camera className="w-4 h-4" /> Use Photo
                  </Button>
                </>
              )}
            </div>

            {!capturedImage && !error && (
              <p className='mt-3 flex items-center gap-2 text-xs text-slate-500'>
                <Info className='text-slate-400 w-4 h-4' /> Ensure good lighting before capturing.
              </p>
            )}

            {!capturedImage && !!error && (
              <p className='mt-3 flex items-center gap-2 text-xs text-blue-600'>
                <Info className='text-blue-400 w-4 h-4' /> Camera unavailable? Use "Upload" instead.
              </p>
            )}
          </div>

          <aside className='flex flex-col gap-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-lg'>
              <h2 className='text-base font-semibold text-slate-900'>Tips</h2>
              <ul className='mt-3 space-y-2 text-xs text-slate-600'>
                <li className='flex gap-2'><span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-600' />Use good lighting</li>
                <li className='flex gap-2'><span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-600' />Hold device steady</li>
                <li className='flex gap-2'><span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-600' />Avoid shadows and glare</li>
              </ul>
            </div>

            {capturedImage && (
              <div className='rounded-2xl border border-green-200 bg-green-50 p-4'>
                <h2 className='text-base font-semibold text-green-900'>Ready to use</h2>
                <p className='mt-2 text-xs text-green-800'>Click "Use Photo" to apply this image.</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  )
}
