# 🌱 CarbonChain

### Circular Waste Management & Carbon Value Chain Platform

> **Turning Waste into Value. Tracking Every Step. Measuring Carbon Impact.**

CarbonChain is a digital platform designed to connect **waste generators, waste-processing facilities, and logistics providers** into a single transparent and traceable ecosystem.

The platform enables organizations to register waste, discover suitable processing facilities, negotiate prices, manage payments, arrange transportation, track waste movement, maintain a Digital Waste Passport, and calculate the resulting carbon impact.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Approach](#-our-approach)
- [Solution](#-solution)
- [How CarbonChain Works](#-how-carbonchain-works)
- [What Makes CarbonChain Stand Out](#-what-makes-carbonchain-stand-out)
- [User Roles](#-user-roles)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Core Modules](#-core-modules)
- [Waste Matching Engine](#-waste-matching-engine)
- [Negotiation System](#-negotiation-system)
- [Logistics & Route Optimization](#-logistics--route-optimization)
- [Digital Waste Passport](#-digital-waste-passport)
- [Carbon Tracking](#-carbon-tracking)
- [Payment System](#-payment-system)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Architecture](#-database-architecture)
- [API Architecture](#-api-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [End-to-End Workflow](#-end-to-end-workflow)
- [Demo Flow](#-demo-flow)
- [Demo Accounts](#-demo-accounts)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Future Scope](#-future-scope)
- [Impact](#-impact)
- [Conclusion](#-conclusion)

---

# 🌍 Overview

Waste management is often treated as a simple collection and disposal problem.

CarbonChain approaches it differently.

We treat waste as a **valuable resource and a potential carbon-impact asset**.

Instead of keeping waste generators, processing facilities, transport companies, payments, and carbon calculations in disconnected systems, CarbonChain brings them together into a single digital workflow.

### CarbonChain connects:

```text
Waste Generator
       │
       ▼
Waste Registration
       │
       ▼
Facility Matching
       │
       ▼
Price Negotiation
       │
       ▼
Payment
       │
       ▼
Logistics Assignment
       │
       ▼
Transportation
       │
       ▼
Digital Waste Passport
       │
       ▼
Facility Reception
       │
       ▼
Waste Processing
       │
       ▼
Carbon Impact Calculation
```

The result is a more transparent, traceable, efficient, and measurable circular waste ecosystem.

---

# ❗ Problem Statement

Current waste-management ecosystems face several challenges.

### 1. Fragmented Stakeholders
Waste generators, recyclers, treatment facilities, transport providers, and other stakeholders often operate independently. There is no single platform connecting the complete lifecycle.

### 2. Difficulty Finding Suitable Facilities
A waste generator may not know:
- Which facility accepts their waste
- Which facility is closest
- Whether the facility has enough processing capacity
- What treatment method is available
- What price the facility is willing to offer

This results in inefficient disposal and transportation.

### 3. Lack of Transparent Negotiation
Waste pricing can involve multiple parties and manual communication. There is often no structured mechanism to:
- Make offers
- Counter offers
- Accept prices
- Track negotiation history

### 4. Logistics Inefficiency
Even after finding a facility, transportation must be coordinated. Poor coordination can result in:
- Higher transportation costs
- Longer routes
- Delays
- Lack of shipment visibility

### 5. Lack of Waste Traceability
Once waste leaves the generator, tracking its lifecycle becomes difficult. Stakeholders may not have a complete view of:
```text
Where was the waste generated?
        ↓
Who transported it?
        ↓
Where was it delivered?
        ↓
How was it processed?
        ↓
What environmental impact was created?
```

### 6. Carbon Impact is Often Disconnected
Waste processing can prevent emissions and create environmental value, but carbon impact is often calculated separately from the waste lifecycle. This makes it difficult to connect **Waste $\rightarrow$ Processing $\rightarrow$ Carbon Impact** in a single traceable record.

---

# 💡 Our Approach

CarbonChain uses a lifecycle-based digital ecosystem. Instead of solving only one part of waste management, we connect the major stages of the value chain.

Our approach focuses on five principles:
1. **Connect:** Bring all major stakeholders onto one platform.
2. **Match:** Use waste characteristics, facility capabilities, capacity, and geographic distance to recommend suitable facilities.
3. **Transact:** Provide structured negotiation and payment workflows.
4. **Track:** Track waste movement from origin to destination through logistics and a Digital Waste Passport.
5. **Measure:** Calculate and associate carbon impact with the processed waste.

---

# 🚀 Solution

CarbonChain provides an integrated platform consisting of:
- Waste registration
- Waste classification
- Facility discovery
- Intelligent matching
- Price negotiation
- Digital transactions
- Logistics management
- Route optimization
- Shipment tracking
- GIS-based visualization
- Digital Waste Passport
- Carbon impact calculation
- Stakeholder dashboards
- Lifecycle status tracking

---

# 🔄 How CarbonChain Works

### Step 1 — Waste Registration
A waste generator registers a waste batch. Information includes:
- Waste type, Quantity, Quality, Location, Availability date, Pricing preference, and Description.
A Digital Waste Passport is generated for the waste lifecycle.

### Step 2 — Facility Matching
CarbonChain evaluates available facilities based on waste compatibility, distance, processing capacity, and operational status. A match score is generated for suitable facilities.

### Step 3 — Negotiation
The generator can select a suitable facility and initiate a negotiation. Both parties can make an offer, submit a counter-offer, accept an offer, or reject an offer.

### Step 4 — Payment
Once the negotiation is accepted, the transaction moves into the payment stage, supporting creation, verification, status tracking, and demo payment workflows.

### Step 5 — Shipment Creation
After commercial agreement, a shipment stores the generator, facility, logistics provider, pickup/delivery locations, vehicle, driver, route, and status.

### Step 6 — Logistics Assignment
The generator or facility assigns a logistics provider who receives assigned shipments through their dashboard.

### Step 7 — Transportation
The logistics provider manages physical movement across the lifecycle: `ASSIGNED` $\rightarrow$ `PICKUP_SCHEDULED` $\rightarrow$ `PICKED_UP` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `DELIVERED`.

### Step 8 — Digital Waste Passport
Maintains a digital record of the waste lifecycle including passport ID, details, parties involved, shipments, and event history.

### Step 9 — Facility Reception
After delivery, the waste batch becomes `RECEIVED`, allowing the facility to process the waste.

### Step 10 — Carbon Impact
After processing, CarbonChain calculates environmental impact using waste type, quantity, processing method, and carbon factor. The resulting $\text{CO}_2\text{e}$ avoided is linked to the waste record.

---

# ⭐ What Makes CarbonChain Stand Out

CarbonChain is not just another waste marketplace. Its key differentiator is the integration of the complete waste-to-carbon lifecycle.

1. **Waste-to-Carbon Lifecycle:** Connects market, logistics, tracking, processing, and carbon tracking end-to-end.
2. **Digital Waste Passport:** Persistent digital identity for each waste batch (`REGISTERED` $\rightarrow$ `MATCHED` $\rightarrow$ `NEGOTIATED` $\rightarrow$ `PAID` $\rightarrow$ `COLLECTED` $\rightarrow$ `IN TRANSIT` $\rightarrow$ `RECEIVED` $\rightarrow$ `PROCESSED`).
3. **Intelligent Matching:** Multi-parameter scoring algorithm.
4. **Integrated Negotiation:** Real-time counter-offers and status tracking.
5. **Logistics Integration:** Built directly into the waste management lifecycle.
6. **GIS-Based Tracking:** Map visualization for origin, route, and destination.
7. **Carbon Impact Connected to Actual Waste:** Direct tie-in between physical quantities and calculated offsets.

---

# 👥 User Roles

- **🏭 Waste Generator:** Farms, food processors, industrial/municipal generators. Can register waste, find facilities, negotiate, pay, assign logistics, and track impact.
- **♻️ Facility:** Biochar plants, biogas facilities, composting/recycling plants. Can define capacity, view matches, negotiate, receive shipments, process waste, and record carbon.
- **🚛 Logistics Provider:** Manages assigned shipments, updates status, tracks routes, and completes deliveries.
- **🏛️ Municipality:** Monitors regional waste ecosystems and metrics.
- **👨‍💼 Admin:** Full oversight of users, facilities, shipments, carbon data, and monitoring.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React Frontend  │
                    │   Vite + Tailwind    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       ┌──────────┐      ┌────────────┐    ┌─────────────┐
       │ MongoDB  │      │ Socket.IO  │    │ External APIs│
       │ Database │      │ Real-time   │    │ Maps/Payment │
       └──────────┘      └────────────┘    └─────────────┘
```

---

# 📂 Project Structure

```text
CarbonChain/
│
├── backend/
│   ├── configuration/
│   │   └── mongoose_configuration.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── app.js
│   ├── seed.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── routes/
    └── package.json
```

---

# 🛠️ Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, GSAP, Leaflet, Recharts, Lucide React
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.IO
- **Mapping:** Leaflet, OpenStreetMap
- **Payments:** Razorpay-ready architecture with demo workflow

---

# 🧠 Waste Matching Engine

The matching engine evaluates compatible facilities based on:
$$\text{Matching Score} = \text{Compatibility} + \text{Distance} + \text{Capacity} + \text{Operational Status}$$
Scores range from 0–100 points, excluding facilities incapable of handling the specific waste type.

---

# 🌱 Carbon Tracking

Carbon calculations follow the formula:
$$\text{CO}_2\text{e Avoided} = \text{Waste Quantity} \times \text{Carbon Factor}$$

Supported processing methods include:
- `BIOCHAR`
- `BIOGAS`
- `COMPOSTING`
- `RECYCLING`
- `WASTE_TO_ENERGY`

---

# 🧪 Demo Accounts

**Password for all demo accounts:** `Demo@123`

- **Waste Generators:** `generator1@carbonchain.demo`, `generator2@carbonchain.demo`, `generator3@carbonchain.demo`
- **Facilities:** `facility1@carbonchain.demo`, `facility2@carbonchain.demo`
- **Logistics Providers:** `logistics1@carbonchain.demo`, `logistics2@carbonchain.demo`
- **Admin:** `admin@carbonchain.demo`

---

# ⚙️ Installation & Running

### 1. Clone & Setup Backend
```bash
git clone <your-repository-url>
cd CarbonChain/backend
npm install
```

### 2. Configure Environment (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Seed Demo Data & Start Backend
```bash
node seed.js
npm start
```

### 4. Setup & Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

# 📜 License
This project is developed as a hackathon/academic project.