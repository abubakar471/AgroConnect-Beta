'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockFarmers, mockBuyers } from '@/lib/mockData';
import { Phone, Shield, Check } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const sendCode = (e) => {
        e.preventDefault();
        if (!phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        setError('');
        setStep('otp');
    };

    const verifyCode = (e) => {
        e.preventDefault();
        if (otp !== '1234') {
            setError('Invalid code. Use 1234 for demo');
            return;
        }
        const res = login(phone.trim());
        if (res.isNewUser) {
            // Let the user pick a role
            router.push('/role-selection');
        } else if (res.user.role === 'farmer') {
            router.push('/farmer/dashboard');
        } else if (res.user.role === 'buyer') {
            router.push('/buyer/dashboard');
        } else if (res.user.role === 'admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to AgroConnect</CardTitle>
                    <CardDescription>Demo login with OTP (use 1234)</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'phone' ? (
                        <form onSubmit={sendCode} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="phone"
                                        placeholder="e.g., +880 1712-345678"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Send Code</Button>
                            <div className="text-xs text-gray-500">
                                Tip: Use one of the mock numbers like {mockFarmers[0].phone} or {mockBuyers[0].phone}
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={verifyCode} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter 4-digit code</Label>
                                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" maxLength={4} />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Verify & Continue</Button>
                            <Button type="button" variant="outline" className="w-full" onClick={() => setStep('phone')}>Change phone</Button>
                        </form>
                    )}

                    <div className="mt-6">
                        <p className="text-xs text-gray-500 mb-2">Quick access</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" onClick={() => { setPhone(mockFarmers[0].phone); setStep('otp'); }}>
                                Farmer
                            </Button>
                            <Button variant="outline" onClick={() => { setPhone(mockBuyers[0].phone); setStep('otp'); }}>
                                Buyer
                            </Button>
                            <Button variant="outline" onClick={() => { setPhone('+880 1000-000000'); setStep('otp'); }}>
                                New User
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 p-3 rounded bg-gray-50 text-xs text-gray-600 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5" />
                        <div>
                            This is a mock prototype. No real SMS is sent. Use code <span className="font-semibold">1234</span> to continue.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
