# 🎯 AgroConnect - Quick Start Guide

## 🌐 Access the Application

Your Next.js app is running at: **http://localhost:3000**

---

## 🚀 Quick Demo Flow

### Option 1: Try as Verified Farmer (Karim)

1. Click **"Get Started"** on landing page
2. Click **"Login as Karim (Verified Farmer)"** button
3. Any 6-digit OTP works (e.g., `123456`)
4. ✅ You'll see:
   - Your products and batches
   - Pending orders to accept/reject
   - Revenue statistics
   - "Create Batch" button (since you're verified)

### Option 2: Try as Buyer (Shahed)

1. Click **"Get Started"** on landing page
2. Click **"Login as Shahed (Buyer)"** button
3. Enter any 6-digit OTP
4. ✅ You'll see:
   - Marketplace with all products
   - Search and filter options
   - Order history
   - Notifications

### Option 3: Try as Unverified Farmer (Rahim)

1. Click **"Get Started"** on landing page
2. Click **"Login as Rahim (Unverified Farmer)"** button
3. Enter any 6-digit OTP
4. ✅ You'll see:
   - Verification required alert
   - "Get Verified" button
   - Can submit verification documents

### Option 4: Try as New User

1. Click **"Get Started"** on landing page
2. Click **"Login as New User"** button
3. Enter any 6-digit OTP
4. Choose role: **Farmer** or **Buyer**
5. Enter your name
6. ✅ Redirected to your dashboard

### Option 5: Admin Dashboard

1. Click **"Admin Access"** on landing page
2. ✅ You'll see:
   - Platform statistics
   - Pending farmer verifications (approve/reject)
   - All orders monitoring
   - User management
   - Broadcast messaging

---

## 📋 Key Features to Explore

### 🌾 Farmer Dashboard
- ✅ View/Create product batches
- ✅ Accept/Reject orders in real-time
- ✅ Submit verification documents
- ✅ Track revenue and statistics

### 🛒 Buyer Dashboard
- ✅ Browse marketplace
- ✅ Filter by category
- ✅ Search products/farmers
- ✅ View detailed batch information
- ✅ Place orders
- ✅ Track order status

### 🛡️ Admin Dashboard
- ✅ Review farmer verifications
- ✅ Monitor all orders
- ✅ Manage users
- ✅ Oversee products
- ✅ Send broadcast messages

---

## 🎨 Visual Flow

```
Landing Page (/)
    ↓
Login (/login) → OTP Verification
    ↓
    ├─→ Existing User → Dashboard
    └─→ New User → Role Selection → Dashboard

Farmer Flow:
Login → Farmer Dashboard → [Verification] → Create Batch → Receive Orders → Accept/Reject

Buyer Flow:
Login → Buyer Dashboard → Browse Marketplace → View Product → Place Order → Track Status

Admin Flow:
Admin Dashboard → Verify Farmers → Monitor Orders → Broadcast Messages
```

---

## 🧪 Test These Scenarios

### Scenario 1: Farmer creates a batch
1. Login as Karim (verified farmer)
2. Go to "My Products" tab
3. Click "Create Batch"
4. Fill in product details
5. Upload images
6. Submit ✅

### Scenario 2: Buyer places an order
1. Login as Shahed (buyer)
2. Browse marketplace
3. Click on any product
4. Adjust quantity
5. Click "Place Order" ✅

### Scenario 3: Admin approves farmer
1. Access Admin Dashboard
2. Go to "Farmer Verifications" tab
3. Review pending verifications
4. Click "Approve" or "Reject" ✅

### Scenario 4: Farmer manages orders
1. Login as Karim
2. Go to "Orders" tab
3. See pending orders
4. Accept or Reject ✅

---

## 📱 Pages Overview

| Route | Description | Who Can Access |
|-------|-------------|----------------|
| `/` | Landing page | Everyone |
| `/login` | Login page | Everyone |
| `/role-selection` | Choose role | New users |
| `/farmer/dashboard` | Farmer control panel | Farmers only |
| `/farmer/verification` | Submit verification | Unverified farmers |
| `/farmer/create-batch` | Create product batch | Verified farmers only |
| `/buyer/dashboard` | Buyer marketplace | Buyers only |
| `/buyer/product/[id]` | Product details | Buyers only |
| `/admin/dashboard` | Admin control tower | Admin only |

---

## 🎨 Color Scheme

- **Green** (`bg-green-600`): Primary actions, farmer elements
- **Blue** (`bg-blue-600`): Buyer elements
- **Purple** (`bg-purple-600`): Admin elements
- **Orange** (`bg-orange-600`): Warnings, pending actions
- **Red** (`bg-red-600`): Rejections, errors

---

## 💡 Tips

1. **Mock Data**: All data is currently simulated in `lib/mockData.js`
2. **Authentication**: Uses localStorage for demo purposes
3. **OTP**: Any 6-digit code works in demo mode
4. **Uploads**: Show UI but don't actually upload files yet
5. **Real-time**: Notifications are simulated (will use Socket.IO in production)

---

## 🔗 What's Next?

This is the **frontend MVP** with mock data. Next steps:

1. ✅ **Backend API** (in `/server` directory)
2. ✅ **Database** (MongoDB)
3. ✅ **Real Authentication** (Clerk)
4. ✅ **File Uploads** (Cloudinary/S3)
5. ✅ **Real-time Notifications** (Socket.IO)
6. ✅ **Payment Integration** (if needed)

---

**Enjoy exploring AgroConnect! 🌾**

Visit: http://localhost:3000
