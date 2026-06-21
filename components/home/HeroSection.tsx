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
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 snap-x snap-mandatory scroll-smooth pb-4">
      {heroTracks.map((track, i) => (
        <motion.div
          key={`hero-${track.videoId}-${i}`}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-[85vw] sm:w-[400px] shrink-0 aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden cursor-pointer group shadow-2xl snap-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          onClick={() => playTrack(track, heroTracks, 'similar')}
        >
          <Image
            src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 800)}
            alt={track.name}
            fill
            sizes="(max-width: 640px) 85vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 right-4">
            <MarqueeText text={track.name} className="text-2xl font-bold text-white drop-shadow-lg" />
            <MarqueeText
              text={Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}
              className="text-white/80 font-medium drop-shadow-md"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <MarqueeText text={`Sounds like • ${Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}`} className="text-sm text-white/60 pr-4" />
            <div className="w-12 h-12 bg-[#FA243C] rounded-full flex items-center justify-center shadow-lg shadow-[#FA243C]/30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <Play className="w-6 h-6 text-white ml-1 fill-current" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
