'use client';

import Image from 'next/image';

interface CastCardProps {
  name: string;
  role?: string;
  photo?: string;
}

export function CastCard({ name, role, photo }: CastCardProps) {
  return (
    <div className="flex-shrink-0 w-20 text-center">
      {/* Photo */}
      <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-700 mb-2">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-white text-xs font-medium line-clamp-2">{name}</p>
      {role && (
        <p className="text-gray-500 text-[10px] mt-0.5">{role}</p>
      )}
    </div>
  );
}
