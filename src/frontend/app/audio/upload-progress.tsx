'use client'

import React from 'react'
import styles from './upload-progress.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface UploadProgressProps {
  fileName: string
  fileSize: number
  uploadedSize: number
  isComplete: boolean
  onUploadAnother: () => void
}

export default function UploadProgress({
  fileName,
  fileSize,
  uploadedSize,
  isComplete,
  onUploadAnother
}: UploadProgressProps) {
  const router = useRouter()
  const progress = (uploadedSize / fileSize) * 100

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
        <h2 className={styles.heading}>
          {isComplete ? 'Your upload has been completed' : 'Your dataset is being uploaded...'}
        </h2>

        <div className={styles.uploadCard}>
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{fileName}</div>
            <div className={styles.fileSize}>
              {isComplete ? 'File has been successfully uploaded' : 'File is being uploaded...'}
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${progress}%` }}
            />
            <div className={styles.progressText}>
              {isComplete ? 'Successfully uploaded!' : 'Loading...'}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className={styles.buttons}>
            <button 
              onClick={onUploadAnother}
              className={styles.uploadAnotherButton}
            >
              Upload another
            </button>
            <button 
              onClick={() => router.push('/audio-query')}
              className={styles.nextButton}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}