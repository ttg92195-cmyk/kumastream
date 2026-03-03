'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <Link href={href} className="block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
        {/* Poster Image */}
        <Image
          src={poster}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
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
          <span className="text-white font-medium text-[10px]">{rating.toFixed(1)}</span>
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
