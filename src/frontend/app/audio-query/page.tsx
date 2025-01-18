'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AudioQueryPage() {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [selectedOption, setSelectedOption] = useState<'record' | 'browse' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingDuration(0)
      const startTime = Date.now()
      const durationInterval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      mediaRecorderRef.current.onstop = () => {
        clearInterval(durationInterval)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setRecordedBlob(audioBlob)
        setIsRecording(false)
        setSelectedOption('record')
      }
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your browser settings.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleRecordClick = () => {
    setSelectedOption('record')
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handlePlayRecording = () => {
    if (recordedBlob) {
      const audioUrl = URL.createObjectURL(recordedBlob)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioQueryClick = () => {
    setSelectedOption('browse')
  }

  const handleNext = () => {
    if (selectedOption === 'record' && recordedBlob) {
      // Route directly to search page for recorded audio
      router.push('/search')
    } else if (selectedOption === 'browse') {
      // Navigate to the audio query upload page
      router.push('/audio-query/browse')
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            alt="Harmony Lens Logo"
            width={60}
            height={60}
            className={styles.logoIcon}
          />
          <h1 className={styles.title}>Harmony Lens</h1>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.heading}>Please select your upload type:</h2>
        <p className={styles.subtitle}>
          Harmony Lens: Effortless Upload and Instant Similarity Discovery
        </p>

        <div className={styles.uploadOptions}>
          <button 
            className={`${styles.uploadButton} ${selectedOption === 'record' ? styles.selected : ''}`}
            onClick={handleRecordClick}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15c2.21 0 4-1.79 4-4V5c0-2.21-1.79-4-4-4S8 2.79 8 5v6c0 2.21 1.79 4 4 4zm0-2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2z"/>
              <path d="M19 12h-2c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92z"/>
            </svg>
            <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>

          <button 
            className={`${styles.uploadButton} ${selectedOption === 'browse' ? styles.selected : ''}`}
            onClick={handleAudioQueryClick}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <span>Audio Query</span>
          </button>
        </div>

        {recordedBlob && (
          <div className={styles.recordingControls}>
            <p className={styles.recordingDuration}>Recording duration: {recordingDuration} seconds</p>
            <button onClick={handlePlayRecording} className={styles.playButton}>
              {isPlaying ? 'Playing...' : 'Play Recording'}
            </button>
          </div>
        )}

        <audio ref={audioRef} onEnded={handleAudioEnded} style={{display: 'none'}} />

        {selectedOption && (
          <button 
            onClick={handleNext} 
            className={styles.nextButton}
          >
            Next
          </button>
        )}
      </main>
    </div>
  )
}