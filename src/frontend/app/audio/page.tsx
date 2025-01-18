'use client'

import React, { useState, useRef, useCallback } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import UploadProgress from './upload-progress'

export default function AudioUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback((selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return
    setFiles(selectedFiles)
  }, [])

  const startUpload = () => {
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, 200)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleUpload(Array.from(event.target.files))
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      handleUpload(Array.from(event.dataTransfer.files))
    }
  }

  const handleUploadAnother = () => {
    setFiles([])
    setIsUploading(false)
    setUploadProgress(0)
    setIsComplete(false)
  }

  if (isUploading) {
    return (
      <UploadProgress
        fileName={files[0].name}
        fileSize={files[0].size}
        uploadedSize={Math.floor((uploadProgress / 100) * files[0].size)}
        isComplete={isComplete}
        onUploadAnother={handleUploadAnother}
      />
    )
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
        <h2 className={styles.heading}>Please upload your dataset:</h2>
        <p className={styles.subtitle}>
          Harmony Lens: Effortless Upload and Instant Similarity Discovery
        </p>

        <div
          className={styles.dropzone}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className={styles.dropzoneText}>
            Browse for files or drag and drop them here
          </p>
          <button className={styles.browseButton} onClick={handleBrowseClick}>
            <svg className={styles.plusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Browse your file
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".mid,.wav,.mp3,.ogg,.aac,.zip,.rar,.json,.txt,.jpg,.gif,.png"
            multiple
            style={{ display: 'none' }}
          />
          {files.length > 0 && (
          <p className={styles.selectedFile}>Selected file: {files[0].name}</p>
          )}
          <p className={styles.acceptedFiles}>
            Accepted file types for audio dataset are: audio, folder, multiple zip, rar, midi, wav, aac, json
          </p>
          <p className={styles.acceptedFiles}>
            Accepted file types for image dataset are: jpg, gif, png
          </p>
          <p className={styles.acceptedFiles}>
            Accepted file type for mapper: .json and .txt (with "audio_file" and "pic_name" properties)
          </p>
        </div>

        {files.length > 0 && (
          <button
            onClick={startUpload}
            className={styles.uploadButton}
          >
            Upload
          </button>
        )}
      </main>
    </div>
  )
}
