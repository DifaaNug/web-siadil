# 🔑 Access Token Implementation Guide

## 📋 Overview

Access token dari API SSO Pupuk Kujang sekarang sudah **tersimpan di session** dan dapat digunakan untuk melakukan request ke API endpoints lainnya.

---

## ✅ Apa yang Sudah Ditambahkan?

### 1. **Access Token di TypeScript Types**

File: `src/types/next-auth.d.ts`

```typescript
declare module "next-auth" {
  interface Session {
    // ... existing fields
    accessToken?: string; // ✅ Access token untuk API requests
  }

  interface User {
    // ... existing fields
    accessToken?: string; // ✅ Access token dari API login
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // ... existing fields
    accessToken?: string; // ✅ Access token untuk JWT
  }
}
```

### 2. **Access Token di Auth Configuration**

File: `src/lib/auth.ts`

#### A. Response Type dari API:

```typescript
interface LoginSuccessResponse {
  success: true;
  // ... existing fields
  token?: string; // ✅ Access token dari API
}
```

#### B. Simpan Token saat Login:

```typescript
// Di authorize callback:
return {
  // ... user data
  accessToken: loginData.token, // ✅ Simpan token
};
```

#### C. Token disimpan ke JWT:

```typescript
async jwt({ token, user }) {
  if (user) {
    // ... existing fields
    token.accessToken = user.accessToken; // ✅ Simpan di JWT
  }
  return token;
}
```

#### D. Token tersedia di Session:

```typescript
async session({ session, token }) {
  if (token && session.user) {
    // ... existing fields
    session.accessToken = token.accessToken; // ✅ Tersedia di session
  }
  return session;
}
```

### 3. **API Utility Functions**

File: `src/lib/api.ts`

Helper functions untuk melakukan API request dengan automatic token injection:

```typescript
import { apiGet, apiPost, apiPut, apiDelete, apiUploadFile } from "@/lib/api";

// GET request
const data = await apiGet("/api/documents", accessToken);

// POST request
const result = await apiPost("/api/documents", accessToken, { title: "Doc" });

// PUT request
const updated = await apiPut("/api/documents/123", accessToken, {
  title: "New",
});

// DELETE request
await apiDelete("/api/documents/123", accessToken);

// Upload file
const formData = new FormData();
formData.append("file", file);
const uploaded = await apiUploadFile("/api/upload", accessToken, formData);
```

---

## 🚀 Cara Menggunakan Access Token

### **1. Di React Component**

```tsx
"use client";

import { useSession } from "next-auth/react";
import { apiGet, apiPost } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState([]);

  // Access token tersedia di session
  const accessToken = session?.accessToken;

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!accessToken) return;

      try {
        const data = await apiGet("/api/documents", accessToken);
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, [accessToken]);

  const handleCreateDocument = async () => {
    if (!accessToken) return;

    try {
      const newDoc = {
        title: "New Document",
        description: "Description",
      };

      const result = await apiPost("/api/documents", accessToken, newDoc);
      console.log("Document created:", result);
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <div>
      <h1>Documents</h1>
      <button onClick={handleCreateDocument}>Create Document</button>
      {/* ... render documents */}
    </div>
  );
}
```

### **2. Di Server Component / API Route**

```typescript
// app/api/my-endpoint/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  // Gunakan access token untuk request ke API backend
  const response = await fetch(
    "https://api.pupuk-kujang.co.id/demplon/documents",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return Response.json(data);
}
```

### **3. Manual Fetch dengan Token**

```typescript
const accessToken = session?.accessToken;

// Manual fetch
const response = await fetch(
  "https://api.pupuk-kujang.co.id/demplon/documents",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
```

---

## 🧪 Testing Access Token

### **1. Check Console Log**

Di halaman SIADIL (`/dashboard/siadil`), buka browser console:

```javascript
// Log sudah ditambahkan di page.tsx
console.log("Session Data:", session);
console.log("Access Token:", session?.accessToken);
```

### **2. Expected Output**

#### A. Mock Mode (Development):

```javascript
{
  user: { ... },
  accessToken: "mock-token-admin-1234567890" // ✅ Mock token
}
```

#### B. Real API (Production):

```javascript
{
  user: { ... },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ✅ Real JWT token
}
```

### **3. Test API Request**

```typescript
const { data: session } = useSession();

const testApiCall = async () => {
  if (!session?.accessToken) {
    console.log("No access token available");
    return;
  }

  try {
    const response = await fetch(
      "https://api.pupuk-kujang.co.id/demplon/test",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.ok) {
      console.log("✅ API call successful with token!");
    } else {
      console.log("❌ API call failed:", response.status);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

---

## 🔒 Security Best Practices

### **1. Token Storage**

✅ **GOOD:** Token disimpan di session dengan httpOnly cookie

```typescript
// NextAuth otomatis menyimpan di httpOnly cookie
// Tidak bisa diakses JavaScript client-side → Aman dari XSS
```

❌ **BAD:** Jangan simpan di localStorage

```typescript
// JANGAN LAKUKAN INI!
localStorage.setItem("token", accessToken); // ⚠️ Vulnerable to XSS
```

### **2. Token Expiration**

Periksa apakah token masih valid:

```typescript
const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Gunakan sebelum API call
if (session?.accessToken && !isTokenExpired(session.accessToken)) {
  // Token masih valid
  await apiGet("/api/documents", session.accessToken);
} else {
  // Token expired - trigger re-login
  signOut({ callbackUrl: "/login" });
}
```

### **3. Error Handling**

```typescript
try {
  const data = await apiGet("/api/documents", accessToken);
} catch (error) {
  if (error instanceof Error) {
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      // Token invalid atau expired
      signOut({ callbackUrl: "/login" });
    } else if (error.message.includes("403")) {
      // Forbidden - user tidak punya akses
      toast.error("You don't have permission to access this resource");
    } else {
      // Error lainnya
      toast.error("Failed to fetch data: " + error.message);
    }
  }
}
```

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW WITH TOKEN                     │
└─────────────────────────────────────────────────────────────┘

1. User Login
   ↓
2. POST /api/auth/callback/credentials
   ↓
3. NextAuth → authorize() di auth.ts
   ↓
4. API Call: POST https://api.pupuk-kujang.co.id/demplon/login
   ↓
5. Response dari API:
   {
     success: true,
     user: { ... },
     token: "eyJhbGc..." ← Access Token
   }
   ↓
6. Save token di User object: { ...user, accessToken: token }
   ↓
7. JWT Callback: token.accessToken = user.accessToken
   ↓
8. Session Callback: session.accessToken = token.accessToken
   ↓
9. ✅ Access Token tersimpan di session!
   ↓
10. Di Client Component:
    const { data: session } = useSession();
    const token = session?.accessToken; ← Token tersedia!
```

---

## 🔄 Token Refresh (Future Enhancement)

Jika API mendukung refresh token:

```typescript
// Di callbacks jwt:
async jwt({ token, user, account }) {
  if (account) {
    // Initial sign in
    token.accessToken = user.accessToken;
    token.refreshToken = user.refreshToken;
    token.accessTokenExpires = Date.now() + 3600 * 1000; // 1 hour
  }

  // Return jika token masih valid
  if (Date.now() < token.accessTokenExpires) {
    return token;
  }

  // Token expired, refresh!
  return refreshAccessToken(token);
}

async function refreshAccessToken(token) {
  try {
    const response = await fetch("https://api.pupuk-kujang.co.id/demplon/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 3600 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
```

---

## 📝 Summary

### ✅ Apa yang Sudah Beres:

1. ✅ Access token **sudah ditambahkan** ke TypeScript types
2. ✅ Token **otomatis disimpan** saat login dari API
3. ✅ Token **tersedia di session** untuk digunakan
4. ✅ API utility functions **sudah dibuat** untuk kemudahan
5. ✅ Mock token **tersedia** untuk development mode
6. ✅ Console log **sudah ditambahkan** untuk debugging

### 🎯 Cara Pakai (TLDR):

```tsx
// 1. Import
import { useSession } from "next-auth/react";
import { apiGet } from "@/lib/api";

// 2. Get token
const { data: session } = useSession();
const accessToken = session?.accessToken;

// 3. Use token
const data = await apiGet("/api/endpoint", accessToken);
```

### 🔍 Debug Checklist:

- [ ] Buka console di `/dashboard/siadil`
- [ ] Check: `session.accessToken` ada nilainya?
- [ ] Mock mode: Token = `"mock-token-admin-..."`
- [ ] Real API: Token = JWT string panjang
- [ ] Test API call dengan token
- [ ] Cek Authorization header: `Bearer ${token}`

---

**File ini:** `ACCESS_TOKEN_GUIDE.md`

Sekarang access token sudah fully integrated! 🎉
