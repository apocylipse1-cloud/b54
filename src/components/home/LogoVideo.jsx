import React, { useRef, useEffect, useState } from 'react'

const LogoVideo = () => {
  const videoRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      video.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }

    const handleError = () => {
      console.warn('Logo video failed to load')
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <section className="w-full bg-black relative overflow-hidden">
      <div className="w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          poster="/logo.png"
          style={{
            display: 'block',
            transform: 'translate3d(0, 0, 0)',
            willChange: isLoaded ? 'auto' : 'opacity',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          webkit-playsinline="true"
        >
          <source src="/logovideo.webm" type="video/webm" />
          <source src="/logovideo.mp4" type="video/mp4" />
          <source src="/logovideo.ogv" type="video/ogg" />
        </video>
      </div>
    </section>
  )
}

export default LogoVideo
