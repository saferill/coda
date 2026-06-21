'use client';

import { Track, usePlayerStore } from '@/lib/store';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MarqueeText } from './MarqueeText';
import { useRouter } from 'next/navigation';

export function HorizontalScroll({ title, tracks }: { title: string; tracks: Track[] }) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const router = useRouter();

  let headerContent = <h2 className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6 px-6">{title}</h2>;

  if (title.startsWith('Serupa dengan ')) {
    const mainTitle = title.replace('Serupa dengan ', '');
    const headerImage = getHighResImage(tracks[0]?.thumbnails?.[0]?.url, 100);

    let artistId = '';
    for (const track of tracks) {
      if (track.artist && !Array.isArray(track.artist) && track.artist.artistId) {
        artistId = track.artist.artistId;
        break;
      } else if (Array.isArray(track.artist) && track.artist[0]?.artistId) {
        artistId = track.artist[0].artistId;
        break;
      }
    }

    const handleHeaderClick = () => {
      if (artistId) {
        router.push(`/artist/${artistId}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(mainTitle)}`);
      }
    };

    headerContent = (
      <div
        className="flex items-center justify-between mb-8 px-6 cursor-pointer group"
        onClick={handleHeaderClick}
      >
        <div className="flex items-center gap-6">
          {headerImage && (
            <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
              <Image src={headerImage} alt={mainTitle} fill className="object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-center gap-1">
            <span className="text-[9px] text-[#FAF9F6]/40 font-sans tracking-widest uppercase">Similar to</span>
            <h2 className="text-2xl font-serif font-bold text-[#FAF9F6] leading-tight">{mainTitle}</h2>
          </div>
        </div>
        <button className="p-3 border border-[#FAF9F6]/10 rounded-full text-[#FAF9F6]/40 group-hover:text-[#FAF9F6] group-hover:border-[#FAF9F6]/40 transition-all duration-300">
          <ArrowRight className="w-4 h-4" strokeWidth={1} />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-16">
      {headerContent}
      <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 pb-4 snap-x snap-mandatory scroll-smooth">
        {tracks.map((track, i) => {
          const thumbnail = getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 400);
          const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist';

          return (
            <motion.div
              key={`${track.videoId}-${i}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="flex-none w-[140px] cursor-pointer group snap-center"
              onClick={() => playTrack(track, tracks)}
            >
              <div className="relative w-full aspect-square rounded-sm overflow-hidden mb-4 shadow-lg">
                <Image src={thumbnail} alt={track.name} fill sizes="140px" className="object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out" />
              </div>
              <MarqueeText text={track.name} className="text-[#FAF9F6] text-sm font-serif font-medium mb-1" />
              <MarqueeText text={artistName} className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
