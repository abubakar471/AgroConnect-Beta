'use client';

import { SignIn, SignUp } from '@clerk/nextjs';

export default function SignupPage() {
        return (
                <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 p-4">
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                                <SignUp
                                        appearance={{
                                                elements: {
                                                        formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                                                },
                                        }}
                                        // After successful sign-in, decide destination on /welcome
                                        afterSignUpUrl="/welcome"
                                        routing="path"
                                        signInUrl="/signin" // keep single entrypoint
                                />
                        </div>
                </div>
        );
}
