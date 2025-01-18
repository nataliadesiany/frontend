'use client'

import React from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ImageQueryPage() {
  const router = useRouter()

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
            className={styles.uploadButton}
            onClick={() => router.push('/image-query/browse')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="104" height="104" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Image Query</span>
          </button>
        </div>

        <button onClick={() => router.push('/image')} className={styles.nextButton}>
          Back
        </button>
      </main>
    </div>
  )
}
