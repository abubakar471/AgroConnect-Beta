'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, CheckCircle, Image as ImageIcon, Calendar } from 'lucide-react';

export default function CreateBatchPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    batchCode: `BATCH-${Date.now()}`,
    harvestDate: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    availableUnits: '',
    unit: 'kg',
    pricePerUnit: '',
    shelfLife: '',
    qualityGrade: 'A'
  });
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser?.verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">Verification Required</h2>
            <p className="text-gray-600">
              You need to verify your account before creating product batches.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/farmer/dashboard')}
                className="flex-1"
              >
                Back to Dashboard
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => router.push('/farmer/verification')}
              >
                Get Verified
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
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
            <h2 className="text-2xl font-bold">Batch Created!</h2>
            <p className="text-gray-600">
              Your product batch has been created successfully and is now visible in the marketplace.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-1">
              <p className="text-sm text-gray-600">Batch Code</p>
              <p className="font-mono font-bold">{formData.batchCode}</p>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Create Product Batch</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add a new batch of produce to the marketplace
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fresh Tomatoes"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchCode">Batch Code</Label>
                <Input
                  id="batchCode"
                  value={formData.batchCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchCode: e.target.value }))}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">Unique identifier for this batch</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Quantity & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Quantity & Pricing</CardTitle>
              <CardDescription>Set availability and price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableUnits">Available Quantity</Label>
                  <Input
                    id="availableUnits"
                    type="number"
                    placeholder="500"
                    value={formData.availableUnits}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableUnits: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="ton">Tons</SelectItem>
                      <SelectItem value="piece">Pieces</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="liter">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per {formData.unit}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    placeholder="45"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Information */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Information</CardTitle>
              <CardDescription>Provide quality details for buyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shelfLife">Shelf Life</Label>
                  <Input
                    id="shelfLife"
                    placeholder="e.g., 7-10 days"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualityGrade">Quality Grade</Label>
                  <Select
                    value={formData.qualityGrade}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, qualityGrade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+ (Premium)</SelectItem>
                      <SelectItem value="A">A (Excellent)</SelectItem>
                      <SelectItem value="B">B (Good)</SelectItem>
                      <SelectItem value="C">C (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload up to 5 images of your batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium text-gray-700">Click to upload images</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {images.length} / 5 images uploaded
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black bg-opacity-50 rounded px-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
              disabled={images.length === 0}
            >
              <Upload className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
