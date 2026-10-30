"use client";

import Image from "next/image";
import { useEveAgent } from "eve/react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type AccessStatus = "checking" | "ready" | "needs-setup";

function encodeBasic(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `Basic ${btoa(binary)}`;
}

export function Workspace() {
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("checking");
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [activeView, setActiveView] = useState("writer");

  useEffect(() => {
    let active = true;
    fetch("/api/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { accessConfigured?: boolean }) => {
        if (active) {
          setAccessStatus(result.accessConfigured ? "ready" : "needs-setup");
        }
      })
      .catch(() => {
        if (active) setAccessStatus("needs-setup");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#beranda" aria-label="Ainov beranda">
          <span className="brand-mark">a</span>
          <span>ainov</span>
          <span className="brand-beta">ruang kerja</span>
        </a>

        <div className="side-label">RUANG KERJA</div>
        <button
          className={`nav-item ${activeView === "writer" ? "selected" : ""}`}
          onClick={() => setActiveView("writer")}
          type="button"
        >
          <span className="nav-icon">✎</span> Penulis baru
        </button>
        <button
          className={`nav-item ${activeView === "library" ? "selected" : ""}`}
          onClick={() => setActiveView("library")}
          type="button"
        >
          <span className="nav-icon">▤</span> Ruang tulisan
        </button>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="plan-kicker">AINOV PRIBADI</span>
            <p>Tempat menyusun gagasan, merapikan draf, dan menemukan suara tulisan.</p>
          </div>
          <div className="profile-row">
            <span className="avatar">A</span>
            <span><strong>Ruang pribadi</strong><small>Eksperimen Ainov</small></span>
            <span className="more">···</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <span className="breadcrumb">Ruang kerja <span>/</span> {activeView === "writer" ? "Penulis baru" : "Ruang tulisan"}</span>
          <span className="private-badge"><i /> Pribadi</span>
        </header>

        {activeView === "writer" ? (
          <div className="content">
            <div className="intro">
              <div className="intro-heading">
                <Image
                  alt="Logo Ainov"
                  className="intro-logo"
                  height={96}
                  src="/ainov.png"
                  width={96}
                />
                <div>
                  <p className="eyebrow">RUANG MENULIS AINOV</p>
                  <h1>Gagasanmu, dirangkai dengan lebih jernih.</h1>
                </div>
              </div>
              <p className="intro-copy">Ceritakan apa yang ingin kamu tulis. Kita kembangkan bersama sampai terasa pas.</p>
            </div>

            <div className="writer-card">
              {accessStatus === "needs-setup" ? (
                <SetupNotice />
              ) : accessStatus === "checking" ? (
                <div className="checking-state">Menyiapkan ruang menulis…</div>
              ) : credentials ? (
                <WritingChat
                  credentials={credentials}
                  onSignOut={() => setCredentials(null)}
                />
              ) : (
                <SignIn onSignIn={setCredentials} />
              )}
            </div>

            <div className="prompt-row" aria-label="Contoh kebutuhan menulis">
              <span className="prompt-title">MULAI DARI</span>
              <span className="prompt-chip">✦ Artikel dan opini</span>
              <span className="prompt-chip">◌ Narasi dan cerita</span>
              <span className="prompt-chip">↗ Revisi tulisan</span>
              <span className="prompt-chip">▤ Ringkasan</span>
            </div>
          </div>
        ) : (
          <div className="content library-view">
            <p className="eyebrow">ARSIP PRIBADI</p>
            <h1>Ruang tulisan</h1>
            <p className="intro-copy">Riwayat dan penyimpanan draf menjadi tahap berikutnya. Sesi yang dibuat Ainov akan disimpan oleh runtime agen.</p>
            <div className="library-placeholder"><span>▤</span><strong>Belum ada arsip</strong><small>Mulai percakapan di Penulis baru untuk mengembangkan draf pertama.</small></div>
          </div>
        )}
      </section>
    </main>
  );
}

function SetupNotice() {
  return (
    <div className="setup-notice">
      <div className="notice-icon">⌑</div>
      <div>
        <strong>Ainov sedang menyiapkan akses pribadi</strong>
        <p>Isi AINOV_USERNAME dan AINOV_PASSWORD pada pengaturan Environment Variables proyek Vercel, lalu redeploy.</p>
      </div>
    </div>
  );
}

function SignIn({
  onSignIn,
}: {
  onSignIn: (credentials: { username: string; password: string }) => void;
}) {
  const [username, setUsername] = useState("ainov");
  const [password, setPassword] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) return;
    onSignIn({ username: username.trim(), password });
  }

  return (
    <form className="signin-form" onSubmit={submit}>
      <div className="card-heading">
        <span className="sparkle">✦</span>
        <div>
          <h2>Masuk ke ruang menulis</h2>
          <p>Akses ini menjaga sesi penulisanmu tetap pribadi.</p>
        </div>
      </div>
      <label htmlFor="ainov-username">Nama pengguna</label>
      <input id="ainov-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
      <label htmlFor="ainov-password">Kata sandi</label>
      <input id="ainov-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-button signin-button" type="submit">Masuk dan mulai <span>→</span></button>
      <p className="credential-hint">Kredensial ditetapkan di pengaturan proyek Vercel dan hanya disimpan di memori browser selama sesi ini.</p>
    </form>
  );
}

function WritingChat({
  credentials,
  onSignOut,
}: {
  credentials: { username: string; password: string };
  onSignOut: () => void;
}) {
  const authorization = useMemo(
    () => encodeBasic(credentials.username, credentials.password),
    [credentials.password, credentials.username],
  );
  const agent = useEveAgent({
    headers: () => ({ Authorization: authorization }),
  });
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");
  const busy = agent.status === "busy" || agent.status === "resuming";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy) return;
    setSendError("");
    setDraft("");
    try {
      await agent.send(message);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Pesan belum terkirim.");
    }
  }

  const errorText = sendError || agent.error?.message;

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <div className="card-heading">
          <span className="sparkle">✦</span>
          <div><h2>Ainov</h2><p>Agen penulis pribadimu</p></div>
        </div>
        <div className="chat-header-actions">
          <span className="connection-state"><i /> Siap menulis</span>
          <button className="quiet-button" onClick={() => void agent.newSession()} type="button">Percakapan baru</button>
          <button className="quiet-button" onClick={onSignOut} type="button">Keluar</button>
        </div>
      </div>

      <div className="messages" aria-live="polite">
        {agent.messages.length === 0 ? (
          <div className="welcome-message">
            <span className="welcome-mark">a</span>
            <h3>Apa yang ingin kamu tulis hari ini?</h3>
            <p>Kirim ide, tujuan tulisan, atau draf awal. Ainov akan membantu membentuknya dengan alur yang natural.</p>
            <div className="example-prompts">
              <button type="button" onClick={() => setDraft("Saya ingin menulis artikel tentang …")}>Mulai dari sebuah ide <span>↗</span></button>
              <button type="button" onClick={() => setDraft("Bantu saya merapikan tulisan ini tanpa mengubah maksudnya:\n\n")}>Rapikan sebuah draf <span>↗</span></button>
              <button type="button" onClick={() => setDraft("Buat narasi yang terasa hangat dan mengalir tentang …")}>Bangun sebuah narasi <span>↗</span></button>
            </div>
          </div>
        ) : (
          agent.messages.map((message) => (
            <article className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`} key={message.id}>
              <div className="message-avatar">{message.role === "user" ? "K" : "a"}</div>
              <div className="message-body">
                <span className="message-author">{message.role === "user" ? "Kamu" : "Ainov"}</span>
                {message.parts.map((part, index) =>
                  part.type === "text" ? <p key={part.id ?? index}>{part.text}</p> : null,
                )}
              </div>
            </article>
          ))
        )}
        {busy && <div className="typing-indicator"><span /><span /><span /> Ainov sedang menyusun kata…</div>}
        {errorText && <div className="error-message">{errorText} <button type="button" onClick={onSignOut}>Periksa akses</button></div>}
      </div>

      <form className="composer" onSubmit={submit}>
        <p className="model-disclosure">Model NVIDIA gratis dapat mencatat prompt dan jawaban untuk peningkatan produk. Jangan kirim informasi rahasia.</p>
        <textarea
          aria-label="Pesan untuk Ainov"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Tulis gagasan atau arahanmu…"
          rows={2}
          value={draft}
        />
        <div className="composer-footer">
          <span>Shift + Enter untuk baris baru</span>
          <button className="primary-button send-button" disabled={!draft.trim() || busy} type="submit">
            {busy ? "Menyusun…" : "Kirim"} <span>↑</span>
          </button>
        </div>
      </form>
    </div>
  );
}
