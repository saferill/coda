'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { usePlayerStore, Track } from '@/lib/store';
import { Play, ArrowLeft, MoreHorizontal, Radio, Music, Trash2, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import Image from 'next/image';
import { TrackItem } from '@/components/TrackItem';
import { PlaylistSkeleton } from '@/components/PlaylistSkeleton';
import { MarqueeText } from '@/components/MarqueeText';
import { ConfirmModal } from '@/components/FeedbackModals';

interface Playlist {
  id: string;
  name: string;
  img: string;
  tracks: Track[];
}

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [deletePlaylistTarget, setDeletePlaylistTarget] = useState(false);
  const [removeSongTarget, setRemoveSongTarget] = useState<Track | null>(null);
  const [savePlaylistTarget, setSavePlaylistTarget] = useState(false);
  const playTrack = usePlayerStore((state) => state.playTrack);

  useEffect(() => {
    const loadPlaylist = async () => {
      if (!params.id) return;
      try {
        const id = String(params.id);
        const data = await db.getPlaylist(id);
        if (data) {
          setPlaylist(data as Playlist);
          setIsSaved(true);
        } else {
          // Try fetching from YouTube Music API
          const res = await fetch(`/api/ytplaylist?id=${encodeURIComponent(id)}`);
          if (res.ok) {
            const ytData = await res.json();
            setPlaylist({
              id: ytData.playlistId || ytData.id || id,
              name: ytData.name || ytData.title || 'Playlist',
              img: ytData.thumbnails?.[ytData.thumbnails.length - 1]?.url || '',
              tracks: ytData.videos || ytData.songs || []
            });
            setIsSaved(false);
          }
        }
      } catch (error) {
        console.error('Failed to load playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();

    const handlePlaylistsUpdated = () => {
      loadPlaylist();
    };

    window.addEventListener('playlistsUpdated', handlePlaylistsUpdated);
    
    return () => {
      window.removeEventListener('playlistsUpdated', handlePlaylistsUpdated);
    };
  }, [params.id]);

  if (loading) {
    return <PlaylistSkeleton />;
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-4">Playlist tidak ditemukan</p>
        <button onClick={() => router.back()} className="text-[#FA243C]">Kembali</button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks, 'playlist');
    }
  };

  const handleRadio = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], [], 'similar');
    }
  };

  const handleDeletePlaylist = async () => {
    setDeletePlaylistTarget(true);
  };

  const confirmDeletePlaylist = async () => {
    if (playlist) {
      await db.deletePlaylist(playlist.id);
      router.back();
    }
  };

  const handleRemoveSong = async (trackToRemove: Track) => {
    setRemoveSongTarget(trackToRemove);
  };

  const confirmRemoveSong = async () => {
    if (playlist && removeSongTarget) {
        const updatedTracks = playlist.tracks.filter(t => t.videoId !== removeSongTarget.videoId);
        const updatedPlaylist = { ...playlist, tracks: updatedTracks };
        await db.addPlaylist(updatedPlaylist);
        setPlaylist(updatedPlaylist);
        setRemoveSongTarget(null);
    }
  };

  const handleSavePlaylist = async () => {
    if (isSaved) {
      setSavePlaylistTarget(true);
    } else {
      if (playlist) {
        await db.addPlaylist(playlist);
        setIsSaved(true);
      }
    }
  };

  const confirmSavePlaylist = async () => {
      if (playlist) {
        await db.deletePlaylist(playlist.id);
        setIsSaved(false);
      }
      setSavePlaylistTarget(false);
  };

  const isSelfCreated = /^\d+$/.test(playlist.id);

  return (
    <main className="min-h-screen pb-24">
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#FAF9F6]/5 to-[#121110] z-0 pointer-events-none" />
      
      <div className="sticky top-0 z-20 bg-[#121110]/80 backdrop-blur-xl border-b border-[#FAF9F6]/5 px-6 py-4 flex items-center gap-4 transition-all">
        <button onClick={() => router.back()} className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <span className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Playlist</span>
      </div>

      <div className="px-6 pt-8 pb-12 flex flex-col items-center text-center relative z-10 border-b border-[#FAF9F6]/5">
        <div className="w-64 h-64 sm:w-80 sm:h-80 overflow-hidden shadow-2xl mb-8 relative bg-[#121110] flex items-center justify-center border border-[#FAF9F6]/10">
          {playlist.img ? (
            <Image src={playlist.img} alt={playlist.name} fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover grayscale-[20%]" />
          ) : (
            <Music className="w-20 h-20 text-[#FAF9F6]/20" strokeWidth={1} />
          )}
        </div>
        <div className="w-full max-w-2xl mb-4">
          <MarqueeText text={playlist.name} className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF9F6] text-center tracking-tight leading-tight" />
        </div>
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/40 mb-10">{playlist.tracks.length} TRACKS</p>

        <div className="flex items-center gap-6 w-full justify-center">
          <button 
            onClick={handlePlayAll}
            disabled={playlist.tracks.length === 0}
            className="w-12 h-12 border border-[#FAF9F6] rounded-full flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#121110] text-[#FAF9F6] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#FAF9F6]"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
          </button>
          <button 
            onClick={handleRadio}
            disabled={playlist.tracks.length === 0}
            className="w-12 h-12 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300 disabled:opacity-30"
          >
            <Radio className="w-4 h-4" strokeWidth={1} />
          </button>
          {!isSelfCreated && (
            <button 
              onClick={handleSavePlaylist}
              className="w-12 h-12 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300"
              title={isSaved ? "Remove from Library" : "Save to Library"}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1.5} /> : <BookmarkPlus className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          )}
          {isSelfCreated && isSaved && (
            <button 
              onClick={handleDeletePlaylist}
              className="w-12 h-12 border border-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/10 hover:border-red-500 text-red-500/70 hover:text-red-500 transition-all duration-300"
              title="Delete Playlist"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1} />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 max-w-4xl mx-auto pt-6 relative z-10">
        {playlist.tracks.length === 0 ? (
          <div className="text-center text-[#FAF9F6]/40 font-serif italic py-16">
            No tracks in this playlist yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {playlist.tracks.map((track, index) => (
              <div key={`${track.videoId}-${index}`} className="flex items-center group relative">
                <span className="w-8 text-[9px] font-sans tracking-widest text-[#FAF9F6]/30 hidden sm:block shrink-0 pt-1 group-hover:text-[#FAF9F6] transition-colors">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <TrackItem 
                    track={track} 
                    queue={playlist.tracks} 
                    onRemove={isSelfCreated ? handleRemoveSong : undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deletePlaylistTarget}
        title="Hapus Playlist"
        message="Apakah Anda yakin ingin menghapus playlist ini?"
        onConfirm={confirmDeletePlaylist}
        onCancel={() => setDeletePlaylistTarget(false)}
      />

      <ConfirmModal
        isOpen={!!removeSongTarget}
        title="Hapus Lagu"
        message="Hapus lagu ini dari playlist?"
        onConfirm={confirmRemoveSong}
        onCancel={() => setRemoveSongTarget(null)}
      />

      <ConfirmModal
        isOpen={savePlaylistTarget}
        title="Hapus dari Koleksi"
        message="Apakah Anda yakin ingin menghapus playlist ini dari koleksi?"
        onConfirm={confirmSavePlaylist}
        onCancel={() => setSavePlaylistTarget(false)}
      />
    </main>
  );
}
