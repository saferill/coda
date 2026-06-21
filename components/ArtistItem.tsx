'use client';

import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { MarqueeText } from './MarqueeText';

export function ArtistItem({ artist }: { artist: any }) {
  const router = useRouter();
  const thumbnail = getHighResImage(artist.thumbnails?.[artist.thumbnails.length - 1]?.url, 200);

  return (
    <div
      className="flex items-center p-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer group transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0"
      onClick={() => router.push(`/artist/${artist.artistId}`)}
    >
      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#FAF9F6]/5 shadow-lg">
        {thumbnail && <Image src={thumbnail} alt={artist.name} fill sizes="64px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />}
      </div>
      <div className="ml-5 flex-1 min-w-0 pb-1">
        <MarqueeText text={artist.name} className="font-serif font-bold text-[18px] text-[#FAF9F6] mb-0.5" />
        <MarqueeText text="Artist" className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" />
      </div>
    </div>
  );
}
