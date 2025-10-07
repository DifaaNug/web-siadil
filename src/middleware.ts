import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Middleware logic bisa ditambahkan di sini
    // Misalnya: cek role untuk akses tertentu
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true jika user sudah login (ada token)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect semua routes kecuali login dan public assets
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // Tambahkan route lain yang perlu di-protect
  ],
};
