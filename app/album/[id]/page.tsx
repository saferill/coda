import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getHighResImage } from '@/lib/utils';
import { notFound } from 'next/navigation';
import YTMusic from 'ytmusic-api';
import AlbumClient from './AlbumClient';
import AlbumTrackClient from './AlbumTrackClient';
import { MarqueeText } from '@/components/MarqueeText';

async function getAlbumDetails(id: string) {
  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();
    const album = await ytmusic.getAlbum(id);
    return album;
  } catch (error: any) {
    if (error?.isAxiosError && error?.response?.status === 400) {
      // Suppress 400 errors as they just mean the ID is invalid
      return null;
    }
    console.error('Error fetching album:', error?.message || error);
    return null;
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const album = await getAlbumDetails(resolvedParams.id);

  if (!album) {
    notFound();
  }

  const coverImage = album.thumbnails?.[album.thumbnails.length - 1]?.url || 'https://picsum.photos/seed/album/800/800';
  const totalDuration = album.songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen pb-24">
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#FAF9F6]/5 to-[#121110] z-0 pointer-events-none" />

      <div className="sticky top-0 z-20 bg-[#121110]/80 backdrop-blur-xl border-b border-[#FAF9F6]/5 px-6 py-4 flex items-center gap-4 transition-all">
        <Link href="/" className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </Link>
        <span className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Album</span>
      </div>

      <div className="px-6 pt-8 pb-12 flex flex-col items-center text-center relative z-10 border-b border-[#FAF9F6]/5">
        <div className="w-64 h-64 sm:w-80 sm:h-80 overflow-hidden shadow-2xl mb-8 relative bg-[#121110] flex items-center justify-center border border-[#FAF9F6]/10">
          <Image src={getHighResImage(coverImage, 800)} alt={album.name} fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover grayscale-[20%]" />
        </div>
        <div className="w-full max-w-2xl mb-4">
          <MarqueeText text={album.name} className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF9F6] text-center tracking-tight leading-tight" />
        </div>
        <Link href={`/artist/${album.artist.artistId}`} className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/80 hover:text-[#FAF9F6] transition-colors mb-2 block border-b border-transparent hover:border-[#FAF9F6]/40 pb-1">
          {album.artist.name}
        </Link>
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/40 mb-10">
          {album.year} • {album.songs.length} TRACKS • {formatDuration(totalDuration)}
        </p>
        
        <AlbumClient album={album} />
      </div>

      <div className="px-6 max-w-4xl mx-auto pt-6 relative z-10">
        <div className="flex flex-col">
          {album.songs.map((track, index) => {
            const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || album.artist.name;
            
            return (
              <AlbumTrackItem 
                key={`${track.videoId}-${index}`} 
                track={track} 
                index={index} 
                album={album} 
                artistName={artistName} 
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

function AlbumTrackItem({ track, index, album, artistName }: { track: any, index: number, album: any, artistName: string }) {
  return (
    <AlbumTrackClient track={track} index={index} album={album} artistName={artistName} />
  );
}
