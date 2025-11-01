# 🌾 AgroConnect MVP - Frontend

A Next.js application connecting farmers and buyers directly for fresh produce trading.

## 🚀 Getting Started

The development server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.56.1:3000

## 📱 Application Flow

### 1. Landing Page (`/`)
- Beautiful hero section introducing AgroConnect
- Two main user types: Farmers & Buyers
- Features overview
- Call-to-action buttons

### 2. Authentication (`/login`)
- OTP-based mobile login (simulated with mock data)
- Quick demo login buttons for testing:
  - **Karim** (Verified Farmer): `+880 1712-345678`
  - **Shahed** (Buyer): `+880 1612-345681`
  - **Rahim** (Unverified Farmer): `+880 1912-345680`
  - **New User**: `+880 1999-999999`

### 3. Role Selection (`/role-selection`)
- First-time users select role: Farmer or Buyer
- Enter name and basic information
- Redirects to appropriate dashboard

### 4. Farmer Dashboard (`/farmer/dashboard`)

**Features:**
- ✅ Overview stats (products, orders, revenue)
- ✅ Real-time order notifications
- ✅ Accept/Reject orders
- ✅ View product batches
- ✅ Create new batches (verified farmers only)
- ⚠️ Verification status alert (unverified farmers)

**Verification Flow** (`/farmer/verification`):
- Upload NID (front & back)
- Upload farm video introduction
- Submit for admin review
- Get verified badge after approval

**Create Batch** (`/farmer/create-batch`):
- Product information (name, category, description)
- Batch tracking (unique batch code, harvest date)
- Quantity & pricing
- Quality information (shelf life, grade)
- Upload product images (up to 5)

### 5. Buyer Dashboard (`/buyer/dashboard`)

**Features:**
- 🛒 Browse marketplace with filters
- 🔍 Search products by name/farmer
- 📦 View batch details with harvest info
- 🏷️ Verified farmer badges
- 📱 Place orders
- 📊 Track order status
- 🔔 Real-time notifications

**Product Details** (`/buyer/product/[id]`):
- Complete batch information
- Farmer details and verification status
- Harvest date and shelf life
- Quality grade
- Order placement with quantity selection
- Real-time total calculation

### 6. Admin Dashboard (`/admin/dashboard`)

**Control Tower Features:**
- 📊 Platform statistics overview
- ✅ Farmer verification review (approve/reject)
- 📦 Order monitoring
- 👥 User management (farmers & buyers)
- 🏷️ Product oversight
- 📢 Broadcast messaging to all users

**Key Metrics:**
- Total farmers (verified vs unverified)
- Total buyers
- Active products
- Order statistics (pending, active, completed)

## 🎯 Mock Data

Located in `lib/mockData.js`:
- **3 Farmers**: 2 verified, 1 pending verification
- **2 Buyers**: Both active
- **4 Products**: All from verified farmers
- **4 Orders**: Various statuses (pending, accepted, completed, rejected)
- **Verification Requests**: Sample verification data

## 🔑 Key Features Demonstrated

### ✅ Farmer Features
1. **Verification System**
   - NID upload
   - Farm video submission
   - Admin review process
   - Verified badge display

2. **Product Batch Management**
   - Unique batch codes for traceability
   - Harvest date tracking
   - Quality grade assignment
   - Shelf life information
   - Image gallery

3. **Order Management**
   - Real-time notifications
   - Accept/Reject functionality
   - Order history tracking
   - Revenue dashboard

### ✅ Buyer Features
1. **Marketplace Discovery**
   - Search and filter products
   - Category browsing
   - Verified farmer filtering
   - Batch information display

2. **Order Flow**
   - Detailed product view
   - Quantity selection
   - Price calculation
   - Order placement
   - Status tracking

3. **Trust & Transparency**
   - Farmer verification badges
   - Batch tracking codes
   - Harvest dates visible
   - Quality grades shown

### ✅ Admin Features
1. **Verification Management**
   - Review farmer submissions
   - Approve/Reject with one click
   - Document review

2. **Platform Oversight**
   - Complete statistics dashboard
   - Order monitoring
   - User management
   - Product quality assurance

3. **Communication**
   - Broadcast messaging
   - Platform-wide announcements

## 🎨 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: localStorage (for demo)

## 📂 Project Structure

```
client/
├── app/
│   ├── page.js                    # Landing page
│   ├── layout.js                  # Root layout with AuthProvider
│   ├── login/page.js              # Login page
│   ├── role-selection/page.js     # Role selection
│   ├── farmer/
│   │   ├── dashboard/page.js      # Farmer dashboard
│   │   ├── verification/page.js   # Verification form
│   │   └── create-batch/page.js   # Create product batch
│   ├── buyer/
│   │   ├── dashboard/page.js      # Buyer dashboard
│   │   └── product/[id]/page.js   # Product details
│   └── admin/
│       └── dashboard/page.js      # Admin control tower
├── components/ui/                 # shadcn/ui components
├── contexts/
│   └── AuthContext.js             # Authentication context
└── lib/
    ├── mockData.js                # Mock data for demo
    └── utils.js                   # Utility functions
```

## 🧪 Testing the Application

### Quick Test Scenarios:

1. **New User Journey**
   - Go to login → Use `+880 1999-999999`
   - Select role (Farmer or Buyer)
   - Enter name → Explore dashboard

2. **Verified Farmer**
   - Login as Karim (`+880 1712-345678`)
   - View existing products
   - Create new batch
   - Manage orders

3. **Unverified Farmer**
   - Login as Rahim (`+880 1912-345680`)
   - See verification prompt
   - Submit verification
   - Wait for admin approval

4. **Buyer Flow**
   - Login as Shahed (`+880 1612-345681`)
   - Browse marketplace
   - Filter by category
   - View product details
   - Place order

5. **Admin Operations**
   - Access `/admin/dashboard` directly
   - Review pending verifications
   - Approve/Reject farmers
   - Monitor orders
   - Send broadcast messages

## 🌟 MVP Features Implemented

✅ **Authentication & Role Management**
- OTP login (simulated)
- Role selection for new users
- Context-based auth state

✅ **Farmer Verification**
- Document upload (NID + video)
- Admin review system
- Verified badges

✅ **Product Batch System**
- Unique batch codes
- Harvest date tracking
- Quality grading
- Image uploads

✅ **Marketplace**
- Product discovery
- Search & filters
- Category browsing
- Verified farmer badges

✅ **Order Management**
- Real-time notifications (simulated)
- Accept/Reject flow
- Order tracking
- Status updates

✅ **Admin Control Tower**
- Verification management
- Order monitoring
- User oversight
- Broadcast messaging

## 🚀 Next Steps (Backend Integration)

When ready to connect to the Express.js backend:

1. **Replace mock data** with API calls
2. **Implement Socket.IO** for real-time notifications
3. **Add file upload** functionality (Cloudinary/AWS S3)
4. **Integrate Clerk** for actual OTP authentication
5. **Connect database** (MongoDB)
6. **Add payment processing** (if needed beyond COD)

## 📝 Notes

- All data is currently mocked for demonstration
- OTP verification is simulated (any 6-digit code works)
- File uploads show UI but don't actually upload
- Real-time notifications are simulated with mock data
- localStorage is used for authentication state

## 🎨 Design Highlights

- **Green Theme**: Represents agriculture and freshness
- **Responsive**: Mobile-first design
- **Accessible**: Uses Radix UI primitives
- **Clean UI**: Card-based layouts
- **Clear CTAs**: Prominent action buttons
- **Status Indicators**: Color-coded badges and alerts

---

**Ready to explore!** Open http://localhost:3000 in your browser to see the AgroConnect MVP in action! 🌾
