'use client'

import React, { useState, useRef } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ImageQueryUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = () => {
    if (selectedFile) {
      router.push(`/results?type=image&file=${encodeURIComponent(selectedFile.name)}`)
    }
  }

  if (isComplete) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Harmony Lens Logo"
              width={24}
              height={24}
              className={styles.logoIcon}
            />
            <h1 className={styles.title}>Harmony Lens</h1>
          </div>
        </header>
        <main className={styles.main}>
          <h1 className={styles.heading}>Your upload has been completed</h1>
          <div className={styles.uploadCard}>
            <div className={styles.fileInfo}>
              {selectedFile?.name} | File has been successfully uploaded
            </div>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: '100%' }}
              />
              <div className={styles.progressText}>
                Successfully uploaded!
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/search')}
            className={styles.searchButton}
          >
            Search for similarities
          </button>
        </main>
      </div>
    )
  }

  if (isUploading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Harmony Lens Logo"
              width={24}
              height={24}
              className={styles.logoIcon}
            />
            <h1 className={styles.title}>Harmony Lens</h1>
          </div>
        </header>
        <main className={styles.main}>
          <h1 className={styles.heading}>Your image query is being uploaded...</h1>
          <div className={styles.uploadCard}>
            <div className={styles.fileInfo}>
              {selectedFile?.name} | File is being uploaded...
            </div>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${uploadProgress}%` }}
              />
              <div className={styles.progressText}>
                Loading...
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            alt="Harmony Lens Logo"
            width={24}
            height={24}
            className={styles.logoIcon}
          />
          <h1 className={styles.title}>Harmony Lens</h1>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Upload Your Image for Similarity Analysis</h1>
        <p className={styles.subtitle}>
          Harmony Lens: Effortless Upload and Instant Similarity Discovery
        </p>

        <div 
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className={styles.dropzoneText}>
            Browse for files or drag and drop them here
          </p>
          <button className={styles.browseButton} onClick={handleBrowseClick}>
            Browse your file
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
          {selectedFile && (
            <p className={styles.selectedFile}>Selected file: {selectedFile.name}</p>
          )}
          <p className={styles.acceptedFiles}>
            Accepted file types are .jpg, .png
          </p>
        </div>

        {selectedFile && (
          <button onClick={handleUpload} className={styles.uploadButton}>
            Upload
          </button>
        )}
      </main>
    </div>
  )
}
