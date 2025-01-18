'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

const audioFiles = [
  { 
    id: 1, 
    name: 'Espresso.wav', 
    videoId: 'eVli-tstM5E', 
    title: 'Espresso',
    audioUrl: 'https://youtu.be/eVli-tstM5E?si=mXLxzdswav3lGSGd',
  },
  { 
    id: 2, 
    name: 'I Know Places.wav', 
    videoId: 'hwekYIDtabo', 
    title: 'I Know Places',
    audioUrl: 'https://youtu.be/hwekYIDtabo?feature=shared',
  },
  { 
    id: 3, 
    name: 'Enchanted.wav', 
    videoId: 'igIfiqqVHtA', 
    title: 'Enchanted',
    audioUrl: 'https://youtu.be/igIfiqqVHtA?si=pDCMy1_6LeaeRTg7',
  },
  { 
    id: 4, 
    name: 'Stressed Out.wav', 
    videoId: 'pXRviuL6vMY', 
    title: 'Stressed Out',
    audioUrl: 'https://youtu.be/pXRviuL6vMY?feature=shared',
  },
  { 
    id: 5, 
    name: 'Video Games.wav', 
    videoId: 'cE6wxDqdOV0', 
    title: 'Video Games',
    audioUrl: 'https://youtu.be/cE6wxDqdOV0?feature=shared',
  },
  { 
    id: 6, 
    name: 'APT Rose.wav', 
    videoId: 'ekr2nIex040', 
    title: 'APT',
    audioUrl: 'https://youtu.be/ekr2nIex040?feature=shared',
  },
  { 
    id: 7, 
    name: 'Hurricane.wav', 
    videoId: 't-njAuS7eTQ', 
    title: 'Hurricane',
    audioUrl: 'https://youtu.be/t-njAuS7eTQ?si=NqWQ6lYTIRAbPlCK',
  },
  { 
    id: 8, 
    name: 'Wolves.wav', 
    videoId: 'cH4E_t3m3xM', 
    title: 'Wolves',
    audioUrl: 'https://youtu.be/cH4E_t3m3xM?si=aIclz8zd4H4nPUHj',
  },
  { 
    id: 9, 
    name: 'Summertime Sadness.wav', 
    videoId: 'TdrL3QxjyVw', 
    title: 'Summertime Sadness',
    audioUrl: 'https://youtu.be/TdrL3QxjyVw?si=09G24P35BykPM8pp',
  },
  { 
    id: 10, 
    name: 'Wake Me Up.wav', 
    videoId: 'IcrbM1l_BoI', 
    title: 'Wake Me Up',
    audioUrl: 'https://youtu.be/IcrbM1l_BoI?feature=shared',
  },
  { 
    id: 11, 
    name: 'Night Changes.wav', 
    videoId: 'syFZfO_wfMQ', 
    title: 'Night Changes',
    audioUrl: 'https://youtu.be/syFZfO_wfMQ?si=CxxJsOSILqvU9czs',
  },
  { 
    id: 12, 
    name: 'Mine.wav', 
    videoId: 'XPBwXKgDTdE', 
    title: 'Mine',
    audioUrl: 'https://youtu.be/XPBwXKgDTdE?feature=shared',
  },
  { 
    id: 13, 
    name: 'Life is still going on.wav', 
    videoId: '8khwZ4Dql_k', 
    title: 'Life is still going on - NCT Dream',
    audioUrl: 'https://youtu.be/8khwZ4Dql_k',
  },
  {
    id: 14,
    name: 'Flowers.wav',
    videoId: 'G7KNmW9a75Y',
    title: 'Flowers - Miley Cyrus',
    audioUrl: 'https://youtu.be/G7KNmW9a75Y',
  },
  { 
    id: 15, 
    name: 'Trampoline.wav', 
    videoId: 'he4gEgMcQYQ', 
    title: 'Trampoline - SHAED',
    audioUrl: 'https://youtu.be/he4gEgMcQYQ',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [selectedAudio, setSelectedAudio] = useState(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.start()
      setIsListening(true)
    } else {
      alert('Speech recognition is not supported in this browser.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleAudioUploadClick = () => {
    router.push('/audio')
  }

  const handleImageUploadClick = () => {
    router.push('/image')
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredAudioFiles = searchQuery
  ? audioFiles.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : audioFiles;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudioFiles.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAudioFiles.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  console.log('Filtered Audio Files:', filteredAudioFiles);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Harmony Lens Logo" width={60} height={60} />
          <h1>Harmony Lens</h1>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navButton} ${styles.active}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </button>
          <button className={styles.navButton}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            Album
          </button>
          <button className={styles.navButton}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            Music
          </button>

          <div className={styles.section}>
            <h2>Audio</h2>
            <button className={styles.navButton} onClick={handleAudioUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0z"></path><path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0z"></path><path d="M2 19v-3a6 6 0 0 1 12 0v3"></path></svg>
              Upload Audio
            </button>
            <button className={styles.navButton} onClick={handleAudioUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0z"></path><path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0z"></path><path d="M2 19v-3a6 6 0 0 1 12 0v3"></path></svg>
              Record & Upload
            </button>
            <button className={styles.navButton} onClick={handleAudioUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Show Similarity
            </button>
            <button className={styles.navButton} onClick={handleAudioUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Dataset
            </button>
          </div>

          <div className={styles.section}>
            <h2>Image</h2>
            <button className={styles.navButton} onClick={handleImageUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Upload Image
            </button>
            <button className={styles.navButton} onClick={handleImageUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Dataset
            </button>
            <button className={styles.navButton} onClick={handleImageUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Mapper
            </button>
            <button className={styles.navButton} onClick={handleImageUploadClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Show Similarity
            </button>
          </div>
        </nav>
      </aside>

      <main className={styles.main}>
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.micIcon}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
        </form>

        <div className={styles.grid}>
          {currentItems.length > 0 ? (
            currentItems.map((file) => (
              <div key={file.id} className={styles.gridItem}>
                <a
                  href={`https://www.youtube.com/watch?v=${file.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageContainer}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${file.videoId}/0.jpg`}
                    alt={file.title}
                    width={200}
                    height={200}
                    className={styles.albumArt}
                  />
                </a>
                <p className={styles.filename}>{file.title}</p>
              </div>
            ))
          ) : (
            <p>No results found. Try a different search term.</p>
          )}
        </div>

        <div className={styles.pagination}>
          <button 
            className={styles.pageButton} 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          <button 
            className={styles.pageButton} 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === pageNumbers.length}
          >
            &gt;
          </button>
        </div>
      </main>

      {selectedAudio && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedAudio(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <Image
              src={selectedAudio.image || "/placeholder.svg"}
              alt={selectedAudio.title}
              width={300}
              height={300}
              className={styles.modalImage}
            />
            <h2>{selectedAudio.title}</h2>
            <p>{selectedAudio.name}</p>
            {}
          </div>
        </div>
      )}
    </div>
  )
}

