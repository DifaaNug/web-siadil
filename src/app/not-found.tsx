import Link from "next/link";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8 border border-gray-100">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <FileQuestion className="w-16 h-16 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman
              mungkin telah dipindahkan atau tidak ada.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Halaman Sebelumnya</span>
            </button>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              © 2025 SIADIL - PT Pupuk Kujang (Demplon)
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Jika masalah berlanjut, silakan hubungi administrator sistem
          </p>
        </div>
      </div>
    </div>
  );
}
