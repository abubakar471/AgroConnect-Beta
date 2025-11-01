'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeRouter() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return router.replace('/login');
    if (!currentUser?.role) return router.replace('/role-selection');
    if (currentUser.role === 'farmer') router.replace('/farmer/dashboard');
    else if (currentUser.role === 'buyer') router.replace('/buyer/dashboard');
    else if (currentUser.role === 'admin') router.replace('/admin/dashboard');
    else router.replace('/');
  }, [isAuthenticated, currentUser, router]);

  return null;
}
