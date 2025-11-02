'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Tractor, ShoppingCart, CheckCircle, Shield, Clock, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'farmer') router.push('/farmer/dashboard');
      else if (currentUser.role === 'buyer') router.push('/buyer/dashboard');
      else if (currentUser.role === 'admin') router.push('/admin/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Farmers',
      description: 'All farmers are verified with NID and farm videos for your trust'
    },
    {
      icon: Clock,
      title: 'Fresh Produce',
      description: 'Track harvest dates and shelf life for every batch'
    },
    {
      icon: Users,
      title: 'Direct Connection',
      description: 'Connect directly with farmers, no middlemen involved'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Cash on delivery with real-time order tracking'
    }
  ];

  return (
  <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to <span className="text-green-600">AgroConnect</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting farmers directly with buyers for fresh, quality produce. 
            No middlemen. Fair prices. Transparent transactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg h-14 px-8"
              onClick={() => router.push('/signup')}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-14 px-8"
              onClick={() => router.push('/admin/dashboard')}
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Access
            </Button>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Tractor className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">For Farmers</h2>
              <p className="text-gray-600">
                List your produce, get verified, and sell directly to buyers at fair prices
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Create product batches with batch tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Get verified to build buyer trust</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Receive real-time order notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Fair visibility with ADN rotation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">For Buyers</h2>
              <p className="text-gray-600">
                Browse fresh produce from verified farmers with complete batch information
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Browse verified farmer marketplace</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Check batch quality and harvest info</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Order directly from farms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Track your orders in real-time</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgroConnect?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-green-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join AgroConnect today and experience a better way to buy and sell fresh produce
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 text-lg h-14 px-8"
            onClick={() => router.push('/signin')}
          >
            Start Now - It's Free
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            © 2024 AgroConnect. Connecting farmers and buyers for a better agricultural future.
          </p>
        </div>
      </div>
    </div>
  );
}
