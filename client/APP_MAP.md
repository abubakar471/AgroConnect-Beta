# 🗺️ AgroConnect - Application Map

## 📊 Complete Application Structure

```
🌾 AgroConnect Platform
│
├── 🏠 Landing Page (/)
│   ├── Hero Section
│   ├── Farmer vs Buyer Cards
│   ├── Features Overview
│   └── CTA Buttons
│       ├─→ Get Started → Login
│       └─→ Admin Access → Admin Dashboard
│
├── 🔐 Authentication Flow
│   │
│   ├── Login Page (/login)
│   │   ├── OTP via Phone Number
│   │   ├── Demo Login Buttons
│   │   └── Verification
│   │
│   └── Role Selection (/role-selection) [NEW USERS ONLY]
│       ├── Choose: Farmer or Buyer
│       ├── Enter Name
│       └─→ Redirect to Dashboard
│
├── 🌾 FARMER SECTION
│   │
│   ├── Farmer Dashboard (/farmer/dashboard)
│   │   ├── 📊 Stats Overview
│   │   │   ├── Total Products
│   │   │   ├── Pending Orders
│   │   │   ├── Total Orders
│   │   │   └── Total Revenue
│   │   │
│   │   ├── 📋 Tabs
│   │   │   ├── Orders Tab
│   │   │   │   ├── Pending Orders (Accept/Reject)
│   │   │   │   ├── Accepted Orders
│   │   │   │   ├── Completed Orders
│   │   │   │   └── Rejected Orders
│   │   │   │
│   │   │   ├── Products Tab
│   │   │   │   ├── My Product Batches
│   │   │   │   └── Create Batch Button (if verified)
│   │   │   │
│   │   │   └── Notifications Tab
│   │   │       └── Real-time Order Notifications
│   │   │
│   │   └── ⚠️ Verification Alert (if unverified)
│   │       └─→ Get Verified Button
│   │
│   ├── Verification Page (/farmer/verification)
│   │   ├── Farm Information Form
│   │   │   ├── Location
│   │   │   ├── Farm Size
│   │   │   └── Specialization
│   │   │
│   │   ├── NID Upload
│   │   │   ├── Front Side
│   │   │   └── Back Side
│   │   │
│   │   ├── Farm Video Upload
│   │   │   └── 20-30 sec intro
│   │   │
│   │   └── Submit for Admin Review
│   │
│   └── Create Batch (/farmer/create-batch) [VERIFIED ONLY]
│       ├── Basic Information
│       │   ├── Product Name
│       │   ├── Batch Code (auto-generated)
│       │   ├── Category
│       │   ├── Harvest Date
│       │   └── Description
│       │
│       ├── Quantity & Pricing
│       │   ├── Available Units
│       │   ├── Unit Type (kg, ton, etc.)
│       │   └── Price per Unit
│       │
│       ├── Quality Information
│       │   ├── Shelf Life
│       │   └── Quality Grade (A+, A, B, C)
│       │
│       ├── Images (up to 5)
│       │
│       └── Create Batch Button
│
├── 🛒 BUYER SECTION
│   │
│   ├── Buyer Dashboard (/buyer/dashboard)
│   │   ├── 📊 Stats Overview
│   │   │   ├── Total Orders
│   │   │   ├── Pending Orders
│   │   │   ├── Active Products
│   │   │   └── Total Spent
│   │   │
│   │   └── 📋 Tabs
│   │       │
│   │       ├── Marketplace Tab
│   │       │   ├── Search Bar
│   │       │   ├── Category Filters
│   │       │   │   ├── All
│   │       │   │   ├── Vegetables
│   │       │   │   ├── Fruits
│   │       │   │   ├── Grains
│   │       │   │   └── Dairy
│   │       │   │
│   │       │   └── Product Grid
│   │       │       ├── Product Cards
│   │       │       │   ├── Image
│   │       │       │   ├── Name & Location
│   │       │       │   ├── Verified Badge
│   │       │       │   ├── Harvest Date
│   │       │       │   ├── Price
│   │       │       │   ├── Available Quantity
│   │       │       │   ├── Quality Grade
│   │       │       │   └── View Details Button
│   │       │       │
│   │       │       └─→ Product Details Page
│   │       │
│   │       ├── My Orders Tab
│   │       │   ├── Order Cards
│   │       │   │   ├── Product Info
│   │       │   │   ├── Farmer Info
│   │       │   │   ├── Status Badge
│   │       │   │   ├── Quantity & Price
│   │       │   │   └── Actions (if accepted)
│   │       │   │
│   │       │   └── Empty State
│   │       │
│   │       └── Notifications Tab
│   │           └── Order Status Updates
│   │
│   └── Product Details (/buyer/product/[id])
│       ├── Product Images Gallery
│       ├── Product Information
│       │   ├── Name & Description
│       │   └── Verified Farmer Badge
│       │
│       ├── Farmer Information Card
│       │   ├── Name
│       │   └── Location
│       │
│       ├── Batch Information Card
│       │   ├── Batch Code
│       │   ├── Category
│       │   ├── Harvest Date
│       │   ├── Shelf Life
│       │   ├── Quality Grade
│       │   ├── Available Quantity
│       │   └── Admin Verification Badge
│       │
│       ├── Pricing & Order Card
│       │   ├── Price per Unit
│       │   ├── Quantity Selector
│       │   ├── Total Calculation
│       │   ├── Payment Method (COD)
│       │   └── Place Order Button
│       │
│       └── Order Confirmation
│           └─→ Redirect to Dashboard
│
└── 🛡️ ADMIN SECTION
    │
    └── Admin Dashboard (/admin/dashboard)
        ├── 📊 Statistics Overview
        │   ├── Total Farmers
        │   ├── Verified Farmers
        │   ├── Pending Verifications
        │   ├── Total Buyers
        │   ├── Active Products
        │   ├── Total Orders
        │   ├── Pending Orders
        │   ├── Active Orders
        │   ├── Completed Orders
        │   └── Rejected Orders
        │
        └── 📋 Tabs
            │
            ├── Farmer Verifications Tab
            │   ├── Pending Verifications
            │   │   ├── Farmer Info
            │   │   ├── Location
            │   │   ├── Documents Preview
            │   │   │   ├── NID Front
            │   │   │   ├── NID Back
            │   │   │   └── Farm Video
            │   │   │
            │   │   └── Actions
            │   │       ├── Approve Button
            │   │       └── Reject Button
            │   │
            │   └── Processed Verifications
            │       └── Approved/Rejected List
            │
            ├── Order Monitoring Tab
            │   └── All Orders
            │       ├── Order Info
            │       ├── Farmer & Buyer
            │       ├── Status Badge
            │       └── Amount
            │
            ├── Users Tab
            │   ├── Farmers List
            │   │   ├── Name
            │   │   ├── Location
            │   │   └── Verification Status
            │   │
            │   └── Buyers List
            │       ├── Name
            │       ├── Location
            │       └── Business Type
            │
            ├── Products Tab
            │   └── All Products
            │       ├── Product Card
            │       ├── Farmer Name
            │       ├── Price & Quantity
            │       ├── Batch Code
            │       └── Verification Badge
            │
            └── Broadcast Tab
                ├── Message Input
                ├── Send to All Users Button
                └── Clear Button

```

## 🔄 User Journeys

### Journey 1: New Farmer Registration & Product Listing
```
1. Landing Page
2. Get Started → Login
3. Enter Phone: +880 1999-999999
4. Enter OTP: 123456
5. Role Selection → Choose "Farmer"
6. Enter Name: "Amir Hossain"
7. → Farmer Dashboard (Unverified)
8. Click "Get Verified"
9. → Verification Page
10. Fill Form + Upload NID + Upload Video
11. Submit for Review
12. [Admin Approves]
13. → Farmer Dashboard (Verified)
14. Click "Create Batch"
15. Fill Product Details + Upload Images
16. Submit Batch
17. ✅ Product Now in Marketplace
```

### Journey 2: Buyer Orders from Farmer
```
1. Landing Page
2. Get Started → Login
3. Login as Shahed (Buyer)
4. → Buyer Dashboard
5. Browse Marketplace
6. Search/Filter Products
7. Click on "Fresh Tomatoes"
8. → Product Details Page
9. Check Batch Info + Farmer
10. Select Quantity: 50 kg
11. Click "Place Order"
12. ✅ Order Placed (Pending)
13. [Farmer Receives Notification]
14. [Farmer Accepts Order]
15. Buyer Gets Notification
16. Confirm Delivery
17. ✅ Order Completed
```

### Journey 3: Admin Manages Platform
```
1. Landing Page
2. Click "Admin Access"
3. → Admin Dashboard
4. View Statistics
5. Go to "Farmer Verifications" Tab
6. See Pending: Rahim Mia
7. Review Documents
8. Click "Approve"
9. ✅ Rahim Now Verified
10. Go to "Order Monitoring" Tab
11. Monitor All Orders
12. Go to "Broadcast" Tab
13. Type Message: "Welcome to AgroConnect!"
14. Send to All Users
15. ✅ Message Sent
```

## 🎯 Key Interactions

| User Action | Trigger | Result |
|-------------|---------|--------|
| Farmer creates batch | Submit form | Product appears in marketplace |
| Buyer places order | Click "Place Order" | Farmer gets notification |
| Farmer accepts order | Click "Accept" | Buyer gets notification |
| Farmer rejects order | Click "Reject" | Buyer gets notification + reason |
| Admin approves farmer | Click "Approve" | Farmer can create batches |
| Admin sends broadcast | Click "Send" | All users receive message |
| Buyer confirms delivery | Click "Confirm" | Order marked completed |

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop**: Full layouts with sidebars
- **Tablet**: Adapted layouts with stacked elements
- **Mobile**: Single column, optimized for touch

## 🎨 Design System

### Colors
- **Primary**: Green (#16a34a) - Agriculture, Growth
- **Secondary**: Blue (#2563eb) - Trust, Professional
- **Admin**: Purple (#9333ea) - Authority, Control
- **Warning**: Orange (#ea580c) - Attention Required
- **Danger**: Red (#dc2626) - Error, Rejection
- **Success**: Green (#16a34a) - Confirmation, Verified

### Typography
- **Headings**: Font-bold, larger sizes
- **Body**: Regular weight, readable sizes
- **Labels**: Font-medium, smaller sizes
- **Codes**: Font-mono (for batch codes)

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Prominent CTAs, clear hierarchy
- **Badges**: Color-coded status indicators
- **Inputs**: Clear labels, helpful placeholders
- **Alerts**: Contextual colors, icon support

---

**This is your complete AgroConnect MVP frontend! 🌾**

All features are implemented with mock data and ready for backend integration.
