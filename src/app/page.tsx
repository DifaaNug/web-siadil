import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SIADIL</h1>
          <p className="text-gray-600 mb-8">Sistem Arsip Digital</p>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors duration-200 flex items-center justify-center">
              <span className="mr-2">🏠</span>
              Masuk ke Dashboard
            </Link>

            <div className="text-sm text-gray-500">
              <p>Selamat datang di Sistem Arsip Digital</p>
              <p className="mt-1">Kelola dokumen dengan mudah dan aman</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
