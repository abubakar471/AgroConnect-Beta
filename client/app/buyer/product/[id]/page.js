'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  ShoppingCart,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { mockProducts } from '@/lib/mockData';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === params.id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [params.id]);

  const handlePlaceOrder = () => {
    if (quantity > 0 && quantity <= product.availableUnits) {
      // Simulate order placement
      setOrderPlaced(true);
      setTimeout(() => {
        router.push('/buyer/dashboard');
      }, 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Product not found</p>
            <Button
              className="mt-4"
              onClick={() => router.push('/buyer/dashboard')}
            >
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = quantity * product.pricePerUnit;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Order Placed!</h2>
            <p className="text-gray-600">
              Your order has been sent to {product.farmerName}.
              You'll receive a notification when they respond.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-green-600">৳{totalPrice}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/buyer/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-300" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 ring-green-500"
                >
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.farmerVerified && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Farmer
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Farmer Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{product.farmerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.farmerLocation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Batch Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Batch Code</p>
                    <p className="font-mono font-medium">{product.batchCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Harvest Date
                    </p>
                    <p className="font-medium">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Shelf Life
                    </p>
                    <p className="font-medium">{product.shelfLife}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quality Grade</p>
                    <Badge variant="outline">{product.qualityGrade}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-medium text-green-600">
                      {product.availableUnits} {product.unit}
                    </p>
                  </div>
                </div>

                {product.adminVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>This batch has been verified by admin</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing & Order */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">
                  ৳{product.pricePerUnit} / {product.unit}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity ({product.unit})</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 10))}
                    >
                      -10
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -1
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                      min={1}
                      max={product.availableUnits}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.min(product.availableUnits, quantity + 1))}
                    >
                      +1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.min(product.availableUnits, quantity + 10))}
                    >
                      +10
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Maximum: {product.availableUnits} {product.unit}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Method</span>
                    <span>Cash on Delivery</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">৳{totalPrice}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  onClick={handlePlaceOrder}
                  disabled={quantity < 1 || quantity > product.availableUnits}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Place Order
                </Button>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    The farmer will be notified immediately. You'll receive a notification
                    when they accept or reject your order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
