'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeRouter() {
  const router = useRouter();
  const { isLoaded, getToken, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const { setUser } = useAuth();

  useEffect(() => {
  if (!isLoaded) return;
  if (!isSignedIn) return router.replace('/signin');

    (async () => {
      try {
        const token = await getToken();
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/me';
        const resp = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        if (!resp.ok) throw new Error('Failed to fetch profile');
        const me = await resp.json();

        // Save to local mock context so existing UI can use it
        setUser(me);

        if (!me.role) {
          router.replace('/role-selection');
          return;
        }

        if (me.role === 'farmer') router.replace('/farmer/dashboard');
        else if (me.role === 'buyer') router.replace('/buyer/dashboard');
        else if (me.role === 'admin') router.replace('/admin/dashboard');
        else router.replace('/');
      } catch (e) {
        console.error(e);
        // If server fails, redirect to role-selection so user can continue onboarding in mock mode
        router.replace('/role-selection');
      }
    })();
  }, [isLoaded, isSignedIn, getToken, router, setUser]);

  return null;
}
