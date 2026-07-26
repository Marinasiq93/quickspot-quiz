import Image from "next/image";
import QuizFlow from "@/components/QuizFlow";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Image
        src="/logo/logo-horizontal.png"
        alt="Quickspot"
        width={220}
        height={92}
        priority
        className="h-auto w-44"
      />
      <QuizFlow />
    </main>
  );
}
