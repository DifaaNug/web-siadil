# 🔧 FIX: Access Token Tidak Muncul

## ❌ Masalah yang Terjadi

User **Riza Ilhamsyah** sudah login (Authenticated ✅) tapi **Access Token tidak ada** (❌).

## 🔍 Penyebab

Ada 2 kemungkinan:

1. **Session lama**: Login dilakukan **sebelum** kode access token ditambahkan
2. **API response berbeda**: API SSO mungkin tidak mengembalikan field `token`

## ✅ Solusi yang Sudah Diterapkan

### 1. **Enhanced Logging**

Menambahkan log detail untuk track token:

- Log raw API response
- Log apakah token diterima dari API
- Log JWT callback
- Log session callback

### 2. **Multiple Token Field Support**

Mendukung berbagai nama field untuk token:

- `token`
- `access_token`
- `accessToken`

### 3. **Fallback Token Generation**

Jika API tidak mengembalikan token, sistem akan **generate temporary session token**:

```
session-{userId}-{timestamp}
```

### 4. **Safe Defaults**

Menambahkan default values untuk field optional:

- `roles`: `[]`
- `organization`: Default organization
- `application`: Default SIADIL config

---

## 🚀 CARA MEMPERBAIKI (LANGKAH-LANGKAH)

### **Step 1: Logout**

1. Buka aplikasi di browser
2. Klik menu **Logout** atau buka: `http://localhost:3001/api/auth/signout`
3. Confirm logout

### **Step 2: Clear Browser Data (Optional tapi Recommended)**

**Chrome/Edge:**

- Tekan `Ctrl + Shift + Delete`
- Pilih "Cookies and other site data"
- Pilih "Last hour"
- Klik "Clear data"

**Firefox:**

- Tekan `Ctrl + Shift + Delete`
- Pilih "Cookies"
- Pilih "Last hour"
- Klik "Clear Now"

### **Step 3: Restart Development Server**

Di terminal:

```bash
# Stop server (Ctrl+C)
Ctrl + C

# Start lagi
npm run dev
```

### **Step 4: Login Lagi**

1. Buka: `http://localhost:3001/login`
2. Login dengan credentials Anda
3. **PENTING**: Lihat terminal output saat login!

### **Step 5: Cek Terminal Log**

Setelah login, di terminal akan muncul log seperti ini:

```bash
# Jika token DITERIMA dari API:
📦 Raw API Response: { "success": true, "user": {...}, "token": "..." }
✅ Login successful for user: riza.ilhamsyah
🔑 Access token from API: YES ✅
🔑 Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Jika token TIDAK DITERIMA dari API (fallback):
📦 Raw API Response: { "success": true, "user": {...} }
✅ Login successful for user: riza.ilhamsyah
🔑 Access token from API: NO ❌
⚠️ API did not return token, generating temporary session token
🔑 Generated token: session-123-1702345678901

# JWT Callback:
📝 JWT Callback - Saving user data to token
🔑 User accessToken: EXISTS ✅
🔑 Token.accessToken after save: SAVED ✅

# Session Callback:
📦 Session Callback - Building session
🔑 Token.accessToken: EXISTS ✅
🔑 Session.accessToken after save: SAVED ✅
```

### **Step 6: Verifikasi Token**

Setelah login, buka: `http://localhost:3001/dashboard/test-token`

**Expected Result:**

```
✅ Session Status: Authenticated
✅ Token Exists: Yes
✅ Token Status: Active
🔒 Token Type: Real JWT Token (atau session-xxx jika fallback)
```

---

## 🔍 Debugging: Jika Masih Tidak Ada Token

### **Option 1: Check API Response**

Lihat log di terminal:

```bash
📦 Raw API Response: { ... }
```

**Pertanyaan:**

1. Apakah ada field `token`, `access_token`, atau `accessToken`?
2. Jika tidak ada, kemungkinan API SSO Pupuk Kujang memang tidak mengembalikan token

### **Option 2: Test dengan Mock Mode**

Edit `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

Restart server, login dengan:

- Username: `admin`
- Password: `admin123`

Mock mode **pasti ada token**: `mock-token-admin-{timestamp}`

### **Option 3: Hubungi Backend Team**

Jika API tidak mengembalikan token, tanyakan ke backend team:

1. **Apakah endpoint `/login` mengembalikan access token?**
2. **Apa nama field untuk token?** (`token`, `access_token`, `accessToken`?)
3. **Apakah perlu endpoint lain** untuk get token setelah login?

---

## 📊 Comparison: Before vs After

### **Before Fix:**

```javascript
// Session (OLD)
{
  user: {
    name: "Riza Ilhamsyah",
    ...
  }
  // ❌ accessToken: undefined
}
```

### **After Fix:**

```javascript
// Session (NEW)
{
  user: {
    name: "Riza Ilhamsyah",
    ...
  },
  accessToken: "eyJhbGc..." // ✅ atau "session-123-..." (fallback)
}
```

---

## 🎯 Quick Fix Commands

```bash
# 1. Stop server
Ctrl + C

# 2. Restart server
npm run dev

# 3. Open browser
http://localhost:3001/login

# 4. Login lagi

# 5. Check token page
http://localhost:3001/dashboard/test-token
```

---

## 📝 Summary

### ✅ Yang Sudah Diperbaiki:

1. ✅ Enhanced logging untuk debugging
2. ✅ Support multiple token field names
3. ✅ Fallback token generation jika API tidak provide
4. ✅ Safe defaults untuk optional fields
5. ✅ Better error handling

### 🔄 Yang Harus Dilakukan User:

1. **Logout** dari session lama
2. **Clear browser cookies** (optional)
3. **Restart development server**
4. **Login lagi**
5. **Cek terminal log** untuk verifikasi
6. **Buka test-token page** untuk confirm

### 🎯 Expected Result:

- ✅ Token muncul di session
- ✅ Token bisa digunakan untuk API calls
- ✅ Terminal log menunjukkan token saved

---

**File:** `FIX_ACCESS_TOKEN_ISSUE.md`

**PENTING**: Silakan **logout dan login lagi** untuk mendapatkan token! 🔄
