'use client';

import { usePlayerStore } from '@/lib/store';
import { History, Cast } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { HorizontalScroll } from '@/components/HorizontalScroll';
import { MixedScroll } from '@/components/MixedScroll';
import { CommunityPlaylistCard } from '@/components/CommunityPlaylistCard';
import { HomeSkeleton } from '@/components/HomeSkeleton';

import { useHomeData } from '@/hooks/useHomeData';
import { HeroSection } from '@/components/home/HeroSection';
import { SpeedDialSection } from '@/components/home/SpeedDialSection';
import { QuickPicksSection } from '@/components/home/QuickPicksSection';
import { ArtistsSection } from '@/components/home/ArtistsSection';

export default function Home() {
  const {
    heroTracks,
    speedDialTracks,
    quickPicksTracks,
    communityPlaylists,
    artists,
    categories,
    loading,
    activeFilter,
    setActiveFilter,
    filterData,
    loadingFilter,
  } = useHomeData();

  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <main className="min-h-screen pt-12 pb-32">
      {/* Header */}
      <div className="flex flex-col px-6 mb-12">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-4xl font-serif font-bold text-[#FAF9F6] tracking-tight">Discover</h1>
          <div className="flex items-center gap-5 text-[#FAF9F6]/60">
            <Link href="/history" className="hover:text-[#FAF9F6] transition-colors">
              <History className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Cast className="w-5 h-5" strokeWidth={1.5} />
            <div className="w-8 h-8 overflow-hidden flex items-center justify-center relative border border-[#FAF9F6]/20">
              <Image src="https://f.top4top.io/p_3733w0g4e0.jpg" alt="Developer Profile" fill sizes="32px" className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#FAF9F6]/10 mt-6" />
      </div>

      {loading ? (
        <HomeSkeleton />
      ) : (
        <div className="space-y-16">
          <HeroSection heroTracks={heroTracks} playTrack={playTrack} />
          <SpeedDialSection speedDialTracks={speedDialTracks} playTrack={playTrack} />
          <QuickPicksSection quickPicksTracks={quickPicksTracks} playTrack={playTrack} />
          
          {communityPlaylists.length > 0 && (
            <div className="px-6">
              <h2 className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6">Curated Selection</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory scroll-smooth pb-4">
                {communityPlaylists.map((playlist, i) => (
                  playlist.playlistId && <CommunityPlaylistCard key={`community-playlist-${playlist.playlistId}-${i}`} playlistId={playlist.playlistId} />
                ))}
              </div>
            </div>
          )}

          <ArtistsSection artists={artists} />

          {categories.map((cat, i) => (
            cat.type === 'mixed' ? (
              <MixedScroll key={i} title={cat.title} items={cat.items} />
            ) : (
              <HorizontalScroll key={i} title={cat.title} tracks={cat.items} />
            )
          ))}
        </div>
      )}
    </main>
  );
}
