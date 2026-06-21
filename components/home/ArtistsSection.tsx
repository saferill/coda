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
    <div className="mb-16">
      <h2 className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6 px-6">Keep Listening</h2>
      <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 pb-4 snap-x snap-mandatory scroll-smooth">
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
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg transition-transform duration-500 group-hover:scale-105 mb-4 border border-[#FAF9F6]/10">
                  <Image 
                    src={getHighResImage(artist.thumbnails?.[artist.thumbnails.length - 1]?.url, 400)} 
                    alt={artistName} 
                    fill 
                    sizes="128px" 
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-[#121110]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-[#FAF9F6] fill-current" strokeWidth={1} />
                  </div>
                </div>
                <div className="text-center w-full flex flex-col items-center">
                  <MarqueeText text={artistName} className="text-[15px] font-serif font-bold text-[#FAF9F6] mb-1" />
                  <div className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40">Artist</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
