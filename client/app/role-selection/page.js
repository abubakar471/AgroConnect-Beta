'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tractor, ShoppingCart, Check } from 'lucide-react';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, currentUser, selectRole } = useAuth();
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, getToken } = useClerkAuth();

  useEffect(() => {
    // Don't auto-redirect away while the user is on the role selection page
    if (isAuthenticated && currentUser && currentUser.role) {
      try {
        if (typeof window !== 'undefined' && window.location.pathname === '/role-selection') return;
      } catch (e) {}
      router.replace('/');
    }
  }, [isAuthenticated, currentUser, router]);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!selectedRole || !name) return;

    setLoading(true);
    // Use phone from localStorage temp value if created during mock login
    const saved = localStorage.getItem('agroconnect_user');
    let phone = '';
    try { phone = saved ? JSON.parse(saved).phone : ''; } catch {}
    const user = selectRole(phone || '+880 1000-000000', selectedRole, name);
    // Try to inform backend (if running). If Clerk is signed-in include token; otherwise attempt without auth and ignore errors.
    (async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/role';
        let headers = { 'Content-Type': 'application/json' };
        // If Clerk is available and signed-in, include Authorization header
        try {
          if (clerkLoaded && clerkSignedIn && getToken) {
            const token = await getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          // ignore clerk errors in environments without Clerk
        }

        await fetch(apiUrl, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ role: selectedRole, name })
        });
      } catch (e) {
        // ignore network/backend errors for mock flow
      }
    })();

    setLoading(false);
    if (user.role === 'farmer') router.replace('/farmer/verification');
    else router.replace('/buyer/dashboard');
  };

  const roles = [
    {
      id: 'farmer',
      title: 'I am a Farmer',
      description: 'I want to sell my produce directly to buyers',
      icon: Tractor,
      benefits: [
        'List your products and batches',
        'Get verified to build trust',
        'Receive orders in real-time',
        'Fair pricing and visibility'
      ],
      color: 'green'
    },
    {
      id: 'buyer',
      title: 'I am a Buyer',
      description: 'I want to buy fresh produce from verified farmers',
      icon: ShoppingCart,
      benefits: [
        'Browse verified farmers',
        'Check batch quality info',
        'Order directly from farms',
        'Track your orders'
      ],
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-900">
            Choose Your Role
          </h1>
          <p className="text-gray-600">
            Let us know how you'd like to use AgroConnect
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? `ring-2 ring-${role.color}-600 border-${role.color}-600`
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-full bg-${role.color}-100 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${role.color}-600`} />
                      </div>
                      {isSelected && (
                        <div className={`w-6 h-6 rounded-full bg-${role.color}-600 flex items-center justify-center`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {role.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className={`w-4 h-4 text-${role.color}-600 mt-0.5 shrink-0`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedRole && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading || !name}
                  >
                    {loading ? 'Creating Account...' : 'Continue'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
