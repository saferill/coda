import { Play, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { motion } from 'motion/react';
import { MarqueeText } from './MarqueeText';
import { usePlayerStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface MixedScrollProps {
  title: string;
  items: any[];
}

export function MixedScroll({ title, items }: MixedScrollProps) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const router = useRouter();

  if (!items || items.length === 0) return null;

  let headerContent = <h2 className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6 px-6">{title}</h2>;

  if (title.startsWith('Serupa dengan ')) {
    const mainTitle = title.replace('Serupa dengan ', '');
    const headerImage = getHighResImage(items[0]?.thumbnails?.[0]?.url, 100);

    let artistId = '';
    for (const item of items) {
      if (item.type === 'ARTIST' && item.artistId) {
        artistId = item.artistId;
        break;
      } else if (item.artist?.artistId) {
        artistId = item.artist.artistId;
        break;
      } else if (Array.isArray(item.artist) && item.artist[0]?.artistId) {
        artistId = item.artist[0].artistId;
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
        {items.map((item, i) => {
          const type = item.type;
          const isArtist = type === 'ARTIST';
          const isPlaylist = type === 'PLAYLIST';
          const isAlbum = type === 'ALBUM';
          const isSong = type === 'SONG' || type === 'VIDEO';

          const titleText = item.name || item.title || 'Unknown';
          const subtitleText = isArtist
            ? 'Artist'
            : isPlaylist
              ? 'Playlist'
              : isAlbum
                ? 'Album'
                : Array.isArray(item.artist)
                  ? item.artist.map((a: any) => a.name).join(', ')
                  : item.artist?.name || 'Song';

          const handleClick = () => {
            if (isArtist && item.artistId) {
              router.push(`/artist/${item.artistId}`);
            } else if (isPlaylist && item.playlistId) {
              router.push(`/playlist/${item.playlistId}`);
            } else if (isAlbum && item.albumId) {
              router.push(`/album/${item.albumId}`);
            } else if (isSong && item.videoId) {
              playTrack(item, [item], 'similar');
            }
          };

          return (
            <motion.div
              key={`${item.videoId || item.playlistId || item.albumId || item.artistId}-${i}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="flex-none w-[140px] cursor-pointer group snap-center"
              onClick={handleClick}
            >
              <div className={`relative w-full aspect-square overflow-hidden mb-4 shadow-lg transition-transform duration-[1s] ease-out group-hover:scale-105 ${isArtist ? 'rounded-full' : 'rounded-sm'}`}>
                <Image
                  src={getHighResImage(item.thumbnails?.[item.thumbnails.length - 1]?.url, 400)}
                  alt={titleText}
                  fill
                  sizes="140px"
                  className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="w-full">
                <MarqueeText text={titleText} className="text-[#FAF9F6] text-sm font-serif font-medium mb-1" />
                <MarqueeText text={subtitleText} className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
