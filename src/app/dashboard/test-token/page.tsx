"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TestTokenPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string>("");
  const [testing, setTesting] = useState(false);

  // Decode JWT token (untuk melihat isinya)
  const decodeToken = (token: string) => {
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
    } catch {
      return { error: "Failed to decode token" };
    }
  };

  // Check apakah token expired
  const isTokenExpired = (token: string) => {
    try {
      const decoded = decodeToken(token);
      if (decoded.exp) {
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        return now > expiryTime;
      }
      return false;
    } catch {
      return true;
    }
  };

  // Test API call dengan token
  const testApiCall = async () => {
    if (!session?.accessToken) {
      setTestResult("❌ No access token available");
      return;
    }

    setTesting(true);
    setTestResult("🔄 Testing API call...");

    try {
      // Test dengan endpoint real (sesuaikan dengan endpoint yang ada)
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://sso.pupuk-kujang.co.id"
        }/test`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        setTestResult("✅ API call successful! Token is valid and working.");
      } else {
        setTestResult(
          `⚠️ API responded with status: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      setTestResult(
        `❌ API call failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setTesting(false);
    }
  };

  const accessToken = session?.accessToken;
  const decodedToken = accessToken ? decodeToken(accessToken) : null;
  const expired = accessToken ? isTokenExpired(accessToken) : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🔑 Access Token Checker
          </h1>

          {/* Session Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📊 Session Status
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`ml-2 font-semibold ${
                      status === "authenticated"
                        ? "text-green-600"
                        : status === "loading"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {status === "authenticated"
                      ? "✅ Authenticated"
                      : status === "loading"
                      ? "⏳ Loading..."
                      : "❌ Not Authenticated"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    User:
                  </span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    {session?.user?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Access Token Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🔐 Access Token
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              {accessToken ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Token Exists:
                      </span>
                      <span className="text-green-600 font-semibold">
                        ✅ Yes
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Token Length:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">
                        {accessToken.length} characters
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Token Status:
                      </span>
                      <span
                        className={`font-semibold ${
                          expired ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {expired ? "❌ Expired" : "✅ Active"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Token Type:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {accessToken.startsWith("mock-")
                          ? "🧪 Mock Token (Dev Mode)"
                          : "🔒 Real JWT Token"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-600 dark:text-gray-400 block mb-2">
                      Token Preview:
                    </span>
                    <div className="bg-white dark:bg-gray-800 rounded p-3 font-mono text-xs break-all">
                      {accessToken.substring(0, 100)}...
                    </div>
                  </div>

                  {/* Decoded Token */}
                  {decodedToken && !decodedToken.error && (
                    <div className="mt-4">
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">
                        Decoded Token (Payload):
                      </span>
                      <div className="bg-white dark:bg-gray-800 rounded p-3">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(decodedToken, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold text-lg">
                    ❌ No Access Token Found
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Token tidak tersedia di session. Silakan login terlebih
                    dahulu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Test API Call */}
          {accessToken && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                🧪 Test API Call
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <button
                  onClick={testApiCall}
                  disabled={testing}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? "Testing..." : "Test API Call with Token"}
                </button>

                {testResult && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">{testResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session Data */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📦 Full Session Data
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              💡 Cara Menggunakan:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li>Pastikan Anda sudah login</li>
              <li>
                Cek bagian &quot;Access Token&quot; untuk melihat token ada atau
                tidak
              </li>
              <li>Lihat &quot;Token Status&quot; apakah Active atau Expired</li>
              <li>
                Klik &quot;Test API Call&quot; untuk test apakah token bekerja
                dengan backend
              </li>
              <li>Buka browser console (F12) untuk melihat log detail</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
