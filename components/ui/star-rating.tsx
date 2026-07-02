import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  className?: string;
}

export default function StarRating({ rating, max = 5, size = 'sm', showValue = false, count, className }: StarRatingProps) {
  const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const iconSize = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                iconSize,
                filled || half ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}
