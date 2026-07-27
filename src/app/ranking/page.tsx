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

      <div className="flex w-full max-w-2xl items-center gap-4 rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-sm">
        <Image
          src="/prize/nespresso.png"
          alt="Cafeteira Nespresso"
          width={160}
          height={160}
          className="h-24 w-24 object-contain"
        />
        <div>
          <p className="text-sm font-medium text-foreground/50">Prêmio para o 1º lugar</p>
          <p className="text-lg font-semibold">Cafeteira Nespresso</p>
        </div>
      </div>

      <RankingBoard />
    </main>
  );
}
