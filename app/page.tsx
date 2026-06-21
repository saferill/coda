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
import { FilterPills } from '@/components/home/FilterPills';

const PILLS = [
  'Chill', 'Focus', 'Commute', 'Gaming', 'Energize', 'Party', 
  'Feel good', 'Romance', 'Workout', 'Sleep', 'Sad', 'Happy', 
  'Nostalgia', 'Acoustic', 'Pop', 'Rock'
];

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
    <main className="min-h-screen pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Beranda</h1>
        <div className="flex items-center gap-4 text-white/80">
          <Link href="/history" className="hover:text-white transition-colors">
            <History className="w-6 h-6" />
          </Link>
          <Cast className="w-6 h-6" />
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center relative border border-white/10">
            <Image src="https://f.top4top.io/p_3733w0g4e0.jpg" alt="Developer Profile" fill sizes="32px" className="object-cover" />
          </div>
        </div>
      </div>

      <FilterPills 
        pills={PILLS} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />

      {loading || (activeFilter && loadingFilter) ? (
        <HomeSkeleton />
      ) : activeFilter ? (
        <div className="space-y-10">
          {filterData.map((cat, i) => (
            <HorizontalScroll key={i} title={cat.title} tracks={cat.tracks} />
          ))}

          <div className="px-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Suasana Hati dan Genre</h2>
            <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
              {PILLS.map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveFilter(p)}
                  className="bg-[#1C1C1E] hover:bg-white/10 text-white font-medium py-3 px-4 rounded-lg text-left transition-colors border border-white/5 min-w-[160px] snap-center"
                >
                  <span className="text-sm">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <HeroSection heroTracks={heroTracks} playTrack={playTrack} />
          <SpeedDialSection speedDialTracks={speedDialTracks} playTrack={playTrack} />
          <QuickPicksSection quickPicksTracks={quickPicksTracks} playTrack={playTrack} />
          
          {communityPlaylists.length > 0 && (
            <div className="px-4">
              <h2 className="text-2xl font-bold text-[#81B29A] mb-4">From the community</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
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
