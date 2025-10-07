# 🎨 Visualisasi Endpoint - SIADIL Login System

## 📊 Diagram 1: Struktur URL & Endpoint

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          URL LENGKAP                                    │
│  https://sso.pupuk-kujang.co.id/login                                  │
│  └─────┬─────┘ └──────────┬──────────┘ └─┬──┘                          │
│    Protocol        Domain            Endpoint                           │
│    (Secure)    (Alamat Server)   (Fungsi Spesifik)                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Diagram 2: Peletakan di Code

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📄 .env.local (Environment Variables)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  NEXT_PUBLIC_API_URL=https://sso.pupuk-kujang.co.id                    │
│                                                                          │
│  ✅ BASE URL SAJA                                                        │
│  ❌ JANGAN tambahkan /login atau endpoint lain di sini!                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                          Environment Variable
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📄 src/lib/auth.ts (Authentication Logic)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  // Ambil base URL dari environment                                     │
│  const apiUrl = process.env.NEXT_PUBLIC_API_URL;                        │
│  // Result: "https://sso.pupuk-kujang.co.id"                           │
│                                                                          │
│  // Gabungkan dengan endpoint spesifik                                  │
│  const response = await fetch(`${apiUrl}/login`, {                     │
│    method: "POST",                            ↑                          │
│    body: JSON.stringify(credentials)     Endpoint Path                  │
│  });                                                                     │
│                                                                          │
│  // Final URL yang dipanggil:                                           │
│  // https://sso.pupuk-kujang.co.id/login ✅                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Diagram 3: Alur Request Complete

```
┌─────────────────┐
│   User Browser  │
│  localhost:3000 │
└────────┬────────┘
         │ 1. User input username & password
         │    Klik "Login"
         ↓
┌─────────────────────────────────────────────────────────────┐
│  NextAuth.js (src/lib/auth.ts)                              │
├─────────────────────────────────────────────────────────────┤
│  2. Prepare request:                                        │
│     - Base URL: https://sso.pupuk-kujang.co.id             │
│     - Endpoint: /login                                      │
│     - Method: POST                                          │
│     - Body: {username: "xxx", password: "yyy"}             │
└────────┬────────────────────────────────────────────────────┘
         │ 3. HTTP POST Request
         │    https://sso.pupuk-kujang.co.id/login
         ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Server                                             │
│  sso.pupuk-kujang.co.id                                    │
├─────────────────────────────────────────────────────────────┤
│  4. Process Login:                                          │
│     - Validate username & password                          │
│     - Check database                                        │
│     - Generate token (if success)                           │
└────────┬────────────────────────────────────────────────────┘
         │ 5. Send Response
         ↓
         ┌─────────────────────────────────────┐
         │  Success Response (200 OK)          │
         ├─────────────────────────────────────┤
         │  {                                  │
         │    "success": true,                 │
         │    "message": "Login berhasil",     │
         │    "user": {                        │
         │      "id": "1",                     │
         │      "username": "admin",           │
         │      "name": "Administrator"        │
         │    },                               │
         │    "token": "eyJhbGc..."            │
         │  }                                  │
         └─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│  NextAuth.js (src/lib/auth.ts)                              │
├─────────────────────────────────────────────────────────────┤
│  6. Process Response:                                       │
│     - Parse JSON                                            │
│     - Check if success                                      │
│     - Create session                                        │
│     - Return user data                                      │
└────────┬────────────────────────────────────────────────────┘
         │ 7. Redirect to dashboard
         ↓
┌─────────────────┐
│   User Browser  │
│  /dashboard     │
│  Logged In! ✅  │
└─────────────────┘
```

---

## 🏢 Diagram 4: Analogi Kantor

```
┌───────────────────────────────────────────────────────────────────────┐
│              🏢 GEDUNG PT PUPUK KUJANG                                │
│              (Server: sso.pupuk-kujang.co.id)                        │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Lantai 1: Lobby (/)                                                 │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  🚪 Pintu Utama: /                                  │            │
│  │     → Halaman welcome                               │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                       │
│  Lantai 2: Authentication (/auth)                                    │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  🔐 Ruang Login: /login                             │  ← YOU ARE │
│  │     → Proses login user                             │     HERE!  │
│  │  🚪 Ruang Logout: /logout                           │            │
│  │     → Proses logout user                            │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                       │
│  Lantai 3: User Management (/user)                                   │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  👤 Ruang Profile: /user/profile                    │            │
│  │     → Get/update user profile                       │            │
│  │  📝 Ruang Settings: /user/settings                  │            │
│  │     → Update user settings                          │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                       │
│  Lantai 4: Documents (/documents)                                    │
│  ┌─────────────────────────────────────────────────────┐            │
│  │  📄 Ruang List: /documents                          │            │
│  │     → Get list of documents                         │            │
│  │  📤 Ruang Upload: /documents/upload                 │            │
│  │     → Upload new document                           │            │
│  │  🗑️  Ruang Delete: /documents/delete                │            │
│  │     → Delete document                               │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

Cara Akses:
- Alamat Gedung: https://sso.pupuk-kujang.co.id (Base URL)
- Ruangan Spesifik: /login, /user/profile, dll (Endpoint)
- Alamat Lengkap: Gedung + Ruangan
  Contoh: https://sso.pupuk-kujang.co.id/login
```

---

## 📦 Diagram 5: Multiple Endpoints

```
┌────────────────────────────────────────────────────────────────────┐
│  Base URL: https://sso.pupuk-kujang.co.id                         │
└────────────────────┬───────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ /login  │  │ /logout │  │ /user   │
   │         │  │         │  │         │
   │  POST   │  │  POST   │  │   GET   │
   └─────────┘  └─────────┘  └────┬────┘
                                   │
                        ┌──────────┼──────────┐
                        ↓          ↓          ↓
                   ┌─────────┐ ┌─────────┐ ┌─────────┐
                   │/profile │ │/settings│ │/avatar  │
                   │  GET    │ │  PUT    │ │  POST   │
                   └─────────┘ └─────────┘ └─────────┘

FULL URLs:
✓ https://sso.pupuk-kujang.co.id/login
✓ https://sso.pupuk-kujang.co.id/logout
✓ https://sso.pupuk-kujang.co.id/user/profile
✓ https://sso.pupuk-kujang.co.id/user/settings
✓ https://sso.pupuk-kujang.co.id/user/avatar
```

---

## ⚙️ Diagram 6: Configuration Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 1: Set Base URL                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  File: .env.local                                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_API_URL=https://sso.pupuk-kujang.co.id        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ✅ Do: Base URL only                                            │
│  ❌ Don't: https://sso.pupuk-kujang.co.id/login                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 2: Add Endpoints in Code                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  File: src/lib/auth.ts                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ const apiUrl = process.env.NEXT_PUBLIC_API_URL;           │ │
│  │                                                            │ │
│  │ // Login endpoint                                         │ │
│  │ await fetch(`${apiUrl}/login`, {...});                   │ │
│  │                                                            │ │
│  │ // Logout endpoint                                        │ │
│  │ await fetch(`${apiUrl}/logout`, {...});                  │ │
│  │                                                            │ │
│  │ // Profile endpoint                                       │ │
│  │ await fetch(`${apiUrl}/user/profile`, {...});            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 3: Restart Server                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Terminal:                                                        │
│  $ Ctrl+C        # Stop server                                   │
│  $ npm run dev   # Start again                                   │
│                                                                   │
│  ✅ Environment variables akan di-load ulang                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 4: Test                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Browser:                                                         │
│  → http://localhost:3000/login                                   │
│  → Input username & password                                     │
│  → Click Login                                                   │
│                                                                   │
│  Request will be sent to:                                        │
│  → https://sso.pupuk-kujang.co.id/login ✅                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Diagram 7: Debugging Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  Problem: Login tidak berfungsi                                  │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
          ┌──────────────────────┐
          │ Buka Browser Console │
          │       (F12)          │
          └──────────┬───────────┘
                     ↓
       ┌─────────────────────────────┐
       │ Tab: Network                │
       │ Filter: Fetch/XHR           │
       └──────────┬──────────────────┘
                  ↓
       ┌──────────────────────────────────┐
       │ Coba Login → Lihat Request       │
       └──────────┬───────────────────────┘
                  ↓
    ┌─────────────────────────────────────┐
    │ Click request "login"               │
    └──────────┬──────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────────────────┐
│ Check Request Details:                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 1. Request URL:                                                  │
│    ✅ Correct: https://sso.pupuk-kujang.co.id/login             │
│    ❌ Wrong:   https://sso.pupuk-kujang.co.id/login/login       │
│                                                                   │
│ 2. Request Method:                                               │
│    ✅ Should be: POST                                            │
│                                                                   │
│ 3. Request Headers:                                              │
│    ✅ Content-Type: application/json                             │
│                                                                   │
│ 4. Request Payload:                                              │
│    ✅ {username: "xxx", password: "yyy"}                         │
│                                                                   │
│ 5. Response:                                                     │
│    ✅ JSON: {success: true, ...}                                 │
│    ❌ HTML: <!DOCTYPE html>... → Endpoint salah!                │
│                                                                   │
│ 6. Status Code:                                                  │
│    ✅ 200: Success                                               │
│    ❌ 404: Endpoint not found                                    │
│    ❌ 401: Wrong credentials                                     │
│    ❌ 500: Server error                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📚 Quick Reference

```
┌──────────────────────────────────────────────────────────────────┐
│  CHEAT SHEET                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  .env.local:                                                     │
│  NEXT_PUBLIC_API_URL=https://sso.pupuk-kujang.co.id            │
│                      └────────────┬────────────┘                 │
│                              BASE URL ONLY                        │
│                                                                   │
│  ────────────────────────────────────────────────────────────── │
│                                                                   │
│  src/lib/auth.ts:                                                │
│  const url = `${process.env.NEXT_PUBLIC_API_URL}/login`        │
│               └──────────────────┬─────────────┘ └──┬──┘         │
│                            Base URL              Endpoint         │
│                                                                   │
│  ────────────────────────────────────────────────────────────── │
│                                                                   │
│  Final Request:                                                  │
│  https://sso.pupuk-kujang.co.id/login                           │
│                                                                   │
│  ────────────────────────────────────────────────────────────── │
│                                                                   │
│  Test in Postman:                                                │
│  POST https://sso.pupuk-kujang.co.id/login                      │
│  Body: {"username": "xxx", "password": "yyy"}                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

**Semoga visualisasi ini membantu! 🎉**
