"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, CheckCircle, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';

export default function FarmerVerificationPage() {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    location: '',
    farmSize: '',
    specialization: ''
  });
  const [files, setFiles] = useState({
    nidFront: null,
    nidBack: null,
    farmVideo: null
  });
  const [existingRequest, setExistingRequest] = useState(null);
  const [existingMedia, setExistingMedia] = useState({ nidFrontUrl: null, nidBackUrl: null, farmVideoUrl: null });
  const [isDirty, setIsDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, getToken } = useClerkAuth();

  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      setIsDirty(true);
    }
  };
  // Prefill form from current user only when user hasn't edited fields
  useEffect(() => {
    if (!isDirty && currentUser) {
      setFormData(prev => ({
        ...prev,
        location: currentUser.location || prev.location,
        farmSize: currentUser.farmSize || prev.farmSize,
        specialization: currentUser.specialization || prev.specialization
      }));
    }
  }, [currentUser, isDirty]);

  // Fetch existing verification from server once when Clerk session is ready
  useEffect(() => {
    if (!clerkLoaded) return;
    if (!clerkSignedIn) return;

    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/verification';
        const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
        if (!resp.ok) return;
        const data = await resp.json();
        if (!mounted) return;
        if (data && Array.isArray(data.verifications) && data.verifications.length > 0) {
          const latest = data.verifications[0];
          setExistingRequest(latest);
          setExistingMedia({ nidFrontUrl: latest.nidFrontUrl, nidBackUrl: latest.nidBackUrl, farmVideoUrl: latest.farmVideoUrl });
          // update local user verificationStatus only if not already pending
          if (currentUser && currentUser.verificationStatus !== 'pending' && latest.status === 'pending') {
            updateUser({ verificationStatus: latest.status || 'pending' });
          }
        }
      } catch (err) {
        console.error('fetch existing verification error', err);
      }
    })();

    return () => { mounted = false; };
  }, [clerkLoaded, clerkSignedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate submission
    (async () => {
      setUploading(true);
      try {
        // Upload files to Cloudinary (unsigned preset)
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

        const upload = async (file) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('upload_preset', uploadPreset);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: 'POST',
            body: fd
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error?.message || 'Cloudinary upload failed');
          return data.secure_url;
        };

        // If existing media exists and user didn't choose a new file, reuse existing URL
        let nidFrontUrl = existingMedia.nidFrontUrl || null;
        let nidBackUrl = existingMedia.nidBackUrl || null;
        let farmVideoUrl = existingMedia.farmVideoUrl || null;

        if (files.nidFront) nidFrontUrl = await upload(files.nidFront);
        if (files.nidBack) nidBackUrl = await upload(files.nidBack);
        if (files.farmVideo) farmVideoUrl = await upload(files.farmVideo);

        // First, attempt to send onboarding profile to server (best-effort)
        try {
          const onboardUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/onboard';
          // include token when available
          let headers = { 'Content-Type': 'application/json' };
          try {
            if (clerkLoaded && clerkSignedIn && getToken) {
              const token = await getToken();
              if (token) headers.Authorization = `Bearer ${token}`;
            }
          } catch (e) {}

          await fetch(onboardUrl, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ name: currentUser?.name, phone: currentUser?.phone, location: formData.location, farmSize: formData.farmSize, specialization: formData.specialization })
          });
        } catch (e) {
          // ignore
        }

        // Send verification request to server - update if existing
        const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/verification';
        const payload = { nidFrontUrl, nidBackUrl, farmVideoUrl };

        let sent = false;
        try {
          let resp;
          // include token when available
          let headers = { 'Content-Type': 'application/json' };
          try {
            if (clerkLoaded && clerkSignedIn && getToken) {
              const token = await getToken();
              if (token) headers.Authorization = `Bearer ${token}`;
            }
          } catch (e) {}

          if (existingRequest && existingRequest._id) {
            resp = await fetch(`${baseApi}/${existingRequest._id}`, {
              method: 'PUT',
              headers,
              credentials: 'include',
              body: JSON.stringify(payload)
            });
          } else {
            resp = await fetch(baseApi, {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify(payload)
            });
          }

          if (resp.ok) sent = true;
        } catch (e) {
          // ignore; we'll fallback to local save
        }

        // Update mock user locally to reflect verification requested
        updateUser({
          location: formData.location,
          farmSize: formData.farmSize,
          specialization: formData.specialization,
          verificationStatus: 'pending'
        });

        // If server not reachable, persist request in localStorage for demo
        if (!sent) {
          const existing = JSON.parse(localStorage.getItem('agroconnect_verifications') || '[]');
          existing.push({ id: `v_${Date.now()}`, farmerId: currentUser?.id || currentUser?.clerkId || 'local', nidFrontUrl, nidBackUrl, farmVideoUrl, status: 'pending', submittedAt: new Date().toISOString() });
          localStorage.setItem('agroconnect_verifications', JSON.stringify(existing));
        }

        setSubmitted(true);
        toast.success('Verification submitted — admin will review it.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to submit verification. Try again.');
      } finally {
        setUploading(false);
      }
    })();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Verification Submitted!</h2>
            <p className="text-gray-600">
              Your verification request has been submitted successfully. 
              Our admin team will review it within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive a notification once your account is verified.
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/farmer/dashboard')}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/farmer/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Verification</h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete your verification to start listing products
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farm Information */}
          <Card>
            <CardHeader>
              <CardTitle>Farm Information</CardTitle>
              <CardDescription>Tell us about your farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Farm Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Jessore, Khulna"
                  value={formData.location}
                  onChange={(e) => { setIsDirty(true); setFormData(prev => ({ ...prev, location: e.target.value })); }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size</Label>
                <Input
                  id="farmSize"
                  placeholder="e.g., 5 acres"
                  value={formData.farmSize}
                  onChange={(e) => { setIsDirty(true); setFormData(prev => ({ ...prev, farmSize: e.target.value })); }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Textarea
                  id="specialization"
                  placeholder="What do you grow? e.g., Vegetables, Rice, Fruits"
                  value={formData.specialization}
                  onChange={(e) => { setIsDirty(true); setFormData(prev => ({ ...prev, specialization: e.target.value })); }}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* NID Upload */}
          <Card>
            <CardHeader>
              <CardTitle>National ID Verification</CardTitle>
              <CardDescription>Upload clear photos of your NID (both sides)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nidFront">NID Front Side</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    id="nidFront"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('nidFront', e)}
                    className="hidden"
                  />
                  <label htmlFor="nidFront" className="cursor-pointer">
                    {files.nidFront ? (
                      <div className="text-green-600">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">{files.nidFront.name}</p>
                      </div>
                    ) : existingMedia.nidFrontUrl ? (
                      <div className="text-gray-700">
                        <img src={existingMedia.nidFrontUrl} alt="NID front" className="mx-auto mb-2 w-32 h-20 object-cover rounded" />
                        <p className="text-sm text-gray-500">Uploaded NID front</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">Click to upload NID front</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nidBack">NID Back Side</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    id="nidBack"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('nidBack', e)}
                    className="hidden"
                  />
                  <label htmlFor="nidBack" className="cursor-pointer">
                    {files.nidBack ? (
                      <div className="text-green-600">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">{files.nidBack.name}</p>
                      </div>
                    ) : existingMedia.nidBackUrl ? (
                      <div className="text-gray-700">
                        <img src={existingMedia.nidBackUrl} alt="NID back" className="mx-auto mb-2 w-32 h-20 object-cover rounded" />
                        <p className="text-sm text-gray-500">Uploaded NID back</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">Click to upload NID back</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Video */}
          <Card>
            <CardHeader>
              <CardTitle>Farm Video Introduction</CardTitle>
              <CardDescription>
                Record a short 20-30 second video showing your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="farmVideo">Upload Farm Video</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    id="farmVideo"
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange('farmVideo', e)}
                    className="hidden"
                  />
                  <label htmlFor="farmVideo" className="cursor-pointer">
                    {files.farmVideo ? (
                      <div className="text-green-600">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                        <p className="font-medium">{files.farmVideo.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(files.farmVideo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : existingMedia.farmVideoUrl ? (
                      <div className="text-gray-700">
                        <div className="w-full h-24 bg-black rounded flex items-center justify-center text-white">View Video</div>
                        <p className="text-sm text-gray-500 mt-1">Uploaded farm video</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <Video className="w-12 h-12 mx-auto mb-3" />
                        <p className="font-medium">Click to upload farm video</p>
                        <p className="text-sm text-gray-500 mt-1">MP4, MOV up to 50MB</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Show your farm, introduce yourself, and show what you grow
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/farmer/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              disabled={uploading || !(files.nidFront || existingMedia.nidFrontUrl) || !(files.nidBack || existingMedia.nidBackUrl) || !(files.farmVideo || existingMedia.farmVideoUrl)}
            >
              {uploading ? <Spinner className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 mr-2" />}
              {existingRequest ? 'Update Verification' : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
