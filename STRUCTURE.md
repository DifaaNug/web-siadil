# SIADIL Web - App Router Structure

## Struktur Project Baru

Project ini telah direstrukturisasi menggunakan Next.js 15 App Router untuk organisasi yang lebih baik.

### Struktur Folder

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── dashboard/              # Dashboard routes
│       ├── layout.tsx          # Dashboard layout dengan sidebar
│       ├── page.tsx            # Dashboard utama
│       ├── loading.tsx         # Loading UI
│       ├── error.tsx           # Error boundary
│       ├── profile/
│       │   └── page.tsx        # Halaman profile
│       ├── employment/
│       │   └── page.tsx        # Halaman employment
│       ├── kehadiran/
│       │   └── page.tsx        # Halaman kehadiran
│       └── siadil/
│           └── page.tsx        # Halaman SIADIL
└── components/
    ├── SidebarNav.tsx          # Sidebar dengan Next.js navigation
    ├── SiadilHeader.tsx        # Header component
    ├── SiadilContent.tsx       # Content component
    └── MainLayout.tsx          # Legacy layout (deprecated)
```

### Routing

- `/` - Landing page
- `/dashboard` - Dashboard utama
- `/dashboard/profile` - Halaman profile
- `/dashboard/employment` - Halaman employment
- `/dashboard/kehadiran` - Halaman kehadiran, koreksi, cuti, dan dinas
- `/dashboard/siadil` - Halaman SIADIL

### Fitur App Router yang Digunakan

1. **Nested Layouts**: Dashboard menggunakan layout terpisah dengan sidebar
2. **File-based Routing**: Setiap folder represent route
3. **Loading UI**: Loading state untuk setiap halaman
4. **Error Boundaries**: Error handling per route
5. **Client Components**: Menggunakan 'use client' directive untuk interaktivitas

### Komponen Utama

#### SidebarNav

- Menggunakan `usePathname` untuk active state
- Navigation menggunakan Next.js `Link` component
- Responsive design dengan collapse functionality

#### Dashboard Layout

- Persistent sidebar across dashboard routes
- Shared layout untuk semua halaman dashboard
- Optimized rendering dengan layout nesting

### Migrasi dari MainLayout

MainLayout yang lama telah digantikan dengan:

- App Router file-based routing
- Dedicated dashboard layout
- Individual page components
- Proper separation of concerns

### Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

### Best Practices Applied

1. **Route Groups**: Dashboard routes dikelompokkan dalam folder dashboard
2. **Loading States**: Setiap route memiliki loading UI
3. **Error Handling**: Error boundaries untuk graceful error handling
4. **SEO Friendly**: Proper metadata untuk setiap halaman
5. **Performance**: Layout sharing untuk optimasi rendering
