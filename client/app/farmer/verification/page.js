'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, CheckCircle, Video, FileText } from 'lucide-react';

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
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate submission
    setTimeout(() => {
      // In real app, upload files and submit verification request
      setSubmitted(true);
      updateUser({
        location: formData.location,
        farmSize: formData.farmSize,
        specialization: formData.specialization,
        verified: true
      });
    }, 1000);
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
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size</Label>
                <Input
                  id="farmSize"
                  placeholder="e.g., 5 acres"
                  value={formData.farmSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Textarea
                  id="specialization"
                  placeholder="What do you grow? e.g., Vegetables, Rice, Fruits"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
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
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!files.nidFront || !files.nidBack || !files.farmVideo}
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit for Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
