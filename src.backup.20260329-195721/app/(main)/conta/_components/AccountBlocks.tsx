import { ChevronRight } from "lucide-react";
import Link from "next/link";

type ActionLinkProps = {
  label: string;
  href: string;
};

export function ActionLink({ label, href }: ActionLinkProps) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center justify-between rounded-lg py-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
    >
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

type InfoCardProps = {
  children: React.ReactNode;
};

export function InfoCard({ children }: InfoCardProps) {
  return <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">{children}</article>;
}
