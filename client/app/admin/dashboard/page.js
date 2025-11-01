'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Users,
  Package,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  LogOut,
  TrendingUp,
  Clock,
  FileText,
  Video
} from 'lucide-react';
import {
  mockFarmers,
  mockBuyers,
  mockProducts,
  mockOrders,
  mockVerificationRequests,
  mockAdminStats
} from '@/lib/mockData';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [verifications, setVerifications] = useState(mockVerificationRequests);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return router.replace('/login');
    if (currentUser?.role !== 'admin') return router.replace('/');
  }, [isAuthenticated, currentUser, router]);

  const handleApproveVerification = (verificationId) => {
    setVerifications(prev =>
      prev.map(v =>
        v.id === verificationId
          ? { ...v, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'Admin' }
          : v
      )
    );
    setSelectedVerification(null);
  };

  const handleRejectVerification = (verificationId) => {
    setVerifications(prev =>
      prev.map(v =>
        v.id === verificationId
          ? { ...v, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'Admin' }
          : v
      )
    );
    setSelectedVerification(null);
  };

  const handleSendBroadcast = () => {
    if (broadcastMessage.trim()) {
      alert('Broadcast message sent to all users!');
      setBroadcastMessage('');
    }
  };

  const pendingVerifications = verifications.filter(v => v.status === 'pending');
  const pendingOrders = mockOrders.filter(o => o.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Control Tower</h1>
                <p className="text-purple-100">Monitor and manage AgroConnect platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => { logout(); router.push('/login'); }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Farmers
              </CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalFarmers}</div>
              <p className="text-xs text-green-600 mt-1">
                {mockAdminStats.verifiedFarmers} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Verifications
              </CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockAdminStats.pendingVerifications}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Buyers
              </CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalBuyers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Products
              </CardTitle>
              <Package className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Orders
              </CardTitle>
              <Clock className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockAdminStats.pendingOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed Orders
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockAdminStats.completedOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Orders
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockAdminStats.activeOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="verifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verifications">
              Farmer Verifications
              {pendingVerifications.length > 0 && (
                <Badge className="ml-2 bg-orange-600">{pendingVerifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">
              Order Monitoring
              {pendingOrders.length > 0 && (
                <Badge className="ml-2 bg-orange-600">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending verifications</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {pendingVerifications.map((verification) => (
                  <Card key={verification.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{verification.farmerName}</CardTitle>
                          <CardDescription>{verification.phone}</CardDescription>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Location</p>
                        <p className="font-medium">{verification.location}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submitted</p>
                        <p className="text-sm">
                          {new Date(verification.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Documents</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveVerification(verification.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleRejectVerification(verification.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* All Verifications */}
            {verifications.filter(v => v.status !== 'pending').length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Processed Verifications</h3>
                <div className="space-y-2">
                  {verifications
                    .filter(v => v.status !== 'pending')
                    .map((verification) => (
                      <Card key={verification.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{verification.farmerName}</p>
                              <p className="text-sm text-gray-600">{verification.location}</p>
                            </div>
                            <Badge
                              variant={verification.status === 'approved' ? 'default' : 'destructive'}
                              className={verification.status === 'approved' ? 'bg-green-600' : ''}
                            >
                              {verification.status === 'approved' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {verification.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.productName}</CardTitle>
                      <CardDescription>Order #{order.id}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className={order.status === 'completed' ? 'bg-green-600' : ''}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Farmer</p>
                      <p className="font-medium">{order.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Buyer</p>
                      <p className="font-medium">{order.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-medium text-green-600">৳{order.totalAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Farmers */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Farmers ({mockFarmers.length})
                </h3>
                <div className="space-y-2">
                  {mockFarmers.map((farmer) => (
                    <Card key={farmer.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{farmer.name}</p>
                            <p className="text-sm text-gray-600">{farmer.location}</p>
                          </div>
                          {farmer.verified ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Buyers */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Buyers ({mockBuyers.length})
                </h3>
                <div className="space-y-2">
                  {mockBuyers.map((buyer) => (
                    <Card key={buyer.id}>
                      <CardContent className="pt-6">
                        <div>
                          <p className="font-medium">{buyer.name}</p>
                          <p className="text-sm text-gray-600">{buyer.location}</p>
                          <p className="text-xs text-gray-500 mt-1">{buyer.businessType}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.farmerName}</CardDescription>
                      </div>
                      {product.adminVerified && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-medium">৳{product.pricePerUnit}/{product.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Available</p>
                        <p className="font-medium">{product.availableUnits} {product.unit}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Batch: {product.batchCode}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast">
            <Card>
              <CardHeader>
                <CardTitle>Broadcast Message</CardTitle>
                <CardDescription>
                  Send a message to all farmers and buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your broadcast message here..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={5}
                />
                <div className="flex gap-3">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSendBroadcast}
                    disabled={!broadcastMessage.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send to All Users
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBroadcastMessage('')}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
