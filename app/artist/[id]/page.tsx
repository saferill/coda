'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Share2, Play, Radio, MoreVertical } from 'lucide-react';
import { getHighResImage } from '@/lib/utils';
import { TrackItem } from '@/components/TrackItem';
import { usePlayerStore } from '@/lib/store';
import { db } from '@/lib/db';
import { MarqueeText } from '@/components/MarqueeText';

import { ArtistSkeleton } from '@/components/ArtistSkeleton';

export default function ArtistPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const playTrack = usePlayerStore((state) => state.playTrack);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/artist?id=${params.id}`);
        const data = await res.json();
        setArtist(data);
        
        if (data && data.artistId) {
          const subscribed = await db.isSubscribed(data.artistId);
          setIsSubscribed(subscribed);
        }
      } catch (error) {
        console.error('Failed to fetch artist:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchArtist();
    }
  }, [params.id]);

  const handleSubscribe = async () => {
    if (!artist) return;
    
    if (isSubscribed) {
      await db.removeSubscribedArtist(artist.artistId);
      setIsSubscribed(false);
    } else {
      await db.addSubscribedArtist({
        artistId: artist.artistId,
        name: artist.name,
        thumbnails: artist.thumbnails || [],
        subscribedAt: Date.now()
      });
      setIsSubscribed(true);
    }
  };

  if (loading) {
    return <ArtistSkeleton />;
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p>Artist not found</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-white/10 rounded-full">
          Go Back
        </button>
      </div>
    );
  }

  const headerImage = getHighResImage(artist.thumbnails?.[artist.thumbnails.length - 1]?.url, 1000);

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image 
          src={headerImage || '/placeholder.png'} 
          alt={artist.name} 
          fill 
          className="object-cover grayscale-[20%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button onClick={() => router.back()} className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <span className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Artist</span>
          <button className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 p-6 w-full pb-10">
          <h1 className="text-6xl sm:text-8xl font-serif font-bold text-[#FAF9F6] mb-6 tracking-tight leading-none">{artist.name}</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSubscribe}
              className={`px-8 py-2 rounded-full border text-xs tracking-widest uppercase transition-all duration-300 ${
                isSubscribed 
                  ? 'bg-[#FAF9F6] text-[#121110] border-[#FAF9F6] hover:bg-transparent hover:text-[#FAF9F6]' 
                  : 'border-[#FAF9F6]/30 text-[#FAF9F6] hover:border-[#FAF9F6]'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
            <button className="px-8 py-2 rounded-full border border-[#FAF9F6]/30 text-[#FAF9F6] text-xs tracking-widest uppercase flex items-center gap-2 hover:border-[#FAF9F6] transition-all duration-300">
              <Radio className="w-3 h-3" strokeWidth={2} />
              Radio
            </button>
            <button 
              className="w-12 h-12 rounded-full border border-[#FAF9F6] text-[#FAF9F6] flex items-center justify-center ml-auto hover:bg-[#FAF9F6] hover:text-[#121110] transition-all duration-300"
              onClick={() => {
                if (artist.topSongs?.length > 0) {
                  playTrack(artist.topSongs[0], artist.topSongs);
                }
              }}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-16">
        {/* Tentang */}
        <section className="border-b border-[#FAF9F6]/10 pb-8">
          <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6">About</h2>
          <div className="text-[#FAF9F6]/80 text-sm font-serif leading-relaxed">
            <p className={isBioExpanded ? "" : "line-clamp-4"}>
              Listen to the finest works from {artist.name} on this platform. Explore popular tracks, latest albums, singles, and music videos. {artist.name} has made significant contributions to the music industry and continues to entertain fans with extraordinary creations.
            </p>
            <button 
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-[#FAF9F6] mt-4 text-[9px] font-sans tracking-widest uppercase border-b border-[#FAF9F6]/30 hover:border-[#FAF9F6] transition-colors pb-1"
            >
              {isBioExpanded ? "Show Less" : "Read More"}
            </button>
          </div>
        </section>

        {/* Top Songs */}
        {artist.topSongs && artist.topSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Top Tracks</h2>
            </div>
            <div className="flex flex-col">
              {artist.topSongs.slice(0, 5).map((song: any, index: number) => (
                <div key={`song-${song.videoId}-${index}`} className="w-full flex items-center group">
                   <span className="w-8 text-[9px] font-sans tracking-widest text-[#FAF9F6]/30 hidden sm:block shrink-0 pt-1 group-hover:text-[#FAF9F6] transition-colors">{index + 1}</span>
                   <div className="flex-1 min-w-0">
                     <TrackItem track={song} queue={artist.topSongs} />
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Albums */}
        {artist.topAlbums && artist.topAlbums.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Albums</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-4">
              {artist.topAlbums.map((album: any, index: number) => (
                <div 
                  key={`album-${album.albumId}-${index}`} 
                  className="w-48 shrink-0 snap-start group cursor-pointer"
                  onClick={() => router.push(`/album/${album.albumId}`)}
                >
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 border border-[#FAF9F6]/10">
                    <Image 
                      src={getHighResImage(album.thumbnails?.[album.thumbnails.length - 1]?.url, 400) || '/placeholder.png'} 
                      alt={album.name} 
                      fill 
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                  <MarqueeText text={album.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1" />
                  <MarqueeText text={album.year} className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Singles */}
        {artist.topSingles && artist.topSingles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Singles & EPs</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-4">
              {artist.topSingles.map((single: any, index: number) => (
                <div 
                  key={`single-${single.albumId}-${index}`} 
                  className="w-48 shrink-0 snap-start group cursor-pointer"
                  onClick={() => router.push(`/album/${single.albumId}`)}
                >
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 border border-[#FAF9F6]/10">
                    <Image 
                      src={getHighResImage(single.thumbnails?.[single.thumbnails.length - 1]?.url, 400) || '/placeholder.png'} 
                      alt={single.name} 
                      fill 
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                  <MarqueeText text={single.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1" />
                  <MarqueeText text={single.year} className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {artist.topVideos && artist.topVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Videos</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-4">
              {artist.topVideos.map((video: any, index: number) => (
                <div 
                  key={`video-${video.videoId}-${index}`} 
                  className="w-72 shrink-0 snap-start group cursor-pointer"
                  onClick={() => playTrack(video, artist.topVideos)}
                >
                  <div className="relative aspect-video rounded-sm overflow-hidden mb-4 border border-[#FAF9F6]/10">
                    <Image 
                      src={getHighResImage(video.thumbnails?.[video.thumbnails.length - 1]?.url, 400) || '/placeholder.png'} 
                      alt={video.name} 
                      fill 
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                  <MarqueeText text={video.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1" />
                  <MarqueeText text={artist.name} className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Performances */}
        {artist.livePerformances && artist.livePerformances.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Live performances</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-4">
              {artist.livePerformances.map((video: any, index: number) => (
                <div 
                  key={`live-${video.videoId}-${index}`} 
                  className="w-72 shrink-0 snap-start group cursor-pointer"
                  onClick={() => playTrack(video, artist.livePerformances)}
                >
                  <div className="relative aspect-video rounded-sm overflow-hidden mb-4 border border-[#FAF9F6]/10">
                    <Image 
                      src={getHighResImage(video.thumbnails?.[video.thumbnails.length - 1]?.url, 400) || '/placeholder.png'} 
                      alt={video.name} 
                      fill 
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                  <MarqueeText text={video.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1" />
                  <MarqueeText text={artist.name} className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured On */}
        {artist.featuredOn && artist.featuredOn.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Featured On</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory pb-4">
              {artist.featuredOn.map((playlist: any, index: number) => (
                <div 
                  key={`playlist-${playlist.playlistId}-${index}`} 
                  className="w-48 shrink-0 snap-start group cursor-pointer"
                  onClick={() => router.push(`/playlist/${playlist.playlistId}`)}
                >
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 border border-[#FAF9F6]/10">
                    <Image 
                      src={getHighResImage(playlist.thumbnails?.[playlist.thumbnails.length - 1]?.url, 400) || '/placeholder.png'} 
                      alt={playlist.name} 
                      fill 
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                  <MarqueeText text={playlist.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1" />
                  <MarqueeText text="Playlist" className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fans might also like */}
        {artist.similarArtists && artist.similarArtists.filter((a: any) => a.artistId?.startsWith('UC') || a.artistId?.startsWith('HC')).length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
              <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Fans might also like</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-8 snap-x snap-mandatory pb-4">
              {artist.similarArtists.filter((a: any) => a.artistId?.startsWith('UC') || a.artistId?.startsWith('HC')).map((similar: any, index: number) => (
                <div 
                  key={`similar-${similar.artistId}-${index}`} 
                  className="w-36 shrink-0 snap-start group cursor-pointer flex flex-col items-center text-center"
                  onClick={() => router.push(`/artist/${similar.artistId}`)}
                >
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-4 border border-[#FAF9F6]/10 shadow-lg">
                    {similar.thumbnails?.[similar.thumbnails.length - 1]?.url && (
                      <Image 
                        src={getHighResImage(similar.thumbnails[similar.thumbnails.length - 1].url, 400)} 
                        alt={similar.name} 
                        fill 
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                  <MarqueeText text={similar.name} className="text-[#FAF9F6] font-serif text-[15px]" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
