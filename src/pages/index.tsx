import { Inter } from "next/font/google";
import TransitMap from "@/components/TransitMap";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-8 ${inter.className} bg-[#303030]`}
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-6">
          MBTA Live Transit Tracker
        </h1>
        <TransitMap />
      </div>
    </main>
  );
}
