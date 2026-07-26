"use client";

import { useState } from "react";

export type Lead = { name: string; email: string; phone: string };

export default function LeadForm({
  onSubmit,
  loading,
}: {
  onSubmit: (lead: Lead) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
    >
      <h1 className="mb-1 text-xl font-semibold">Participe do quiz Quickspot</h1>
      <p className="mb-6 text-sm text-foreground/60">
        Preencha seus dados para começar. Quanto mais rápido e certeiro, maior a sua pontuação!
      </p>

      <label htmlFor="name" className="mb-1 block text-sm font-medium">
        Nome
      </label>
      <input
        id="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
      />

      <label htmlFor="email" className="mb-1 block text-sm font-medium">
        E-mail
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
      />

      <label htmlFor="phone" className="mb-1 block text-sm font-medium">
        Telefone
      </label>
      <input
        id="phone"
        type="tel"
        required
        placeholder="(11) 91234-5678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-6 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-coral"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-coral px-4 py-2 font-medium text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
      >
        {loading ? "Carregando..." : "Começar o quiz"}
      </button>
    </form>
  );
}
