#!/bin/bash

# Script untuk cek status authentication mode
# Usage: bash check-auth-mode.sh

echo "🔍 Checking Authentication Mode..."
echo ""

# Cek apakah .env.local ada
if [ ! -f .env.local ]; then
    echo "❌ File .env.local tidak ditemukan!"
    echo "💡 Silakan buat file .env.local terlebih dahulu"
    exit 1
fi

# Ambil nilai USE_MOCK_AUTH
MOCK_MODE=$(grep "NEXT_PUBLIC_USE_MOCK_AUTH" .env.local | cut -d '=' -f2)
API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d '=' -f2)

echo "📋 Current Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cek mode
if [ "$MOCK_MODE" = "true" ]; then
    echo "🔧 Mode: DEVELOPMENT (Mock Authentication)"
    echo "📦 Status: Menggunakan data dummy"
    echo ""
    echo "✅ Credentials untuk testing:"
    echo "   Admin: admin / admin123"
    echo "   User:  user / user123"
    echo ""
    echo "ℹ️  Data yang digunakan:"
    echo "   - Nama: Administrator / User Demo"
    echo "   - Username: admin / user"
    echo "   - Organization: IT Department / General Department"
    echo ""
    echo "💡 Untuk menggunakan API real:"
    echo "   1. Edit .env.local"
    echo "   2. Ubah NEXT_PUBLIC_USE_MOCK_AUTH=false"
    echo "   3. Restart server: npm run dev"
else
    echo "🌐 Mode: PRODUCTION (Real API)"
    echo "🔌 API Endpoint: $API_URL"
    echo ""
    echo "✅ Menggunakan endpoint API real"
    echo ""
    echo "⚠️  Perlu credentials real dari sistem Demplon"
    echo "   Contoh: 3082625 / password-asli"
    echo ""
    echo "🔍 Testing koneksi ke API..."
    
    # Test koneksi ke API (hanya cek domain)
    API_DOMAIN=$(echo $API_URL | sed -e 's|^[^/]*//||' -e 's|/.*$||')
    
    if ping -c 1 -W 2 $API_DOMAIN &> /dev/null; then
        echo "   ✅ Domain $API_DOMAIN dapat diakses"
    else
        echo "   ❌ Domain $API_DOMAIN tidak dapat diakses"
        echo "   💡 Pastikan:"
        echo "      - Koneksi internet aktif"
        echo "      - VPN aktif (jika diperlukan)"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Environment Variables:"
echo "   NEXT_PUBLIC_USE_MOCK_AUTH = $MOCK_MODE"
echo "   NEXT_PUBLIC_API_URL = $API_URL"
echo ""
echo "🚀 Server Status:"
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ✅ Server running on port 3002"
    echo "   🌐 http://localhost:3002/login"
else
    echo "   ⚠️  Server tidak berjalan"
    echo "   💡 Jalankan: npm run dev"
fi

echo ""
echo "📚 Documentation:"
echo "   - API_STATUS_CHECK.md - Cara cek & aktifkan API"
echo "   - LOGIN_GUIDE.md - Panduan login"
echo "   - API_INTEGRATION.md - Detail integrasi API"
echo ""
