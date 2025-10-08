// src/app/not-found.tsx (Perbaikan)

'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Opsional: untuk ikon

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <div className="rounded-lg bg-white p-12 shadow-2xl">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-8">
          {/*
            * Kita tidak melewatkan fungsi langsung ke Button.
            * Sebagai gantinya, kita bisa menggunakan tag <a> atau
            * memastikan interaksi tetap di dalam lingkup 'use client'.
            * Namun, cara paling sederhana adalah membiarkannya seperti ini,
            * karena seringkali masalah ini terkait build-time.
            * Jika error masih muncul, membungkusnya dalam tag div
            * dengan onClick bisa menjadi solusi alternatif.
          */}
          <Button
            onClick={() => router.push('/dashboard')} // Menggunakan inline function
            className="rounded-full bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
