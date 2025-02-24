# 📚 RPP AI - Sistem Pembuatan RPP dengan AI

RPP AI adalah sistem berbasis **NestJS, Redis, MongoDB Atlas**, dan **Google Gemini API** yang digunakan untuk **membantu pembuatan RPP** secara otomatis dengan memanfaatkan AI. Sistem ini menyimpan percakapan **sementara di Redis** untuk menghemat penggunaan token API dan **memindahkan data ke MongoDB Atlas setelah sesi berakhir**.


## 🚀 **Fitur Utama**
- ✅ **Pembuatan RPP berbasis AI** menggunakan **Google Gemini API**.
- ✅ **Caching percakapan di Redis** untuk mengurangi pemakaian token API.
- ✅ **Penyimpanan hasil percakapan di MongoDB Atlas** setelah sesi berakhir.
- ✅ **Dukungan GraphQL API** untuk interaksi dengan sistem.
- ✅ **Struktur kode modular dan scalable** menggunakan **NestJS**.


## 📂 **Struktur Folder**
```bash
rpp-ai/
│── src/                              # Source code utama
│   ├── common/                       # Modul yang digunakan di seluruh aplikasi
│   │   ├── database/                 # Modul MongoDB Atlas
│   │   │   ├── chat.service.ts       # Service untuk menyimpan percakapan di MongoDB
│   │   ├── decorators/               # Custom decorators untuk validasi atau role
│   │   ├── filters/                  # Global filters (misalnya: HTTP exception filter)
│   │   │   ├── http-exception.ts     # Handler untuk error HTTP
│   │   ├── redis/                    # Modul Redis untuk caching percakapan
│   │   │   ├── redis.service.ts      # Service untuk menyimpan data sementara di Redis
│   │   ├── schemas/                  # Schema untuk MongoDB dengan Mongoose
│   │   ├── utils/                    # Utility function (helper functions)
│   │   ├── common.module.ts          # Menggabungkan database, redis, dan utils
│   │
│   ├── modules/                      # Modul utama aplikasi
│   │   ├── conversations/            # Modul percakapan AI
│   │   │   ├── conversation.service.ts # Service utama percakapan AI
│   │   │   ├── conversation.resolver.ts # Resolver GraphQL untuk API percakapan
│   │   │   ├── conversation.model.ts # Model GraphQL untuk percakapan
│   │   ├── rpp/                       # Modul utama untuk pembuatan RPP
│   │   │   ├── rpp.service.ts         # Service untuk pembuatan RPP dengan AI
│   │   │   ├── rpp.resolver.ts        # Resolver GraphQL untuk API RPP
│   │   │   ├── rpp.module.ts          # Module untuk mengatur RPP
│   │
│   ├── app.module.ts                 # Root module NestJS
│   ├── main.ts                        # Entry point aplikasi
│   ├── schema.gql                     # Schema GraphQL yang dihasilkan secara otomatis
│
│── test/                              # Folder untuk unit test
│
│── .env                               # Konfigurasi lingkungan (MongoDB, Redis, API Key)
```

---

## ⚙️ **Instalasi**
1️⃣ **Clone Repository**
```bash
git clone https://github.comdhfai/rpp-ai.git
cd rpp-ai
```

2️⃣ **Install Dependencies**
```bash
bun install
```

3️⃣ **Konfigurasi Environment**
Buat file **`.env`** dan isi dengan kredensial yang sesuai:
```ini
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rpp_conversations?retryWrites=true&w=majority

# Redis Connection
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

4️⃣ **Jalankan Aplikasi**
```bash
bun run start:dev
```

---

## 🔥 **Endpoints GraphQL**
Setelah aplikasi berjalan, buka **GraphQL Playground** di:
```
http://localhost:3000/graphql
```

### **✅ Generate RPP Baru**
```graphql
mutation {
  generateRpp(input: { title: "Matematika" }) {
    id
    sessionId
    title
    content
  }
}
```

### **✅ Akhiri Sesi RPP**
```graphql
mutation {
  endRppSession(sessionId: "abc123")
}
```

---

## 🎯 **Teknologi yang Digunakan**
- **NestJS** → Framework backend modular berbasis Node.js.
- **GraphQL** → API yang fleksibel untuk query dan mutation data.
- **Redis** → Penyimpanan percakapan sementara untuk caching.
- **MongoDB Atlas** → Penyimpanan percakapan setelah sesi selesai.
- **Google Gemini API** → Model AI untuk menghasilkan RPP secara otomatis.

---

## 🛠️ **Troubleshooting**
Jika terjadi error saat koneksi ke **MongoDB Atlas**, coba:
1. **Pastikan `MONGODB_URI` di `.env` benar**.
2. **Whitelist IP Address di MongoDB Atlas** (`0.0.0.0/0` untuk akses global).
3. **Coba koneksi manual dengan MongoDB shell:**
   ```bash
   mongosh "mongodb+srv://username:password@cluster0.mongodb.net/rpp_conversations"
   ```

Jika terjadi error di **Redis**, coba:
1. **Pastikan Redis berjalan dengan perintah:**
   ```bash
   redis-cli PING
   ```
   Jika berhasil, akan muncul output:
   ```
   PONG
   ```
2. **Jika ingin membersihkan Redis, gunakan:**
   ```bash
   redis-cli FLUSHALL
   ```

---

## 📄 **Lisensi**
Proyek ini menggunakan lisensi **MIT**, silakan gunakan dan modifikasi sesuai kebutuhan.