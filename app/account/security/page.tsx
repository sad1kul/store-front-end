"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { ApiError } from "@/lib/api/transport";
import { changePasswordApi, listSessionsApi, revokeOtherSessionsApi, revokeSessionApi, type AccountSession } from "@/lib/api/security";
import { toast } from "sonner";

const messageFor = (error: unknown) => error instanceof Error ? error.message : "Unable to complete the request.";

export default function AccountSecurityPage() {
  const { isAuthenticated, isInitializing, sessionEpoch, invalidateSession } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<AccountSession[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const loadSessions = useCallback(async () => {
    const epoch = useAuthStore.getState().sessionEpoch;
    try {
      const response = await listSessionsApi();
      if (useAuthStore.getState().sessionEpoch === epoch) {
        setSessions(response.data.sessions);
        setError("");
      }
    } catch (failure) {
      if (useAuthStore.getState().sessionEpoch === epoch) setError(messageFor(failure));
    } finally {
      if (useAuthStore.getState().sessionEpoch === epoch) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    void listSessionsApi().then((response) => {
      if (active) { setSessions(response.data.sessions); setError(""); }
    }).catch((failure: unknown) => {
      if (active) setError(messageFor(failure));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [isAuthenticated, sessionEpoch]);

  async function revoke(id?: string) {
    setBusy(true);
    setError("");
    try {
      if (id) await revokeSessionApi(id);
      else await revokeOtherSessionsApi();
      toast.success(id ? "Session signed out." : "Other sessions signed out.");
      await loadSessions();
    } catch (failure) {
      setError(messageFor(failure));
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmation) { setError("The new passwords do not match."); return; }
    if (new TextEncoder().encode(newPassword).length > 72) { setError("Choose a shorter password; the limit is 72 UTF-8 bytes."); return; }
    setBusy(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      invalidateSession();
      toast.success("Password changed. All sessions have been signed out.");
      router.replace("/login");
    } catch (failure) {
      setError(failure instanceof ApiError && failure.code === "VALIDATION_FAILED"
        ? "Use a new password of at least 12 characters and check the current password." : messageFor(failure));
    } finally {
      setBusy(false);
    }
  }

  if (isInitializing) {
    return <p className="p-8 text-center" role="status">Checking your session…</p>;
  }
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-bold">Account security</h1>
        <p className="mt-4">Sign in to manage your password and sessions.</p>
        <Link href="/login" className="mt-4 inline-block text-indigo-600 underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Account security</h1>
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Change password</h2>
        <p className="mt-2 text-sm text-slate-600">Changing your password signs you out on every device, including this one.</p>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1 block w-full rounded-lg border p-3"
            />
          </label>
          <label className="block text-sm font-medium">
            New password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1 block w-full rounded-lg border p-3"
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="mt-1 block w-full rounded-lg border p-3"
            />
          </label>
          <button disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
            Change password
          </button>
        </form>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Active sessions</h2>
        <p className="mt-2 text-sm text-slate-600">Up to 100 recent sessions are shown. Sign out other sessions if you do not recognize them.</p>
        <div className="my-4 flex gap-4">
          <button
            disabled={busy || loading}
            onClick={() => void revoke()}
            className="text-sm font-semibold text-rose-700 disabled:opacity-50"
          >
            Sign out other sessions
          </button>
          <button
            disabled={busy || loading}
            onClick={() => { setLoading(true); void loadSessions(); }}
            className="text-sm text-indigo-600 disabled:opacity-50"
          >
            Refresh sessions
          </button>
        </div>
        {loading ? (
          <p role="status">Loading sessions…</p>
        ) : sessions.length === 0 ? (
          <p>No sessions to display.</p>
        ) : (
          <ul className="divide-y">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{session.current ? "This session" : "Another session"}</p>
                  <p className="text-sm text-slate-600">Signed in {new Date(session.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Expires {new Date(session.expiresAt).toLocaleString()}</p>
                </div>
                {!session.current && (
                  <button
                    disabled={busy}
                    onClick={() => void revoke(session.id)}
                    className="text-sm text-rose-700 disabled:opacity-50"
                  >
                    Sign out
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
