import Image from "next/image";
import { Inter } from "next/font/google";
import { useMemo } from "react";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  return (
    <div>
      <Map />
    </div>
  );

  // return (
  //   <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
  //   </main>
  // );
}
