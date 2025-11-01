'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Bell,
  ShoppingCart,
  Search,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  LogOut,
  Filter,
  Clock,
  XCircle,
  Eye
} from 'lucide-react';
import { mockProducts, mockOrders, mockNotifications } from '@/lib/mockData';

export default function BuyerDashboard() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return router.replace('/login');
    if (currentUser?.role !== 'buyer') return router.replace('/');
    setProducts(mockProducts);
    const buyerOrders = mockOrders.filter(o => o.buyerId === currentUser.id || o.buyerId === currentUser.clerkId);
    const buyerNotifs = mockNotifications.filter(n => n.userId === currentUser.id || n.userId === currentUser.clerkId);
    setMyOrders(buyerOrders);
    setNotifications(buyerNotifs);

    const timer = setInterval(() => {
      setNotifications((prev) => [
        {
          id: `n_${Date.now()}`,
          userId: currentUser.id,
          type: 'info',
          title: 'Marketplace Update',
          message: 'New verified farmer joined in your area',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }, 25000);
    return () => clearInterval(timer);
  }, [isAuthenticated, currentUser, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

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
  const totalSpent = myOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrders.length}</div>
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
                Active Products
              </CardTitle>
              <Package className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Spent
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ৳{totalSpent.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="marketplace" className="space-y-4">
          <TabsList>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="orders">
              My Orders
              {pendingOrders.length > 0 && (
                <Badge className="ml-2 bg-orange-600">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products or farmers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap"
                      >
                        {category === 'all' ? 'All' : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {product.farmerLocation}
                          </CardDescription>
                        </div>
                        {product.farmerVerified && (
                          <Badge variant="default" className="bg-green-600 shrink-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Harvested: {new Date(product.harvestDate).toLocaleDateString()}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          ৳{product.pricePerUnit}
                        </span>
                        <span className="text-sm text-gray-500">/ {product.unit}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Available</p>
                          <p className="font-medium">{product.availableUnits} {product.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Grade</p>
                          <p className="font-medium">{product.qualityGrade}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => router.push(`/buyer/product/${product.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Batch: {product.batchCode}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {myOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <Button
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]');
                      const marketplaceTab = tabsList?.querySelector('[value="marketplace"]');
                      marketplaceTab?.click();
                    }}
                  >
                    Browse Marketplace
                  </Button>
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
                        <p className="text-sm text-gray-600">Farmer</p>
                        <p className="font-medium">{order.farmerName}</p>
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

                    {order.status === 'rejected' && order.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                        <p className="text-sm text-red-700 mt-1">{order.rejectionReason}</p>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          // Simulate delivery confirmation
                          alert('Delivery confirmed! Order marked as completed.');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Delivery
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
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
                <Card key={notif.id} className={!notif.read ? 'border-blue-200 bg-blue-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-blue-600" />
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
