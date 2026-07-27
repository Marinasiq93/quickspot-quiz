import Image from "next/image";
import RankingBoard from "@/components/ranking/RankingBoard";

export default function RankingPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-8 py-10">
      <Image
        src="/logo/logo-horizontal.png"
        alt="Quickspot"
        width={260}
        height={108}
        priority
        className="h-auto w-52"
      />

      <div className="grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/prize/nespresso.png"
            alt="Cafeteira Nespresso"
            width={480}
            height={480}
            priority
            className="h-auto w-full max-w-sm object-contain"
          />
          <p className="text-xl font-medium text-foreground/50">Prêmio para o 1º lugar</p>
          <p className="text-4xl font-extrabold">Cafeteira Nespresso</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-extrabold">Ranking ao vivo</h1>
          <RankingBoard />
        </div>
      </div>
    </main>
  );
}
