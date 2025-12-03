# 🤖 Discord Welcome & Goodbye Bot

Bot Discord sederhana untuk menyambut member baru dan mengucapkan selamat tinggal saat member keluar, dengan dukungan multi-bahasa (Indonesia & English).

## ✨ Fitur

- ✅ Welcome message dengan embed yang cantik
- ✅ Goodbye message dengan informasi waktu member di server
- ✅ Multi-language support (Indonesia & English)
- ✅ Account age detection (New, Active, Regular, Veteran)
- ✅ Auto-uptime dengan Express server (untuk UptimeRobot)
- ✅ Debug mode untuk monitoring
- ✅ Clean & simple code structure

---

## 📋 Struktur File

```
discord-welcome-bot/
│
├── index.js              # Main bot file
├── package.json          # Dependencies
├── .env                  # Environment variables (create this!)
├── .gitignore           # Git ignore rules
├── .replit              # Replit configuration
└── README.md            # Documentation (this file)
```

---

## 🚀 Quick Start

### 1️⃣ Setup Discord Bot

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Klik **"New Application"** → beri nama bot
3. Masuk ke tab **"Bot"**
4. Klik **"Reset Token"** → **Copy token** (simpan!)
5. **PENTING**: Scroll ke bawah dan aktifkan:
   - ✅ `SERVER MEMBERS INTENT`
   - ✅ `MESSAGE CONTENT INTENT`
6. Save Changes

### 2️⃣ Invite Bot ke Server

1. Tab **"OAuth2"** → **"URL Generator"**
2. Pilih Scopes: ✅ `bot`
3. Pilih Permissions:
   - ✅ `Send Messages`
   - ✅ `Embed Links`
   - ✅ `Read Message History`
   - ✅ `View Channels`
4. Copy URL → paste di browser → pilih server

### 3️⃣ Setup Project (Local)

```bash
# Clone atau download project ini
cd discord-welcome-bot

# Install dependencies
npm install

# Buat file .env dan isi konfigurasi
```

### 4️⃣ Konfigurasi .env

Buat file `.env` dan isi:

```env
DISCORD_TOKEN=your_bot_token_here
WELCOME_CHANNEL_ID=1234567890123456789
GOODBYE_CHANNEL_ID=1234567890123456789
LANGUAGE=id
DEBUG_MODE=true
```

**Cara mendapatkan Channel ID:**
1. Discord → User Settings → Advanced
2. Aktifkan **"Developer Mode"**
3. Klik kanan channel → **"Copy ID"**

### 5️⃣ Jalankan Bot

```bash
npm start
```

✅ Bot sekarang online!

---

## 🌐 Deploy ke Replit

### Setup di Replit

1. Buat Repl baru: **Node.js**
2. Upload/paste semua file
3. Klik **Secrets** (🔒 icon di sidebar)
4. Tambahkan secrets:
   - `DISCORD_TOKEN` = your_token
   - `WELCOME_CHANNEL_ID` = your_channel_id
   - `GOODBYE_CHANNEL_ID` = your_channel_id
   - `LANGUAGE` = id
   - `DEBUG_MODE` = true
5. Klik **Run**

### Setup UptimeRobot (Keep-Alive 24/7)

1. Daftar di [UptimeRobot](https://uptimerobot.com) (gratis!)
2. Klik **"+ Add New Monitor"**
3. Isi:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Discord Bot
   - **URL**: `https://your-repl-name.username.repl.co`
   - **Monitoring Interval**: 5 minutes
4. Klik **"Create Monitor"**

✅ Bot sekarang online 24/7!

---

## ⚙️ Konfigurasi

### Ganti Bahasa

Edit di `.env`:
```env
LANGUAGE=en  # English
# atau
LANGUAGE=id  # Indonesia
```

### Ganti Warna Embed

Edit di `index.js` bagian `colors`:
```javascript
const colors = {
  primary: 0x5865F2,  // Biru Discord
  success: 0x57F287,  // Hijau (Welcome)
  danger: 0xED4245,   // Merah (Goodbye)
  warning: 0xFEE75C,  // Kuning
  info: 0x3498DB      // Biru terang
};
```

### Custom Welcome Message

Edit di `index.js` bagian `messages`:
```javascript
const messages = {
  id: {
    welcome: {
      title: '👋 Custom Title',
      description: (member) => `Custom message untuk ${member}`,
      // ... edit sesuai keinginan
    }
  }
};
```

---

## 🐛 Troubleshooting

### ❌ Bot tidak online

```bash
# Cek logs
npm start

# Pastikan token benar
# Cek file .env sudah diisi
```

### ❌ Bot tidak kirim message

- ✅ Pastikan **SERVER MEMBERS INTENT** aktif
- ✅ Cek bot punya permission di channel
- ✅ Verifikasi Channel ID benar

### ❌ Error: Missing Permissions

Bot belum punya akses. Invite ulang dengan permission lengkap.

### ⚠️ Bot mati setelah beberapa saat (Replit)

Setup UptimeRobot untuk ping bot setiap 5 menit.

---

## 📊 Monitoring

### Cek Status Bot

1. **Console**: Lihat logs real-time
2. **Web Browser**: Buka `http://localhost:3000` atau URL Replit
3. **Discord**: Cek status bot (online/offline)

### Logs yang Normal

```
✅ Bot Online: YourBot#1234
🌐 Language: ID
✅ Welcome Channel: #welcome
✅ Goodbye Channel: #goodbye
✅ Welcome message sent for: User#1234
```

---

## 🎨 Customization Ideas

- 🎵 Tambahkan welcome music/sound
- 🎁 Auto-assign role untuk member baru
- 📊 Statistik member join/leave
- 🏆 Level system untuk member aktif
- 🎯 Auto DM welcome message
- 📅 Birthday announcements

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 💬 Support

Butuh bantuan? 
- 📖 Baca dokumentasi di atas
- 🐛 Check logs di console
- 🔍 Debug mode untuk detail error

---

## 🎉 Credits

Made with ❤️ for Discord communities

**Happy coding! 🚀**