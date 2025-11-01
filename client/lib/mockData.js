// Mock data for AgroConnect MVP

export const mockFarmers = [
  {
    id: 'f1',
    clerkId: 'clerk_farmer_1',
    name: 'Karim Rahman',
    role: 'farmer',
    verified: true,
    phone: '+880 1712-345678',
    location: 'Jessore, Khulna',
    district: 'Jessore',
    joinedDate: '2024-10-15',
    profileImage: '/api/placeholder/150/150',
    farmSize: '5 acres',
    specialization: 'Vegetables'
  },
  {
    id: 'f2',
    clerkId: 'clerk_farmer_2',
    name: 'Abdul Jabbar',
    role: 'farmer',
    verified: true,
    phone: '+880 1812-345679',
    location: 'Comilla, Chittagong',
    district: 'Comilla',
    joinedDate: '2024-09-20',
    profileImage: '/api/placeholder/150/150',
    farmSize: '8 acres',
    specialization: 'Rice & Vegetables'
  },
  {
    id: 'f3',
    clerkId: 'clerk_farmer_3',
    name: 'Rahim Mia',
    role: 'farmer',
    verified: false,
    phone: '+880 1912-345680',
    location: 'Bogura, Rajshahi',
    district: 'Bogura',
    joinedDate: '2024-10-28',
    profileImage: '/api/placeholder/150/150',
    farmSize: '3 acres',
    specialization: 'Fruits'
  }
];

export const mockBuyers = [
  {
    id: 'b1',
    clerkId: 'clerk_buyer_1',
    name: 'Shahed Ahmed',
    role: 'buyer',
    verified: true,
    phone: '+880 1612-345681',
    location: 'Dhaka, Dhaka',
    businessType: 'Retail Shop',
    joinedDate: '2024-10-10'
  },
  {
    id: 'b2',
    clerkId: 'clerk_buyer_2',
    name: 'Fatima Begum',
    role: 'buyer',
    verified: true,
    phone: '+880 1512-345682',
    location: 'Chittagong, Chittagong',
    businessType: 'Restaurant',
    joinedDate: '2024-09-25'
  }
];

export const mockProducts = [
  {
    id: 'p1',
    farmerId: 'f1',
    farmerName: 'Karim Rahman',
    farmerLocation: 'Jessore, Khulna',
    farmerVerified: true,
    name: 'Fresh Tomatoes',
    batchCode: 'TOM-2024-001',
    harvestDate: '2024-10-28',
    description: 'Organic red tomatoes, freshly harvested',
    category: 'Vegetables',
    availableUnits: 500,
    unit: 'kg',
    pricePerUnit: 45,
    currency: 'BDT',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    shelfLife: '7-10 days',
    qualityGrade: 'A',
    adminVerified: true,
    createdAt: '2024-10-28T08:00:00Z'
  },
  {
    id: 'p2',
    farmerId: 'f1',
    farmerName: 'Karim Rahman',
    farmerLocation: 'Jessore, Khulna',
    farmerVerified: true,
    name: 'Green Chili',
    batchCode: 'CHI-2024-002',
    harvestDate: '2024-10-27',
    description: 'Hot green chilies, perfect for cooking',
    category: 'Vegetables',
    availableUnits: 200,
    unit: 'kg',
    pricePerUnit: 80,
    currency: 'BDT',
    images: ['/api/placeholder/400/300'],
    shelfLife: '5-7 days',
    qualityGrade: 'A',
    adminVerified: true,
    createdAt: '2024-10-27T10:00:00Z'
  },
  {
    id: 'p3',
    farmerId: 'f2',
    farmerName: 'Abdul Jabbar',
    farmerLocation: 'Comilla, Chittagong',
    farmerVerified: true,
    name: 'Fresh Potatoes',
    batchCode: 'POT-2024-003',
    harvestDate: '2024-10-25',
    description: 'High-quality potatoes, ideal for wholesale',
    category: 'Vegetables',
    availableUnits: 1000,
    unit: 'kg',
    pricePerUnit: 30,
    currency: 'BDT',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    shelfLife: '30-45 days',
    qualityGrade: 'A+',
    adminVerified: true,
    createdAt: '2024-10-25T07:00:00Z'
  },
  {
    id: 'p4',
    farmerId: 'f2',
    farmerName: 'Abdul Jabbar',
    farmerLocation: 'Comilla, Chittagong',
    farmerVerified: true,
    name: 'Cauliflower',
    batchCode: 'CAU-2024-004',
    harvestDate: '2024-10-29',
    description: 'Fresh white cauliflower, premium quality',
    category: 'Vegetables',
    availableUnits: 300,
    unit: 'kg',
    pricePerUnit: 50,
    currency: 'BDT',
    images: ['/api/placeholder/400/300'],
    shelfLife: '7-10 days',
    qualityGrade: 'A',
    adminVerified: true,
    createdAt: '2024-10-29T06:00:00Z'
  }
];

export const mockOrders = [
  {
    id: 'o1',
    buyerId: 'b1',
    buyerName: 'Shahed Ahmed',
    buyerPhone: '+880 1612-345681',
    farmerId: 'f1',
    farmerName: 'Karim Rahman',
    productId: 'p1',
    productName: 'Fresh Tomatoes',
    batchCode: 'TOM-2024-001',
    quantity: 50,
    unit: 'kg',
    pricePerUnit: 45,
    totalAmount: 2250,
    status: 'pending',
    createdAt: '2024-10-30T09:00:00Z',
    updatedAt: '2024-10-30T09:00:00Z'
  },
  {
    id: 'o2',
    buyerId: 'b1',
    buyerName: 'Shahed Ahmed',
    buyerPhone: '+880 1612-345681',
    farmerId: 'f2',
    farmerName: 'Abdul Jabbar',
    productId: 'p3',
    productName: 'Fresh Potatoes',
    batchCode: 'POT-2024-003',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 30,
    totalAmount: 6000,
    status: 'accepted',
    createdAt: '2024-10-29T14:00:00Z',
    updatedAt: '2024-10-29T15:00:00Z',
    acceptedAt: '2024-10-29T15:00:00Z'
  },
  {
    id: 'o3',
    buyerId: 'b2',
    buyerName: 'Fatima Begum',
    buyerPhone: '+880 1512-345682',
    farmerId: 'f1',
    farmerName: 'Karim Rahman',
    productId: 'p2',
    productName: 'Green Chili',
    batchCode: 'CHI-2024-002',
    quantity: 30,
    unit: 'kg',
    pricePerUnit: 80,
    totalAmount: 2400,
    status: 'completed',
    createdAt: '2024-10-28T11:00:00Z',
    updatedAt: '2024-10-29T16:00:00Z',
    acceptedAt: '2024-10-28T12:00:00Z',
    completedAt: '2024-10-29T16:00:00Z'
  },
  {
    id: 'o4',
    buyerId: 'b2',
    buyerName: 'Fatima Begum',
    buyerPhone: '+880 1512-345682',
    farmerId: 'f2',
    farmerName: 'Abdul Jabbar',
    productId: 'p4',
    productName: 'Cauliflower',
    batchCode: 'CAU-2024-004',
    quantity: 75,
    unit: 'kg',
    pricePerUnit: 50,
    totalAmount: 3750,
    status: 'rejected',
    createdAt: '2024-10-30T10:00:00Z',
    updatedAt: '2024-10-30T11:00:00Z',
    rejectedAt: '2024-10-30T11:00:00Z',
    rejectionReason: 'Insufficient stock available'
  }
];

export const mockVerificationRequests = [
  {
    id: 'v1',
    farmerId: 'f3',
    farmerName: 'Rahim Mia',
    phone: '+880 1912-345680',
    location: 'Bogura, Rajshahi',
    nidFront: '/api/placeholder/400/250',
    nidBack: '/api/placeholder/400/250',
    farmVideo: '/api/placeholder/640/360',
    status: 'pending',
    submittedAt: '2024-10-28T14:00:00Z'
  },
  {
    id: 'v2',
    farmerId: 'f1',
    farmerName: 'Karim Rahman',
    phone: '+880 1712-345678',
    location: 'Jessore, Khulna',
    nidFront: '/api/placeholder/400/250',
    nidBack: '/api/placeholder/400/250',
    farmVideo: '/api/placeholder/640/360',
    status: 'approved',
    submittedAt: '2024-10-14T10:00:00Z',
    reviewedAt: '2024-10-15T09:00:00Z',
    reviewedBy: 'Admin'
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    userId: 'f1',
    type: 'new_order',
    title: 'New Order Received',
    message: 'Shahed Ahmed ordered 50 kg of Fresh Tomatoes',
    orderId: 'o1',
    read: false,
    createdAt: '2024-10-30T09:00:00Z'
  },
  {
    id: 'n2',
    userId: 'b1',
    type: 'order_accepted',
    title: 'Order Accepted',
    message: 'Abdul Jabbar accepted your order for Fresh Potatoes',
    orderId: 'o2',
    read: true,
    createdAt: '2024-10-29T15:00:00Z'
  },
  {
    id: 'n3',
    userId: 'b2',
    type: 'order_completed',
    title: 'Order Completed',
    message: 'Your order for Green Chili has been completed',
    orderId: 'o3',
    read: true,
    createdAt: '2024-10-29T16:00:00Z'
  }
];

export const mockAdminStats = {
  totalFarmers: 3,
  verifiedFarmers: 2,
  pendingVerifications: 1,
  totalBuyers: 2,
  totalProducts: 4,
  totalOrders: 4,
  pendingOrders: 1,
  activeOrders: 1,
  completedOrders: 1,
  rejectedOrders: 1
};
