"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SSOCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const after = params.get('after_sign_in_url') || params.get('afterSignInUrl') || '/welcome';
      const dest = decodeURIComponent(after);
      // Ensure we replace history so user doesn't go back to the callback URL
      router.replace(dest);
    } catch (err) {
      router.replace('/welcome');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg font-medium">Signing you in…</p>
        <p className="text-sm text-gray-500 mt-2">If you are not redirected, <a href="/welcome" className="text-blue-600 underline">click here</a>.</p>
      </div>
    </div>
  );
}
