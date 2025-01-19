'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface AudioResult {
  index: number;
  similarity: number;
  file: string;
}

interface ImageResult {
  index: number;
  similarity: number;
  file?: string;  // Optionally include a file key for consistency
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const queryType = searchParams.get('type');
  const queryFileName = searchParams.get('file');

  const [results, setResults] = useState<(AudioResult | ImageResult)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState('Calculating...');
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const itemsPerPage = 8;

  const fetchResults = async () => {
    try {
      const formData = new FormData();
      formData.append('file', queryFileName || '');

      const response = await fetch(`/query/${queryType}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch results with status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if results are empty and handle accordingly
      if (!data.results || data.results.length === 0) {
        setResults([]);
        alert('No results found.');
      } else {
        setResults(data.results || []);
      }

      setExecutionTime(data.execution_time_ms || 'N/A');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching results:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      alert('An error occurred while fetching results. Please try again.');
    }
  };

  useEffect(() => {
    if (queryFileName && queryType) {
      fetchResults();
    }
  }, [queryFileName, queryType]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = results.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePlay = (id: number, audioUrl: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlaying(id);
      }
    }
  };

  const handleStop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(null);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const renderPaginationButtons = () => {
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        className={styles.paginationButton}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return buttons;
  };

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
            Total Matches: {results.length} | Execution Time: {executionTime} ms
          </p>
        </div>
        <div className={styles.grid}>
          {currentResults.length === 0 ? (
            <p>No results found.</p>
          ) : (
            currentResults.map((result) => (
              <div key={result.index} className={styles.resultCard}>
                {queryType === 'image' ? (
                  <div className={styles.imageContainer}>
                    <Image
                      src={`/images/${result.index}.png`}
                      alt={`Image result ${result.index}`}
                      layout="fill"
                      className={styles.resultImage}
                    />
                  </div>
                ) : (
                  <div className={styles.controls}>
                    <button
                      className={`${styles.controlButton} ${playing === result.index ? styles.active : ''}`}
                      onClick={() => handlePlay(result.index, `/audio/${(result as AudioResult).file}`)}
                    >
                      {playing === result.index ? 'Pause' : 'Play'}
                    </button>
                    <button
                      className={styles.controlButton}
                      onClick={handleStop}
                      disabled={playing !== result.index}
                    >
                      Stop
                    </button>
                  </div>
                )}
                <p className={styles.filename}>File: {result.file || `Image ${result.index}`}</p>
                <p className={styles.similarity}>Similarity: {(result.similarity || 0).toFixed(2)}%</p>
              </div>
            ))
          )}
        </div>
        <div className={styles.pagination}>{renderPaginationButtons()}</div>
      </main>
      <audio ref={audioRef} />
    </div>
  );
}
