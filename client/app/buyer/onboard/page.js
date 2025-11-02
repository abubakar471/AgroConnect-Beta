'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BuyerOnboardPage() {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({ name: currentUser.name || '', phone: currentUser.phone || '', location: currentUser.location || '' });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    updateUser({ name: form.name, phone: form.phone, location: form.location });

    // best-effort notify server
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/onboard';
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: form.name, phone: form.phone, location: form.location })
      });
    } catch (e) {
      // ignore
    }

    setLoading(false);
    router.push('/buyer/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Complete your profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} required />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
