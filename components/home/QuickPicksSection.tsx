import { motion } from 'motion/react';
import Image from 'next/image';
import { Play, MoreVertical } from 'lucide-react';
import { Track } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from '@/components/MarqueeText';

interface Props {
  quickPicksTracks: Track[];
  playTrack: (track: Track, queue: Track[], context: 'similar' | 'playlist') => void;
}

export function QuickPicksSection({ quickPicksTracks, playTrack }: Props) {
  if (quickPicksTracks.length === 0) return null;

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Pilihan cepat</h2>
        <button
          className="text-sm font-medium text-white/80 hover:text-white border border-white/20 rounded-full px-4 py-1.5 transition-colors"
          onClick={() => playTrack(quickPicksTracks[0], quickPicksTracks, 'similar')}
        >
          Putar semua
        </button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
        {Array.from({ length: Math.ceil(quickPicksTracks.length / 4) }).map((_, i) => {
          const chunk = quickPicksTracks.slice(i * 4, i * 4 + 4);
          return (
            <motion.div
              key={`quickpicks-chunk-${i}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-[85vw] sm:w-[400px] shrink-0 snap-center flex flex-col gap-3"
            >
              {chunk.map((track, j) => (
                <div
                  key={`quickpicks-${track.videoId}-${j}`}
                  className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 -mx-2 rounded-xl active:scale-[0.98] transition-all duration-200"
                  onClick={() => playTrack(track, quickPicksTracks, 'similar')}
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                    <Image 
                      src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 100)} 
                      alt={track.name} 
                      fill 
                      sizes="48px" 
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <MarqueeText text={track.name} className="text-white font-medium text-base" />
                    <MarqueeText
                      text={Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}
                      className="text-white/60 text-sm"
                    />
                  </div>
                  <button className="p-2 text-white/60 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
