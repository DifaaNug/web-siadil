import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// API Response Types
interface LoginSuccessResponse {
  success: true;
  application: {
    id: number;
    slug: string;
    name: string;
    description: string;
    active: boolean;
  };
  roles: string[];
  user: {
    id: string;
    username: string;
    name: string;
    pic: string;
    email: string;
    organization: {
      id: string;
      name: string;
      leader: boolean;
    };
  };
}

interface LoginErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password harus diisi");
        }

        // Development Mode: Mock Data untuk testing
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

        if (USE_MOCK) {
          console.log("🔧 [DEV MODE] Using mock authentication");

          // Mock users untuk testing
          if (
            credentials.username === "admin" &&
            credentials.password === "admin123"
          ) {
            return {
              id: "1",
              username: "admin",
              name: "Administrator",
              email: "admin@example.com",
              pic: "",
              roles: ["admin", "user"],
              organization: {
                id: "ORG001",
                name: "IT Department",
                leader: true,
              },
              application: {
                id: 1,
                slug: "siadil",
                name: "SIADIL",
                description: "Sistem Arsip Digital",
                active: true,
              },
            };
          }

          if (
            credentials.username === "user" &&
            credentials.password === "user123"
          ) {
            return {
              id: "2",
              username: "user",
              name: "User Demo",
              email: "user@example.com",
              pic: "",
              roles: ["user"],
              organization: {
                id: "ORG002",
                name: "General Department",
                leader: false,
              },
              application: {
                id: 1,
                slug: "siadil",
                name: "SIADIL",
                description: "Sistem Arsip Digital",
                active: true,
              },
            };
          }

          throw new Error("Username atau password salah");
        }

        // Production Mode: Call Real API
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "https://sso.pupuk-kujang.co.id";
          console.log("🔌 Attempting API login to:", apiUrl);

          const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          // Check if login failed
          if (!response.ok || !data.success) {
            const errorData = data as LoginErrorResponse;
            throw new Error(errorData.message || "Login gagal");
          }

          // Login success
          const loginData = data as LoginSuccessResponse;

          // Return user data sesuai dengan structure yang dibutuhkan
          return {
            id: loginData.user.id,
            username: loginData.user.username,
            name: loginData.user.name,
            email: loginData.user.email,
            pic: loginData.user.pic,
            roles: loginData.roles,
            organization: loginData.user.organization,
            application: loginData.application,
          };
        } catch (error) {
          console.error("❌ Login error:", error);

          // Berikan error message yang lebih jelas
          if (
            error instanceof TypeError &&
            error.message.includes("fetch failed")
          ) {
            throw new Error(
              "Tidak dapat terhubung ke server. Pastikan Anda terhubung ke jaringan internal atau VPN."
            );
          }

          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Terjadi kesalahan saat login");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.pic = user.pic;
        token.roles = user.roles;
        token.organization = user.organization;
        token.application = user.application;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.pic = token.pic;
        session.user.roles = token.roles;
        session.user.organization = token.organization;
        session.user.application = token.application;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",
};
