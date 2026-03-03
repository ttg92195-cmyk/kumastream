'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder image for missing/broken posters
const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

interface MovieCardProps {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k?: boolean;
  type: 'movie' | 'series';
}

export function MovieCard({
  id,
  title,
  year,
  rating,
  poster,
  quality4k = false,
  type = 'movie',
}: MovieCardProps) {
  const href = type === 'movie' ? `/movie/${id}` : `/series/${id}`;
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(poster || PLACEHOLDER);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(PLACEHOLDER);
    }
  };

  return (
    <Link href={href} className="block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
        {/* Poster Image */}
        <Image
          src={imgSrc}
          alt={title || 'Movie poster'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
          onError={handleImageError}
          unoptimized
        />

        {/* 4K Badge - Top Left */}
        {quality4k && (
          <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            4K
          </div>
        )}

        {/* Rating Badge - Top Right */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded text-xs">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-white font-medium text-[10px]">{rating != null ? Number(rating).toFixed(1) : '0.0'}</span>
        </div>
      </div>

      {/* Title & Year - Below Poster */}
      <div className="mt-1.5 px-0.5">
        <h3 className="text-white text-xs font-medium line-clamp-1 leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-[10px] mt-0.5">{year}</p>
      </div>
    </Link>
  );
}
