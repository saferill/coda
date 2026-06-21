import { motion } from 'motion/react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Track } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from '@/components/MarqueeText';

interface Props {
  heroTracks: Track[];
  playTrack: (track: Track, queue: Track[], context: 'similar' | 'playlist') => void;
}

export function HeroSection({ heroTracks, playTrack }: Props) {
  if (heroTracks.length === 0) return null;

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 pb-8 snap-x snap-mandatory scroll-smooth">
      {heroTracks.map((track, i) => (
        <motion.div
          key={`hero-${track.videoId}-${i}`}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[85vw] md:w-[600px] h-[60vh] min-h-[400px] max-h-[650px] shrink-0 snap-center rounded-sm overflow-hidden cursor-pointer group shadow-2xl"
          onClick={() => playTrack(track, heroTracks, 'similar')}
        >
          <Image
            src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 800)}
            alt={track.name}
            fill
            sizes="(max-width: 640px) 100vw, 800px"
            className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
            <div className="overflow-hidden mb-2">
              <MarqueeText text={track.name} className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF9F6] tracking-tight leading-none" />
            </div>
            
            <div className="flex items-center justify-between mt-4 border-t border-[#FAF9F6]/20 pt-4">
              <span className="text-[10px] sm:text-xs font-sans tracking-widest uppercase text-[#FAF9F6]/70">
                {Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}
              </span>
              
              <div className="flex items-center gap-2 text-[#FAF9F6] group-hover:text-[#FAF9F6]/70 transition-colors">
                <span className="text-[10px] tracking-widest uppercase font-medium">Play</span>
                <div className="w-8 h-8 rounded-full border border-[#FAF9F6]/30 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
