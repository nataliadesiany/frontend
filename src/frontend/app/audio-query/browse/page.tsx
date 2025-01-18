'use client'

import React, { useState, useRef } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

export default function AudioQueryUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
    router.push('/audio-query/upload-status')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Upload Your Audio for Similarity Analysis</h1>
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
            accept="audio/*,.mid,.wav"
            style={{ display: 'none' }}
          />
          {selectedFile && (
            <p className={styles.selectedFile}>Selected file: {selectedFile.name}</p>
          )}
          <p className={styles.acceptedFiles}>
            Accepted file types are: midi, wav
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