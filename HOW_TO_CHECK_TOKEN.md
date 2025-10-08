# ✅ Cara Cek Access Token Sudah Ada dan Aktif

## 🎯 3 Cara Mudah untuk Cek Token

---

## 1️⃣ **Halaman Test Token (PALING MUDAH)**

### Langkah:

1. **Buka browser**: `http://localhost:3001/dashboard/test-token`
2. **Login** terlebih dahulu jika belum
3. **Lihat hasilnya** di halaman

### Yang akan ditampilkan:

- ✅ **Session Status**: Apakah authenticated atau tidak
- 🔑 **Access Token**: Ada atau tidak
- 📊 **Token Status**: Active atau Expired
- 🧪 **Token Type**: Mock (dev) atau Real JWT
- 🔍 **Token Preview**: Sebagian isi token
- 📦 **Decoded Token**: Isi token yang sudah di-decode
- 🧪 **Test API Button**: Test apakah token berfungsi

### Screenshot yang diharapkan:

```
✅ Token Exists: Yes
✅ Token Status: Active
🔒 Token Type: Real JWT Token (atau 🧪 Mock Token jika dev mode)
```

---

## 2️⃣ **Browser Console (Developer Tools)**

### Langkah:

1. Buka halaman mana saja di dashboard (contoh: `/dashboard/siadil`)
2. Tekan **F12** untuk buka Developer Tools
3. Klik tab **Console**
4. Lihat log output

### Yang akan muncul di console:

```javascript
Session Data: {
  user: {
    id: "1",
    username: "admin",
    name: "Administrator",
    ...
  },
  accessToken: "mock-token-admin-1234567890" // atau JWT string
}

Access Token: mock-token-admin-1234567890
```

### Atau ketik manual di console:

```javascript
// Paste di browser console:
fetch("/api/auth/session")
  .then((res) => res.json())
  .then((session) => {
    console.log("📦 Session:", session);
    console.log("🔑 Access Token:", session.accessToken);
    console.log("✅ Token exists:", !!session.accessToken);
  });
```

---

## 3️⃣ **Cek di API Endpoint**

### Test dengan Postman atau cURL:

```bash
# 1. Get session token
curl http://localhost:3001/api/auth/session

# Response:
{
  "user": { ... },
  "accessToken": "mock-token-admin-1234567890"
}
```

---

## 🧪 Mode Development vs Production

### **Development Mode (Mock Auth)**

File `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**Token yang muncul:**

```
accessToken: "mock-token-admin-1702345678901"
```

**Ciri-ciri:**

- ✅ Token dimulai dengan `"mock-token-"`
- ✅ Ada timestamp di akhir
- ✅ Tidak bisa di-decode sebagai JWT

---

### **Production Mode (Real API)**

File `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

**Token yang muncul:**

```
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

**Ciri-ciri:**

- ✅ Format JWT (3 bagian dipisah titik)
- ✅ Bisa di-decode untuk lihat payload
- ✅ Ada expiry time (exp) di payload

---

## 🔍 Decode JWT Token (Manual)

### Di Browser Console:

```javascript
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode:", error);
    return null;
  }
}

// Gunakan:
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Token Anda
const decoded = decodeJWT(token);
console.log("Decoded token:", decoded);

// Output:
// {
//   sub: "123456",
//   name: "John Doe",
//   iat: 1516239022,
//   exp: 1516242622  <- Expiry timestamp
// }
```

---

## ✅ Checklist: Token Sudah Aktif

- [ ] **Token exists**: `session.accessToken` ada nilainya (bukan `undefined`)
- [ ] **Token format benar**:
  - Mock: `"mock-token-..."`
  - Real: Format JWT (3 bagian dengan titik)
- [ ] **Session authenticated**: `session.user` ada datanya
- [ ] **Token tidak expired**: Jika JWT, cek `exp` timestamp
- [ ] **Console log terlihat**: Log muncul di browser console

---

## 🚨 Troubleshooting

### **Problem 1: Token undefined atau null**

```javascript
console.log(session.accessToken); // undefined
```

**Penyebab:**

- Belum login
- Session expired
- Token tidak disimpan saat login

**Solusi:**

1. Logout lalu login lagi
2. Clear browser cache/cookies
3. Restart development server (`Ctrl+C` lalu `npm run dev`)

---

### **Problem 2: Token ada tapi tidak berfungsi**

**Gejala:**

```javascript
console.log(session.accessToken); // "mock-token-..." atau JWT
// Tapi API call gagal dengan 401 Unauthorized
```

**Penyebab:**

- Token expired
- Backend tidak recognize token
- Authorization header tidak dikirim

**Solusi:**

```javascript
// Test manual:
fetch("https://api.pupuk-kujang.co.id/demplon/test", {
  headers: {
    Authorization: `Bearer ${session.accessToken}`,
  },
}).then((res) => {
  console.log("Status:", res.status);
  if (res.ok) {
    console.log("✅ Token valid!");
  } else {
    console.log("❌ Token invalid atau expired");
  }
});
```

---

### **Problem 3: Mock token di production**

**Gejala:**

```javascript
// Di production tapi masih mock token
accessToken: "mock-token-admin-...";
```

**Penyebab:**

- `.env.local` masih set `NEXT_PUBLIC_USE_MOCK_AUTH=true`

**Solusi:**

1. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_MOCK_AUTH=false
   ```
2. **RESTART SERVER** (PENTING!):
   ```bash
   Ctrl+C
   npm run dev
   ```

---

## 📊 Quick Reference

| Cara          | URL/Command                                   | Kelebihan                 |
| ------------- | --------------------------------------------- | ------------------------- |
| **Test Page** | `http://localhost:3001/dashboard/test-token`  | Visual, lengkap, mudah    |
| **Console**   | F12 → Console                                 | Cepat, real-time          |
| **API Call**  | `curl http://localhost:3001/api/auth/session` | Testing dari luar browser |

---

## 🎯 TL;DR (Too Long; Didn't Read)

### Cara TERCEPAT cek token:

1. **Login** ke aplikasi
2. **Buka**: `http://localhost:3001/dashboard/test-token`
3. **Lihat**: ✅ Token Status: Active

ATAU

1. **Login** ke aplikasi
2. **Tekan F12** → Console
3. **Lihat log**: `Access Token: ...`

---

**Selesai!** Token sudah ada dan aktif jika muncul di salah satu cara di atas. 🎉

**File:** `HOW_TO_CHECK_TOKEN.md`
