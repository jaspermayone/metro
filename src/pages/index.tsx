import { Inter } from "next/font/google";
import Head from "next/head";
import TransitMap from "@/components/TransitMap";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>MBTA Live - Real-time Transit Tracking</title>
      </Head>
      <main
        className={`min-h-screen ${inter.className} bg-gradient-to-br from-gray-50 via-white to-gray-100`}
      >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🚇</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  MBTA Live
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Real-time transit tracking for Boston
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransitMap />
      </div>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Data provided by MBTA V3 API • Updates every 10 seconds
            </p>
            <p className="text-xs text-gray-400">
              Built by{" "}
              <a
                href="https://github.com/jaspermayone"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Jasper Mayone
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
