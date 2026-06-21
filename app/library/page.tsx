'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, SubscribedArtist, SavedAlbum } from '@/lib/db';
import { Track } from '@/lib/store';
import { TrackItem } from '@/components/TrackItem';
import { Heart, Plus, ListMusic, Trash2, Play, MoreVertical, Download, TrendingUp, Clock, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { usePlayerStore } from '@/lib/store';
import { motion } from 'motion/react';
import { MarqueeText } from '@/components/MarqueeText';
import { ConfirmModal, AlertModal } from '@/components/FeedbackModals';

export default function Library() {
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbum[]>([]);
  const [subscribedArtists, setSubscribedArtists] = useState<SubscribedArtist[]>([]);
  const [activeTab, setActiveTab] = useState('Daftar putar');
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistImg, setNewPlaylistImg] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ title?: string, message: string } | null>(null);
  const playTrack = usePlayerStore((state) => state.playTrack);

  const tabs = ['Daftar putar', 'Lagu', 'Album', 'Artis', 'Podcasts'];

  const loadLibrary = async () => {
    const liked = await db.getLikedSongs();
    const pl = await db.getPlaylists();
    const sa = await db.getSubscribedArtists();
    const albums = await db.getSavedAlbums();
    setLikedSongs(liked);
    setPlaylists(pl);
    setSubscribedArtists(sa);
    setSavedAlbums(albums);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLibrary();

    const handlePlaylistsUpdated = () => {
      loadLibrary();
    };

    window.addEventListener('playlistsUpdated', handlePlaylistsUpdated);
    
    return () => {
      window.removeEventListener('playlistsUpdated', handlePlaylistsUpdated);
    };
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      img: newPlaylistImg || 'https://picsum.photos/seed/playlist/200/200',
      tracks: [],
    };
    await db.addPlaylist(newPlaylist);
    setShowCreate(false);
    setNewPlaylistName('');
    setNewPlaylistImg('');
    loadLibrary();
  };

  const handleDeletePlaylist = async (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await db.deletePlaylist(deleteTarget);
      loadLibrary();
      setDeleteTarget(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlaylistImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractPlaylistId = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get('list');
    } catch {
      return url; // fallback to treating the input itself as ID
    }
  };

  const handleImportPlaylistUrl = async () => {
    if (!importUrl.trim()) return;
    setIsImporting(true);
    
    try {
      const listId = extractPlaylistId(importUrl);
      if (!listId) {
        setAlertMessage({ title: 'Gagal', message: 'Invalid playlist URL atau ID tidak ditemukan.' });
        setIsImporting(false);
        return;
      }

      const res = await fetch(`/api/ytplaylist?id=${encodeURIComponent(listId)}`);
      if (!res.ok) throw new Error('Failed to fetch playlist');
      
      const data = await res.json();
      
      const newPlaylist = {
        id: Date.now().toString(),
        name: data.name || data.title || 'Imported Playlist',
        img: data.thumbnails?.[data.thumbnails.length - 1]?.url || 'https://picsum.photos/seed/playlist/200/200',
        tracks: data.videos || data.tracks || [],
      };
      
      await db.addPlaylist(newPlaylist);
      setShowImport(false);
      setImportUrl('');
      loadLibrary();
      setAlertMessage({ title: 'Sukses', message: 'Playlist berhasil diimpor!' });
    } catch (error) {
      console.error(error);
      setAlertMessage({ title: 'Gagal', message: 'Gagal mengimpor playlist. Pastikan link valid dan dapat diakses publik.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const data = JSON.parse(reader.result as string);
          
          let tracks = [];
          let name = 'Imported JSON Playlist';
          let img = 'https://picsum.photos/seed/playlist/200/200';
          
          if (Array.isArray(data)) {
             tracks = data;
          } else if (data.tracks || data.videos) {
             tracks = data.tracks || data.videos;
             name = data.name || data.title || name;
             if (data.thumbnails && data.thumbnails.length > 0) {
                 img = data.thumbnails[data.thumbnails.length - 1].url;
             } else if (data.img) {
                 img = data.img;
             }
          }
          
          const newPlaylist = {
            id: Date.now().toString(),
            name,
            img,
            tracks: tracks,
          };
          
          await db.addPlaylist(newPlaylist);
          setShowImport(false);
          loadLibrary();
          setAlertMessage({ title: 'Sukses', message: 'Playlist berhasil diimpor dari file JSON!' });
        } catch (err) {
          setAlertMessage({ title: 'Gagal', message: 'Format JSON tidak valid atau gagal dibaca.' });
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="min-h-screen pt-6 px-4 pb-24">
      <div className="flex overflow-x-auto no-scrollbar gap-6 mb-8 px-6 snap-x snap-mandatory scroll-smooth pt-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-2 text-[9px] font-sans tracking-widest uppercase transition-all snap-center border-b ${
              activeTab === tab 
                ? 'text-[#FAF9F6] border-[#FAF9F6]' 
                : 'text-[#FAF9F6]/40 border-transparent hover:text-[#FAF9F6]/70'
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8 px-6 text-[#FAF9F6]/50 text-[10px] font-sans tracking-widest uppercase">
        <button className="flex items-center gap-2 hover:text-[#FAF9F6] transition-colors">
          Date added <span className="text-xs">↓</span>
        </button>
        <button className="hover:text-[#FAF9F6] transition-colors">
          <ListMusic className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-6">
      {activeTab === 'Daftar putar' && (
        <div className="space-y-1">
          <div className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5" onClick={() => setActiveTab('Lagu')}>
            <div className="w-12 h-12 border border-[#FAF9F6]/20 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px] mb-0.5">Liked Songs</h3>
              <p className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase">{likedSongs.length} TRACKS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5">
            <div className="w-12 h-12 border border-[#FAF9F6]/20 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">Downloaded</h3>
            </div>
          </div>

          <div 
            onClick={() => router.push('/top50')}
            className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5"
          >
            <div className="w-12 h-12 border border-[#FAF9F6]/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">My Top 50</h3>
            </div>
          </div>

          <div 
            onClick={() => router.push('/history')}
            className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5"
          >
            <div className="w-12 h-12 border border-[#FAF9F6]/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">History</h3>
            </div>
          </div>

          <div className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5">
            <div className="w-12 h-12 border border-[#FAF9F6]/20 flex items-center justify-center shrink-0">
              <UploadCloud className="w-5 h-5 text-[#FAF9F6]" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">Uploaded</h3>
            </div>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors w-full text-left mt-4 border-b border-[#FAF9F6]/5"
          >
            <div className="w-12 h-12 border border-[#FAF9F6]/50 flex items-center justify-center shrink-0 text-[#FAF9F6]">
              <Plus className="w-5 h-5" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">Create Playlist</h3>
            </div>
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors w-full text-left border-b border-[#FAF9F6]/5"
          >
            <div className="w-12 h-12 border border-[#FAF9F6]/50 flex items-center justify-center shrink-0 text-[#FAF9F6]">
              <UploadCloud className="w-5 h-5" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h3 className="text-[#FAF9F6] font-serif text-[15px]">Import Playlist</h3>
            </div>
          </button>

          {playlists.map((pl) => (
            <div 
              key={pl.id} 
              className="flex items-center gap-5 py-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer transition-colors border-b border-[#FAF9F6]/5 group"
              onClick={() => router.push(`/playlist/${pl.id}`)}
            >
              <div className="relative w-12 h-12 border border-[#FAF9F6]/10 shrink-0">
                <Image src={pl.img} alt={pl.name} fill sizes="144px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks, 'playlist');
                    }}
                    className="w-6 h-6 border border-[#FAF9F6] rounded-full flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#121110] text-[#FAF9F6] transition-all"
                  >
                    <Play className="w-3 h-3 ml-0.5 fill-current" strokeWidth={1} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <MarqueeText text={pl.name} className="text-[#FAF9F6] font-serif text-[15px] mb-0.5" />
                <p className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase">{pl.tracks.length} TRACKS</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const cleanPl = {
                    id: pl.id,
                    name: pl.name,
                    img: pl.img,
                    tracks: pl.tracks?.map((t: any) => ({
                      videoId: t.videoId,
                      name: t.name,
                      artist: t.artist,
                      duration: t.duration,
                      thumbnails: t.thumbnails
                    })) || []
                  };
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanPl));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `${pl.name}.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="p-2 text-white/50 hover:text-white transition-all"
                title="Ekspor Playlist"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlaylist(pl.id);
                }}
                className="p-2 text-[#FAF9F6]/30 hover:text-red-500 transition-all"
                title="Delete Playlist"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Lagu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Liked Songs</h2>
            {likedSongs.length > 0 && (
              <button
                onClick={() => playTrack(likedSongs[0], likedSongs, 'playlist')}
                className="w-8 h-8 border border-[#FAF9F6] text-[#FAF9F6] rounded-full flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#121110] transition-all"
              >
                <Play className="w-3 h-3 fill-current ml-0.5" strokeWidth={1} />
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {likedSongs.map((track) => (
              <TrackItem key={track.videoId} track={track} queue={likedSongs} />
            ))}
            {likedSongs.length === 0 && (
              <div className="text-center text-[#FAF9F6]/40 font-serif italic py-16">No liked songs yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Album' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Saved Albums</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {savedAlbums.map((album) => (
              <div 
                key={album.albumId} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => router.push(`/album/${album.albumId}`)}
              >
                <div className="relative w-full aspect-square border border-[#FAF9F6]/10 mb-4 overflow-hidden">
                  <Image 
                    src={album.thumbnails?.[album.thumbnails.length - 1]?.url || '/placeholder.png'} 
                    alt={album.name} 
                    fill 
                    sizes="(max-width: 640px) 50vw, 200px" 
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
                <MarqueeText text={album.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1 text-center w-full" />
                <p className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase text-center w-full truncate">{album.artist}</p>
              </div>
            ))}
            {savedAlbums.length === 0 && (
              <div className="col-span-full text-center text-[#FAF9F6]/40 font-serif italic py-16">No saved albums.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Artis' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50">Subscribed Artists</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {subscribedArtists.map((artist) => (
              <div 
                key={artist.artistId} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => router.push(`/artist/${artist.artistId}`)}
              >
                <div className="relative w-28 h-28 rounded-full border border-[#FAF9F6]/10 mb-4 overflow-hidden shadow-lg">
                  <Image 
                    src={artist.thumbnails?.[artist.thumbnails.length - 1]?.url || '/placeholder.png'} 
                    alt={artist.name} 
                    fill 
                    sizes="112px" 
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
                <MarqueeText text={artist.name} className="text-[#FAF9F6] font-serif text-[15px] mb-1 text-center" />
                <p className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase mt-1">Artist</p>
              </div>
            ))}
            {subscribedArtists.length === 0 && (
              <div className="col-span-full text-center text-[#FAF9F6]/40 font-serif italic py-16">No subscribed artists.</div>
            )}
          </div>
        </div>
      )}

      </div>
      {/* Create Playlist Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-[#121110]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121110] p-8 w-full max-w-sm border border-[#FAF9F6]/10">
            <h2 className="font-serif text-2xl text-[#FAF9F6] mb-6 border-b border-[#FAF9F6]/10 pb-4">Create Playlist</h2>
            
            <div className="flex justify-center mb-8">
              <label className="relative w-32 h-32 border border-[#FAF9F6]/20 cursor-pointer group bg-transparent flex items-center justify-center hover:border-[#FAF9F6]/50 transition-colors">
                {newPlaylistImg ? (
                  <Image src={newPlaylistImg} alt="Preview" fill sizes="144px" className="object-cover grayscale-[20%]" />
                ) : (
                  <ListMusic className="w-6 h-6 text-[#FAF9F6]/30" strokeWidth={1} />
                )}
                <div className="absolute inset-0 bg-[#121110]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]">Upload Image</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="PLAYLIST NAME"
              className="w-full bg-transparent text-[#FAF9F6] text-sm border-b border-[#FAF9F6]/20 py-2 mb-8 focus:outline-none focus:border-[#FAF9F6] transition-all placeholder:text-[#FAF9F6]/20 placeholder:tracking-widest"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/60 border border-[#FAF9F6]/20 hover:text-[#FAF9F6] hover:border-[#FAF9F6] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-2 text-[9px] font-sans tracking-widest uppercase text-[#121110] bg-[#FAF9F6] border border-[#FAF9F6] hover:bg-transparent hover:text-[#FAF9F6] disabled:opacity-30 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Import Playlist Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 bg-[#121110]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121110] p-8 w-full max-w-sm border border-[#FAF9F6]/10">
            <h2 className="font-serif text-2xl text-[#FAF9F6] mb-6 border-b border-[#FAF9F6]/10 pb-4">Import Playlist</h2>
            
            <div className="mb-8">
              <label className="block text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-4">From YouTube (Link / ID)</label>
              <input
                type="text"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="HTTPS://..."
                className="w-full bg-transparent text-[#FAF9F6] text-sm border-b border-[#FAF9F6]/20 py-2 mb-4 focus:outline-none focus:border-[#FAF9F6] transition-all placeholder:text-[#FAF9F6]/20 placeholder:tracking-widest"
                disabled={isImporting}
              />
              <button
                onClick={handleImportPlaylistUrl}
                disabled={!importUrl.trim() || isImporting}
                className="w-full py-2 text-[9px] font-sans tracking-widest uppercase text-[#121110] bg-[#FAF9F6] border border-[#FAF9F6] hover:bg-transparent hover:text-[#FAF9F6] disabled:opacity-30 transition-all"
              >
                {isImporting ? 'Importing...' : 'Import URL'}
              </button>
            </div>

            <div className="relative flex items-center py-2 mb-8 text-[#FAF9F6]/30 text-[9px] font-sans tracking-widest">
              <div className="flex-grow border-t border-[#FAF9F6]/10"></div>
              <span className="flex-shrink-0 mx-4">OR</span>
              <div className="flex-grow border-t border-[#FAF9F6]/10"></div>
            </div>

            <div className="mb-8">
              <label className="block text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-4">From JSON File</label>
              <label className="w-full flex items-center justify-center py-2 text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6] border border-dashed border-[#FAF9F6]/30 hover:border-[#FAF9F6] cursor-pointer transition-colors">
                <UploadCloud className="w-3 h-3 mr-2" strokeWidth={1.5} />
                {isImporting ? 'Importing...' : 'Select JSON'}
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" disabled={isImporting} />
              </label>
            </div>

            <button
              onClick={() => {
                setShowImport(false);
                setImportUrl('');
              }}
              disabled={isImporting}
              className="w-full py-2 text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/60 border border-[#FAF9F6]/20 hover:text-[#FAF9F6] hover:border-[#FAF9F6] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Playlist"
        message="Apakah Anda yakin ingin menghapus playlist ini?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <AlertModal
        isOpen={!!alertMessage}
        title={alertMessage?.title}
        message={alertMessage?.message || ''}
        onClose={() => setAlertMessage(null)}
      />
    </main>
  );
}
