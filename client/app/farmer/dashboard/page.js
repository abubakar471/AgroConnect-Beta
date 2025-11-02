'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Package,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  LogOut,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { mockProducts, mockOrders, mockNotifications } from '@/lib/mockData';
import { useUser, useAuth as useClerkAuth, UserButton } from '@clerk/nextjs';

export default function FarmerDashboard() {
  const { user } = useUser();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [serverVerifications, setServerVerifications] = useState(null);
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, getToken } = useClerkAuth();

  useEffect(() => {
    // Wait until AuthContext finishes initializing from localStorage
    if (!isAuthenticated && !currentUser) {
      // if AuthContext hasn't initialized yet, don't redirect — let it finish
      return;
    }

    if (!isAuthenticated) return router.replace('/signin');
    if (currentUser?.role !== 'farmer') return router.replace('/');
    const farmerProducts = mockProducts.filter(p => p.farmerId === currentUser.id || p.farmerId === currentUser.clerkId);
    const farmerOrders = mockOrders.filter(o => o.farmerId === currentUser.id || o.farmerId === currentUser.clerkId);
    const farmerNotifs = mockNotifications.filter(n => n.userId === currentUser.id || n.userId === currentUser.clerkId);
    setMyProducts(farmerProducts);
    setMyOrders(farmerOrders);
    setNotifications(farmerNotifs);

    // Simulate live notifications every 20s for demo
    const timer = setInterval(() => {
      setNotifications((prev) => [
        {
          id: `n_${Date.now()}`,
          userId: currentUser.id,
          type: 'info',
          title: 'Reminder',
          message: 'Keep your product info up to date!',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev,
      ]);
    }, 20000);
    return () => clearInterval(timer);
  }, [isAuthenticated, currentUser, router]);

  // Fetch verification requests from server for the signed-in user (if Clerk available)
  useEffect(() => {
    if (!clerkLoaded) return;
    if (!clerkSignedIn) return;
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/users/verification';
        const resp = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        });
        if (!resp.ok) {
          // ignore server errors
          return;
        }
        const data = await resp.json();
        if (!mounted) return;
        setServerVerifications(data);
      } catch (err) {
        console.error('Failed to fetch server verifications', err);
      }
    })();
    return () => { mounted = false; };
  }, [clerkLoaded, clerkSignedIn]);

  const handleLogout = () => {
    logout();
    router.replace('/signin');
  };

  const handleAcceptOrder = (orderId) => {
    setMyOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'accepted', acceptedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleRejectOrder = (orderId) => {
    setMyOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'rejected', rejectedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'secondary', label: 'Pending', icon: Clock },
      accepted: { variant: 'default', label: 'Accepted', icon: CheckCircle },
      completed: { variant: 'default', label: 'Completed', icon: CheckCircle },
      rejected: { variant: 'destructive', label: 'Rejected', icon: XCircle }
    };

    const { variant, label, icon: Icon } = config[status] || config.pending;

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  if (!currentUser) {
    return null;
  }

  const pendingOrders = myOrders.filter(o => o.status === 'pending');
  const totalRevenue = myOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Farmer Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {!currentUser.verified && (
                <Button
                  onClick={() => router.push('/farmer/verification')}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Get Verified
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>

              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Verification Status Alert */}
        {(!currentUser.verified) && (() => {
          // detect pending verification from server (preferred) or local fallback
          const localVerifications = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('agroconnect_verifications') || '[]') : [];
          const serverList = (serverVerifications && serverVerifications.verifications) ? serverVerifications.verifications : [];
          const serverPending = serverList.find(v => v && v.status === 'pending');
          const myPending = serverPending || localVerifications.find(v => (v.farmerId === currentUser?.id || v.farmerId === currentUser?.clerkId) && v.status === 'pending');
          const isPending = currentUser?.verificationStatus === 'pending' || !!myPending;

          if (isPending) {
            return (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900">Verification Pending</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your verification request is pending review by our admin team. You'll be notified once it's reviewed.
                      </p>

                      {/* {myPending && (
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {myPending.nidFrontUrl && (
                            <a href={myPending.nidFrontUrl} target="_blank" rel="noreferrer" className="block">
                              <img src={myPending.nidFrontUrl} alt="NID front" className="w-full h-24 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">NID front</p>
                            </a>
                          )}
                          {myPending.nidBackUrl && (
                            <a href={myPending.nidBackUrl} target="_blank" rel="noreferrer" className="block">
                              <img src={myPending.nidBackUrl} alt="NID back" className="w-full h-24 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">NID back</p>
                            </a>
                          )}
                          {myPending.farmVideoUrl && (
                            <a href={myPending.farmVideoUrl} target="_blank" rel="noreferrer" className="block">
                              <div className="w-full h-24 bg-black rounded flex items-center justify-center text-white">View Video</div>
                              <p className="text-xs text-gray-500 mt-1">Farm video</p>
                            </a>
                          )}
                        </div>
                      )} */}

                      <div className="mt-3 flex gap-3">
                        <Button
                          className="bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => router.push('/farmer/verification')}
                        >
                          Update Verification
                        </Button>
                        <Button variant="outline" onClick={() => {
                          // allow farmer to resubmit by navigating to verification page
                          router.push('/farmer/verification');
                        }}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900">Verification Required</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      You need to verify your account before you can list products. Upload your NID and a short farm video to get started.
                    </p>
                    <Button
                      className="mt-3 bg-orange-600 hover:bg-orange-700"
                      onClick={() => router.push('/farmer/verification')}
                    >
                      Start Verification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProducts.length}</div>
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
                {pendingOrders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ৳{totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">
              Orders
              {pendingOrders.length > 0 && (
                <Badge className="ml-2 bg-orange-600">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {myOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              myOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.productName}</CardTitle>
                        <CardDescription>
                          Order #{order.id} • {order.batchCode}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Buyer</p>
                        <p className="font-medium">{order.buyerName}</p>
                        <p className="text-sm text-gray-500">{order.buyerPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Details</p>
                        <p className="font-medium">
                          {order.quantity} {order.unit} × ৳{order.pricePerUnit}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          Total: ৳{order.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ordered at</p>
                      <p className="text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Order
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleRejectOrder(order.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Product Batches</h3>
              {currentUser.verified && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push('/farmer/create-batch')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Batch
                </Button>
              )}
            </div>

            {myProducts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No products listed yet</p>
                  {currentUser.verified && (
                    <Button
                      onClick={() => router.push('/farmer/create-batch')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Your First Batch
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myProducts.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>{product.batchCode}</CardDescription>
                        </div>
                        {product.adminVerified && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Available</p>
                          <p className="font-medium">{product.availableUnits} {product.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-medium">৳{product.pricePerUnit}/{product.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Harvested</p>
                          <p className="font-medium text-xs">
                            {new Date(product.harvestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Shelf Life</p>
                          <p className="font-medium text-xs">{product.shelfLife}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notif) => (
                <Card key={notif.id} className={!notif.read ? 'border-green-200 bg-green-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{notif.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
