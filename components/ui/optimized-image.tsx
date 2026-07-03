import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Optimized image component using next/image with lazy loading,
 * responsive sizes, and modern format delivery.
 * Falls back to a placeholder for missing images.
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  className = '',
  wrapperClassName = '',
}: OptimizedImageProps) {
  const imageSrc = src || '/placeholder.jpg';

  // For Cloudinary URLs, append auto-optimization params
  const optimizedSrc = imageSrc.includes('cloudinary.com')
    ? imageSrc.replace('/upload/', '/upload/f_auto,q_auto/')
    : imageSrc;

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${wrapperClassName}`}>
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          priority={priority}
          className={`object-cover ${className}`}
        />
      </div>
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width || 400}
      height={height || 400}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      priority={priority}
      className={className}
    />
  );
}
