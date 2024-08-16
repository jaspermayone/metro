import { Inter } from "next/font/google";

import { Img } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
            <Img src="img_group_1.svg" width={824} height={768} alt="Image" className="h-[768px] w-[62%] object-contain" />

    </main>
  );
}
