<div align="center">
  <img src="https://f.top4top.io/p_3733w0g4e0.jpg" alt="Safe-Play Logo" width="120" height="120" style="border-radius: 50%; box-shadow: 0 4px 20px rgba(0,0,0,0.5); margin-bottom: 20px;" />
  <h1>🎧 Safe-Play Web Music</h1>
  <p><strong>A Sleek, Enterprise-Grade Spotify-like Web Player</strong></p>
  <p>Crafted with passion by <b>Safe_rill</b></p>
</div>

---

## 🌟 Overview

**Safe-Play** adalah platform *streaming* musik berbasis web bergaya *Spotify* yang dirancang untuk memberikan pengalaman audio tanpa hambatan (*seamless*) dengan antarmuka yang sangat futuristik dan mewah.

Proyek ini menggunakan **Next.js App Router** untuk memastikan pemutar musik (Player) tetap hidup secara global di latar belakang tanpa terputus saat pengguna berpindah-pindah halaman.

## ✨ Key Features

- **🛡️ Spotify-Level Stability**: Menggunakan arsitektur *Global App Layout* dan *Global Error Boundary*, pemutar musik tidak akan pernah mati meskipun halaman lain mengalami kegagalan proses.
- **📱 Background Mobile Playback**: Menggunakan trik *Silent Audio Lock* (HTML5 Audio Base64), lagu akan terus diputar dengan stabil di Android/iOS meskipun layar dikunci atau browser diminimalkan.
- **⚡ Optimistic Load Bypass**: Pengalaman perpindahan lagu secepat kilat. Sistem akan langsung memuat ID lagu selanjutnya secara sinkron tanpa menunggu siklus render React yang lambat.
- **🧠 Smart State Persistence**: Menggunakan *Zustand Persist*, sesi pemutaran Anda (lagu saat ini, *queue*, dan *history*) akan selalu diingat. Refresh halaman atau tutup browser, dan lanjutkan tepat dari titik terakhir Anda mendengarkan.
- **🎬 Cinematic Splash Screen**: Pengunjung akan disambut oleh *Welcome Pop-up* bergaya *dark glassmorphism* dengan efek aura 3D pada setiap sesi awal.
- **🖼️ High-Res Image Proxy**: Semua *thumbnail* album diambil secara *high-res* dan di-*proxy* dengan mulus melalui server Next.js untuk menghindari pemblokiran CORS dari pihak ketiga.
- **📱 PWA Ready**: Aplikasi ini mendukung *Progressive Web App* (PWA) sehingga bisa diinstal layaknya aplikasi native di HP maupun PC Anda.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Motion React (Framer Motion)](https://motion.dev/)
- **Audio Engine**: `react-youtube` (Iframe API)

## 🚀 Getting Started

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini secara lokal di mesin Anda.

### Prerequisites
Pastikan Anda sudah menginstal Node.js versi 18 ke atas.

### Installation

1. Clone repository ini:
   ```bash
   git clone https://github.com/saferill/Safe-Play.git
   cd Safe-Play
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server *development*:
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser favorit Anda.

## 🤝 Contributing

Jika Anda menemukan *bug* atau memiliki ide untuk meningkatkan fitur di dalam Safe-Play, jangan ragu untuk membuat *Pull Request* atau membuka *Issue*.

## 📄 License

Proyek ini dibuat untuk tujuan pembelajaran dan portofolio pribadi. Seluruh hak cipta musik dan gambar tetap menjadi milik pencipta aslinya.
