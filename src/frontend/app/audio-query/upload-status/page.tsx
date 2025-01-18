'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

export default function UploadStatus() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  if (isComplete) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.heading}>Your upload has been completed</h1>
          <div className={styles.uploadCard}>
            <div className={styles.fileInfo}>
              File has been successfully uploaded
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

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.heading}>Your audio query is being uploaded...</h1>
        <div className={styles.uploadCard}>
          <div className={styles.fileInfo}>
            File is being uploaded...
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
