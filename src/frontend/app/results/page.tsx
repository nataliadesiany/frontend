'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import styles from './page.module.css'

interface AudioResult {
  id: number
  filename: string
  similarity: number
  audioUrl: string
}

interface ImageResult {
  id: number
  filename: string
  similarity: number
  imageUrl: string
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const queryType = searchParams.get('type')
  const queryFileName = searchParams.get('file')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [playing, setPlaying] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const itemsPerPage = 8

  // Mock data for images 
  const imageResults: ImageResult[] = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      filename: `image${i + 1}.png`,
      similarity: [80, 75, 70, 60, 50, 45, 30, 25, 20, 15, 10, 5][i] || 0,
      imageUrl: '/placeholder.svg'
    })),
  [])

  // Mock data for audio
  const audioResults: AudioResult[] = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i + 1,
      filename: `audio${i + 1}.wav`,
      similarity: Math.floor(Math.random() * 76) + 25,
      audioUrl: `/audio${i + 1}.wav`
    })).sort((a, b) => b.similarity - a.similarity),
  [])

  const results = queryType === 'image' ? imageResults : audioResults
  const totalPages = queryType === 'image' ? 10 : Math.ceil(results.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentResults = results.slice(startIndex, startIndex + itemsPerPage)

  const handlePlay = (id: number, audioUrl: string) => {
    if (playing === id) {
      audioRef.current?.pause()
      setPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setPlaying(id)
      }
    }
  }

  const handleStop = () => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
    setPlaying(null)
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const renderPaginationButtons = () => {
    const buttons = []

    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        className={styles.paginationButton}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    )

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
          >
            {i}
          </button>
        )
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
            >
              {i}
            </button>
          )
        }
        buttons.push(<button key="ellipsis1" className={styles.paginationButton}>...</button>)
        buttons.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={styles.paginationButton}
          >
            {totalPages}
          </button>
        )
      } else if (currentPage >= totalPages - 2) {
        buttons.push(
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={styles.paginationButton}
          >
            1
          </button>
        )
        buttons.push(<button key="ellipsis2" className={styles.paginationButton}>...</button>)
        for (let i = totalPages - 2; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
            >
              {i}
            </button>
          )
        }
      } else {
        buttons.push(
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={styles.paginationButton}
          >
            1
          </button>
        )
        buttons.push(<button key="ellipsis3" className={styles.paginationButton}>...</button>)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
            >
              {i}
            </button>
          )
        }
        buttons.push(<button key="ellipsis4" className={styles.paginationButton}>...</button>)
        buttons.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={styles.paginationButton}
          >
            {totalPages}
          </button>
        )
      }
    }

    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    )

    return buttons
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Logo" width={60} height={60} className={styles.logoIcon} />
          <h1 className={styles.title}>Harmony Lens</h1>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.resultsHeader}>
          <h1 className={styles.resultsTitle}>Results for {queryFileName}</h1>
          <p className={styles.resultsStats}>
            Total Matches: {results.length} | Execution Time: {results[0]?.execution_time_ms || 'Calculating...'} ms
          </p>
        </div>
        <div className={styles.grid}>
          {currentResults.map(result => (
            <div key={result.id} className={styles.resultCard}>
              <div className={styles.resultInfo}>
                {queryType === 'image' ? (
                  <div className={styles.imageContainer}>
                    <Image src={result.imageUrl || "/placeholder.svg"} alt={`Image result ${result.id}`} layout="fill" className={styles.resultImage} />
                  </div>
                ) : (
                  <div className={styles.controls}>
                    <button 
                      className={`${styles.controlButton} ${playing === result.id ? styles.active : ''}`}
                      onClick={() => handlePlay(result.id, result.audioUrl)}
                    >
                      {playing === result.id ? 'Pause' : 'Play'}
                    </button>
                    <button 
                      className={styles.controlButton}
                      onClick={handleStop}
                      disabled={playing !== result.id}
                    >
                      Stop
                    </button>
                  </div>
                )}
                <p className={styles.filename}>{result.filename}</p>
                <p className={styles.similarity}>Similarity: {result.similarity}%</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>{renderPaginationButtons()}</div>
      </main>
      <audio ref={audioRef} />
    </div>
  )
}

