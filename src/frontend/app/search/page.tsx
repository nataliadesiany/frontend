'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

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
          Processing your recording for database matches. Please wait.
        </h2>
        
        <div className={styles.card}>
          <div className={styles.status}>
            {isAnalyzing 
              ? "Analyzing your recording for matches in our database, please wait..."
              : "Analysis complete! Matches found in our database"
            }
          </div>

          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${progress}%` }}
            />
            <div className={styles.progressText}>
              {isAnalyzing ? "Loading..." : "Analysis completed!"}
            </div>
          </div>
        </div>

        {!isAnalyzing && (
          <button 
            onClick={() => router.push('/results')}
            className={styles.showButton}
          >
            Show similarity list
          </button>
        )}
      </main>
    </div>
  )
}
