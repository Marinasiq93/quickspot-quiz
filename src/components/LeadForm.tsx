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
  const [checking, setChecking] = useState(false);
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    if (duplicateConfirmed) setDuplicateConfirmed(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCheckError(null);

    const lead = { name: name.trim(), email: email.trim(), phone: phone.trim() };

    if (duplicateConfirmed) {
      onSubmit(lead);
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`/api/quiz/check-email?email=${encodeURIComponent(lead.email)}`);
      const data = await res.json();
      if (data.alreadyParticipated) {
        setDuplicateConfirmed(true);
      } else {
        onSubmit(lead);
      }
    } catch {
      // If the check fails, don't block the participant — proceed normally.
      onSubmit(lead);
    } finally {
      setChecking(false);
    }
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
        onChange={(e) => handleEmailChange(e.target.value)}
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

      {duplicateConfirmed && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Este e-mail já participou do quiz antes. Você pode continuar mesmo assim, mas a organização será avisada.
        </p>
      )}
      {checkError && <p className="mb-4 text-sm text-red-600">{checkError}</p>}

      <button
        type="submit"
        disabled={loading || checking}
        className="w-full rounded-lg bg-coral px-4 py-2 font-medium text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
      >
        {checking
          ? "Verificando..."
          : loading
            ? "Carregando..."
            : duplicateConfirmed
              ? "Continuar mesmo assim"
              : "Começar o quiz"}
      </button>
    </form>
  );
}
