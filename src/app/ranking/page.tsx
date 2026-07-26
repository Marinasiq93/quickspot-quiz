import Image from "next/image";
import RankingBoard from "@/components/ranking/RankingBoard";

export default function RankingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-12">
      <Image
        src="/logo/logo-horizontal.png"
        alt="Quickspot"
        width={260}
        height={108}
        priority
        className="h-auto w-52"
      />
      <h1 className="text-3xl font-extrabold">Ranking ao vivo</h1>
      <RankingBoard />
    </main>
  );
}
