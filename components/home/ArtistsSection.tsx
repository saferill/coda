import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from '@/components/MarqueeText';

interface Props {
  artists: any[];
}

export function ArtistsSection({ artists }: Props) {
  if (artists.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 px-4">Tetap mendengarkan</h2>
      <div className="flex overflow-x-auto no-scrollbar gap-6 px-4 pb-4 snap-x snap-mandatory scroll-smooth">
        {artists.map((artist, i) => {
          const artistName = artist.name || 'Artist';
          return (
            <Link href={`/artist/${artist.artistId}`} key={`artist-${artist.artistId}-${i}`}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 snap-center hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg transition-transform duration-300">
                  <Image 
                    src={getHighResImage(artist.thumbnails?.[artist.thumbnails.length - 1]?.url, 400)} 
                    alt={artistName} 
                    fill 
                    sizes="144px" 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
                <div className="text-center w-full">
                  <MarqueeText text={artistName} className="text-sm font-medium text-white" />
                  <div className="text-xs text-white/50">Artis</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
