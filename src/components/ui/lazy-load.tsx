import React, { useState, useRef, useEffect } from 'react'

interface LazyLoadProps {
  children: React.ReactNode
  height?: number
  offset?: number
  placeholder?: React.ReactNode
  onLoad?: () => void
  className?: string
}

export function LazyLoad({ 
  children, 
  height = 200, 
  offset = 100, 
  placeholder,
  onLoad,
  className = ''
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          if (onLoad) {
            onLoad()
          }
        }
      },
      {
        rootMargin: `${offset}px`,
        threshold: 0.1,
      }
    )

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [offset, hasLoaded, onLoad])

  const defaultPlaceholder = (
    <div 
      className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse"
      style={{ height: `${height}px` }}
    >
      <div className="text-gray-400 dark:text-gray-600">Loading...</div>
    </div>
  )

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (placeholder || defaultPlaceholder)}
    </div>
  )
}

// Component-specific lazy loaders
interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
    setIsLoaded(true)
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
        >
          {placeholder ? (
            <img src={placeholder} alt="placeholder" className="opacity-50" />
          ) : (
            <div className="text-gray-400 text-sm">Loading...</div>
          )}
        </div>
      )}
      
      {isVisible && (
        <img
          src={error ? '/images/error-placeholder.png' : src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}

// Lazy code component
export function LazyCodeBlock({ 
  code, 
  maxHeight = 400 
}: { 
  code: string
  maxHeight?: number 
}) {
  return (
    <LazyLoad
      height={Math.min(code.split('\n').length * 20, maxHeight)}
      placeholder={
        <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      }
    >
      <pre className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-auto">
        <code>{code}</code>
      </pre>
    </LazyLoad>
  )
}

// Lazy list component for large datasets
interface LazyListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  loadMoreThreshold?: number
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

export function LazyList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  loadMoreThreshold = 5,
  onLoadMore,
  hasMore = false,
  loading = false
}: LazyListProps<T>) {
  const [startIndex, setStartIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
  const endIndex = Math.min(startIndex + visibleCount, items.length)
  const visibleItems = items.slice(startIndex, endIndex)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const newStartIndex = Math.floor(scrollTop / itemHeight)
      setStartIndex(Math.max(0, newStartIndex))

      // Load more when near the end
      if (
        hasMore && 
        onLoadMore && 
        !loading &&
        newStartIndex + visibleCount >= items.length - loadMoreThreshold
      ) {
        onLoadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [itemHeight, visibleCount, items.length, hasMore, onLoadMore, loading, loadMoreThreshold])

  return (
    <div 
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
