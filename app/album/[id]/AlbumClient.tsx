'use client';

import { Play, Shuffle, MoreVertical, Heart, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { db } from '@/lib/db';
import { useState, useEffect } from 'react';

export default function AlbumClient({ album }: { album: any }) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (album?.albumId) {
        const saved = await db.isAlbumSaved(album.albumId);
        setIsSaved(saved);
      }
    };
    checkSaved();
  }, [album?.albumId]);

  const handleSaveAlbum = async () => {
    if (!album?.albumId) return;
    
    if (isSaved) {
      await db.removeSavedAlbum(album.albumId);
      setIsSaved(false);
    } else {
      await db.addSavedAlbum({
        albumId: album.albumId,
        name: album.name,
        artist: album.artist?.name || 'Unknown Artist',
        thumbnails: album.thumbnails || [],
        savedAt: Date.now()
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex items-center gap-6 w-full justify-center">
      <button 
        onClick={() => album.songs.length > 0 && playTrack(album.songs[0], album.songs)}
        className="w-12 h-12 border border-[#FAF9F6] rounded-full flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#121110] text-[#FAF9F6] transition-all duration-300"
      >
        <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
      </button>
      <button 
        onClick={handleSaveAlbum}
        className="w-12 h-12 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300"
        title={isSaved ? "Remove from Library" : "Save to Library"}
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1.5} /> : <BookmarkPlus className="w-5 h-5" strokeWidth={1.5} />}
      </button>
      <button className="w-12 h-12 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300">
        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
