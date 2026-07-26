import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-3">
        <div className="flex items-center gap-8">
          <Image
            src="/logo/logo-horizontal.png"
            alt="Quickspot"
            width={140}
            height={58}
            className="h-8 w-auto"
          />
          <nav className="flex gap-5 text-sm font-medium">
            <Link href="/admin/questions" className="hover:text-coral">
              Perguntas
            </Link>
            <Link href="/admin/participants" className="hover:text-coral">
              Participantes
            </Link>
            <Link href="/ranking" className="hover:text-coral">
              Ranking ao vivo
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 bg-[#faf7f6] px-6 py-8">{children}</main>
    </div>
  );
}
