import React, { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

const ScrollVideoTransition = () => {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  gsap.registerPlugin(ScrollTrigger)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.volume = 0
    video.playsInline = true
    video.preload = 'metadata'

    video.style.transform = 'translateZ(0)'
    video.style.backfaceVisibility = 'hidden'
    video.style.willChange = 'transform'

    const handleLoadedData = () => {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video autoplay successful')
          })
          .catch(error => {
            console.warn('Video autoplay failed:', error)
          })
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  useGSAP(() => {
    const container = containerRef.current
    const video = videoRef.current
    const videoWrapper = container?.querySelector('.video-wrapper')

    if (!container || !video || !videoWrapper) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        onEnter: () => {
          if (video.paused) video.play().catch(e => console.warn('Play failed:', e))
        },
        onLeave: () => {
          video.pause()
        },
        onEnterBack: () => {
          if (video.paused) video.play().catch(e => console.warn('Play failed:', e))
        },
        onLeaveBack: () => {
          video.pause()
        }
      }
    })

    tl.fromTo(container,
      {
        x: '120%',
        opacity: 0
      },
      {
        x: '0%',
        opacity: 1,
        duration: 0.35,
        ease: 'power4.out'
      }
    )
    .fromTo(videoWrapper,
      {
        scale: 0.85,
        rotateY: 12,
        filter: 'blur(10px)'
      },
      {
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        duration: 0.35,
        ease: 'power4.out'
      },
      '<'
    )

    .to([container, videoWrapper], {
      x: '0%',
      scale: 1,
      rotateY: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.3
    })

    .to(videoWrapper,
      {
        scale: 0.85,
        rotateY: -12,
        filter: 'blur(10px)',
        duration: 0.35,
        ease: 'power4.in'
      }
    )
    .to(container,
      {
        x: '-120%',
        opacity: 0,
        duration: 0.35,
        ease: 'power4.in'
      },
      '<'
    )

  }, [])

  return (
    <div
      ref={containerRef}
      className='h-[60vh] sm:h-[70vh] w-full flex items-center justify-center overflow-visible relative py-12 sm:py-16 lg:py-20'
      style={{
        willChange: 'transform, opacity',
        perspective: '1200px'
      }}
    >
      <div
        className='video-wrapper w-[90%] sm:w-[85%] lg:w-[75%] max-w-6xl h-full flex items-center justify-center bg-black rounded-lg overflow-hidden shadow-2xl'
        style={{
          willChange: 'transform, filter',
          transformStyle: 'preserve-3d'
        }}
      >
        <video
          ref={videoRef}
          className='w-full h-full object-cover'
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster="/video-fallback.jpg"
          webkit-playsinline="true"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{
            objectFit: 'cover',
            imageRendering: 'high-quality',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <source src="/gemini.webm" type="video/webm" />
          <source src="/gemini.mp4" type="video/mp4" />
          <source src="/gemini.ogv" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default ScrollVideoTransition
