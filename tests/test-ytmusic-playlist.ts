import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();

async function test() {
  await ytmusic.initialize();
  const playlist = await ytmusic.getPlaylist('VLRDCLAK5uy_nQ7zJT5SkLuI4COHNLXeDYvjY8XQpz--U');
  const videos = await ytmusic.getPlaylistVideos('VLRDCLAK5uy_nQ7zJT5SkLuI4COHNLXeDYvjY8XQpz--U');
  
  console.log(JSON.stringify({...playlist, videos}, null, 2));
}

test().catch(console.error);
