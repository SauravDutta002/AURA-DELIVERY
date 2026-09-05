# 🏭 AURA DRONE DELIVERY — PRODUCTION TECH STACK
### *What Blinkit & Rapido actually use, and what AURA should use*

---

## 1. WHAT THE BIG COMPANIES ACTUALLY USE

| Layer | Blinkit | Rapido | Swiggy | Zomato |
|-------|---------|--------|--------|--------|
| **Customer App** | React Native → moved to **Native (Kotlin/Swift)** | **Native** (Kotlin + Swift) | **Native** (Kotlin + Swift) | **Native** (Kotlin + Swift) |
| **Driver/Rider App** | React Native → **Native** | **Native** (Kotlin) | **Native** (Kotlin) | **Native** (Kotlin) |
| **Backend** | Node.js + **Go** microservices | **Java (Spring Boot)** + Node.js | **Java (Spring Boot)** + Python + Go | Python (Django) + **Go** |
| **Database** | PostgreSQL + Redis + MongoDB | PostgreSQL + Redis | PostgreSQL + **Cassandra** + Redis | PostgreSQL + Redis + **Elasticsearch** |
| **Real-time** | **Kafka** + WebSockets | **Firebase** + WebSockets | **Kafka** + WebSockets | **Kafka** + WebSockets |
| **Maps** | Google Maps SDK | Google Maps SDK | Google Maps SDK | Google Maps SDK |
| **Payments** | Razorpay | Razorpay | Razorpay + Juspay | Razorpay |
| **Push Notifs** | FCM (Firebase) | FCM | FCM | FCM |
| **Cloud** | AWS | AWS | AWS | AWS |
| **CI/CD** | GitHub Actions | Jenkins | Jenkins + GitHub Actions | GitLab CI |

### Key Insight
> Every major Indian delivery company **started** with cross-platform (React Native / Flutter) 
> and **moved to Native** only after reaching millions of users because of:
> - GPS/location accuracy needs
> - Background service reliability (keeping tracking alive)
> - Battery optimization
> - Smooth 60fps map animations
>
> **For a startup going 0 → 1, React Native is the right choice.** You move to native later when scale demands it.

---

## 2. RECOMMENDED AURA TECH STACK

### 📱 Mobile Apps — React Native (Expo)

| Decision | Choice | Why |
|----------|--------|-----|
| **Framework** | **React Native with Expo** | Fastest time-to-market. OTA updates (push fixes without app store). EAS Build for production APK/IPA. Your team already knows React from the web app. |
| **Navigation** | **React Navigation v7** | Industry standard. Supports stack, tab, drawer navigators. Deep linking for push notifications. |
| **Maps** | **react-native-maps** (Google Maps provider) | Production-grade. Used by Uber, Lyft. Supports custom markers, polylines, animated marker movement for drone tracking. |
| **Real-time** | **socket.io-client** | Same as web. Persistent connection for live order updates and drone tracking. |
| **State Mgmt** | **Zustand** (or Redux Toolkit) | Lightweight, fast. Better than Context API at scale. Blinkit uses Redux, but Zustand is the modern equivalent. |
| **HTTP Client** | **Axios** with interceptors | JWT auto-refresh, request/response logging, error handling. |
| **Animations** | **react-native-reanimated v3** + **Lottie** | 60fps native animations. Lottie for complex drone/delivery animations. Equivalent of Framer Motion but for native. |
| **Push Notifs** | **expo-notifications** + **FCM** | Firebase Cloud Messaging for Android, APNs for iOS. |
| **Storage** | **expo-secure-store** (tokens) + **AsyncStorage** (cache) | Secure for JWT tokens. AsyncStorage for cart, preferences. |
| **Location** | **expo-location** | Background location tracking for customer. Foreground for SkyLink port detection. |
| **Payments** | **Razorpay React Native SDK** | Native checkout. UPI, cards, wallets. Same as Blinkit/Swiggy. |
| **Camera/QR** | **expo-camera** | Shopkeeper scanning parcel QR code before loading onto drone. |

### The 3 Apps We Build

```
AuraApp/                          # Expo Monorepo
├── apps/
│   ├── customer/                 # 👤 Customer App (Play Store / App Store)
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ShopListScreen.tsx
│   │   │   ├── ShopDetailScreen.tsx
│   │   │   ├── CartScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   ├── TrackingScreen.tsx      # Live drone map
│   │   │   ├── OrderHistoryScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/                   # API + WebSocket
│   │   └── app.json
│   │
│   ├── shopkeeper/               # 🏪 Shopkeeper App (Tablet optimized)
│   │   ├── screens/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── OrderQueueScreen.tsx    # Kanban board
│   │   │   ├── OrderDetailScreen.tsx   # Item checklist
│   │   │   ├── CatalogScreen.tsx       # Product management
│   │   │   ├── DroneLoadScreen.tsx     # Confirm loading
│   │   │   └── SettingsScreen.tsx
│   │   ├── components/
│   │   ├── navigation/
│   │   └── app.json
│   │
│   └── admin/                    # 🎖️ Admin GCS (stays as React Web — NOT mobile)
│       └── (existing React web app, enhanced)
│
├── packages/
│   └── shared/                   # 📦 Shared code between apps
│       ├── api/                  # API client (Axios instance, interceptors)
│       ├── socket/               # WebSocket client
│       ├── types/                # TypeScript types (Order, Drone, User, etc.)
│       ├── utils/                # Haversine, formatters, validators
│       └── constants/            # API URLs, colors, config
│
├── package.json                  # Workspace root
└── turbo.json                    # Turborepo config (monorepo build tool)
```

---

### ☁️ Backend — Node.js + Express (→ Fastify later)

| Decision | Choice | Why |
|----------|--------|-----|
| **Runtime** | **Node.js 20 LTS** | Your team already has Node.js backend. Non-blocking I/O perfect for real-time apps. |
| **Framework** | **Express.js** (→ migrate to **Fastify** at scale) | Express for now (familiar). Fastify is 2-3x faster and will be the upgrade path. |
| **Language** | **TypeScript** | Catches bugs at compile time. Shared types with frontend. Every serious company uses TS. |
| **ORM/ODM** | **Mongoose** (MongoDB) | Already in use. Schema validation, middleware hooks, population. |
| **Auth** | **JWT** (jsonwebtoken + bcrypt) | Access + Refresh token pattern. Same as Blinkit/Rapido. |
| **Validation** | **Zod** | Runtime type validation on all API inputs. Better than Joi. |
| **Real-time** | **Socket.io** (WebSocket) | Handles reconnection, rooms, namespaces automatically. |
| **IoT/Drone** | **MQTT.js** + **Mosquitto broker** | Industry standard for IoT. Lightweight. Works over unstable 4G. Rapido uses similar for rider tracking. |
| **Job Queue** | **BullMQ** (Redis-based) | Background jobs: payment verification, push notifications, drone dispatch retry, analytics aggregation. |
| **Logging** | **Winston** + **Morgan** | Structured JSON logs. Morgan for HTTP request logging. |
| **API Docs** | **Swagger / OpenAPI** | Auto-generated API documentation. Essential for team collaboration. |

---

### 💾 Database — MongoDB + Redis + S3

| Database | Purpose | Why |
|----------|---------|-----|
| **MongoDB Atlas** | Primary database (Users, Orders, Shops, Products, Drones) | Flexible schema, great for rapid iteration. Geo queries (`$near`, `2dsphere` index). Your team already uses it. |
| **Redis** | Caching + Geospatial + Job Queues + Session | `GEOADD/GEORADIUS` for finding nearest drone/shop. BullMQ job queue. Rate limiting. Real-time leaderboards. |
| **AWS S3 / Cloudflare R2** | Image storage (product photos, drone logs) | Cheap, scalable blob storage. CDN for fast image loading. |

### Why not PostgreSQL?
> Blinkit and Rapido use Postgres, but they have dedicated DBA teams. MongoDB is faster to develop with 
> for a small team and handles the document-heavy nature of orders (nested items array, status history). 
> You can migrate to Postgres later if needed, but MongoDB is the right call for 0 → 1.

---

### 📡 Real-time Communication Stack

```
                    CUSTOMER APP                SHOPKEEPER APP             ADMIN GCS
                         │                           │                        │
                    socket.io                   socket.io                socket.io
                         │                           │                        │
                    ┌────▼───────────────────────────▼────────────────────────▼────┐
                    │              SOCKET.IO SERVER (Node.js)                      │
                    │    Rooms: order:{id}, shop:{id}, fleet, admin                │
                    └────────────────────────────┬────────────────────────────────┘
                                                 │
                                          MQTT.js client
                                                 │
                    ┌────────────────────────────▼────────────────────────────────┐
                    │              MQTT BROKER (Mosquitto)                         │
                    │    Topics: aura/drone/{id}/telemetry                        │
                    │            aura/drone/{id}/command                          │
                    │            aura/drone/{id}/status                           │
                    └────────────────────────────┬────────────────────────────────┘
                                                 │
                                          paho-mqtt (Python)
                                                 │
                    ┌────────────────────────────▼────────────────────────────────┐
                    │              DRONE (Raspberry Pi)                            │
                    │    Publishes: telemetry @ 1Hz                               │
                    │    Subscribes: commands                                      │
                    └─────────────────────────────────────────────────────────────┘
```

**Data flow for live tracking:**
1. Drone Pi publishes GPS to MQTT topic every 1 second
2. Backend MQTT.js client receives it
3. Backend saves to MongoDB (Telemetry collection) 
4. Backend calculates ETA
5. Backend emits via Socket.io to the customer's `order:{orderId}` room
6. Customer app receives → updates map marker position smoothly

---

### 💳 Payments — Razorpay

Same flow as Blinkit:

```
Customer App                    Backend                         Razorpay
     │                             │                               │
     │── POST /payment/create ────▶│── Create Order ──────────────▶│
     │                             │◀── razorpay_order_id ────────│
     │◀── { orderId, key } ───────│                               │
     │                             │                               │
     │── Open Razorpay Checkout ──▶│                               │
     │   (UPI / Card / Wallet)     │                               │
     │◀── { paymentId, sig } ─────│                               │
     │                             │                               │
     │── POST /payment/verify ────▶│── Verify Signature ──────────▶│
     │                             │◀── Success ──────────────────│
     │◀── "Payment Confirmed" ────│                               │
     │                             │                               │
     │                             │── Mark order as PAID          │
     │                             │── Notify shopkeeper via WS    │
```

---

### 🚀 Deployment & DevOps

| Component | Where | Why |
|-----------|-------|-----|
| **Backend API** | **AWS EC2** (→ ECS/EKS later) or **Railway/Render** for MVP | Start simple. Containerize with Docker. Move to Kubernetes at scale. |
| **MongoDB** | **MongoDB Atlas** (M10 cluster) | Managed, auto-scaling, backups, monitoring. Free tier for dev. |
| **Redis** | **Redis Cloud** or **AWS ElastiCache** | Managed Redis. Persistence enabled. |
| **MQTT Broker** | **AWS IoT Core** or self-hosted **Mosquitto on VPS** | AWS IoT Core handles millions of connections. Start with Mosquitto on a $5 VPS. |
| **Mobile Apps** | **Expo EAS Build** → Play Store + App Store | Cloud builds. No need for local Xcode/Android Studio setup. OTA updates for JS changes. |
| **Admin GCS** | **Cloudflare Pages** or **Vercel** | Static site hosting. Free. Auto-deploy from GitHub. |
| **CI/CD** | **GitHub Actions** | Lint → Test → Build → Deploy on every push. |
| **Monitoring** | **Sentry** (errors) + **Grafana** (metrics) | Sentry catches crashes in RN apps + backend. Grafana for drone fleet health. |
| **CDN** | **Cloudflare** | Fast static asset delivery. DDoS protection. |

---

## 3. COMPARISON: AURA vs BLINKIT/RAPIDO ARCHITECTURE

| Aspect | Blinkit/Rapido (at scale) | AURA (starting out) | AURA (at scale) |
|--------|--------------------------|---------------------|-----------------|
| **Mobile** | Native (Kotlin/Swift) | React Native (Expo) | React Native → Native if needed |
| **Backend** | Go/Java microservices on K8s | Node.js modular monolith on VPS | Node.js → Fastify microservices on K8s |
| **DB** | PostgreSQL + Cassandra | MongoDB + Redis | MongoDB + Redis → add Postgres if needed |
| **Real-time** | Kafka + custom WS | Socket.io + MQTT | Socket.io + MQTT → Kafka at 10k+ orders/day |
| **Maps** | Google Maps SDK | Google Maps (react-native-maps) | Same |
| **Payment** | Razorpay + Juspay | Razorpay | Same |
| **Fleet Tracking** | Custom GPS pipeline | MQTT → Socket.io bridge | Same (MQTT is already IoT-grade) |
| **Team Size** | 200+ engineers | 2-5 engineers | 20+ engineers |

### The key insight:
> **The architecture is the same.** The only difference is the scale of each component. 
> A Kafka cluster vs Socket.io. Kubernetes vs a single VPS. Native vs React Native.
> 
> You start simple, prove the product works, then scale each layer independently.
> **AURA's drone-specific MQTT layer is actually MORE advanced than what Rapido uses for bikes** 
> because drones require real-time 3D telemetry (lat, lng, alt, attitude, battery) at 1Hz.

---

## 4. FINAL RECOMMENDED STACK SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                    AURA DRONE DELIVERY                          │
│                    PRODUCTION TECH STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 MOBILE                                                      │
│  ├── React Native (Expo SDK 52)                                 │
│  ├── TypeScript                                                 │
│  ├── React Navigation v7                                        │
│  ├── react-native-maps (Google Maps)                            │
│  ├── react-native-reanimated v3                                 │
│  ├── Zustand (state management)                                 │
│  ├── socket.io-client                                           │
│  ├── Razorpay RN SDK                                            │
│  ├── expo-location                                              │
│  ├── expo-notifications                                         │
│  └── Lottie (animations)                                        │
│                                                                 │
│  ☁️  BACKEND                                                     │
│  ├── Node.js 20 LTS + TypeScript                                │
│  ├── Express.js (→ Fastify later)                               │
│  ├── Mongoose (MongoDB ODM)                                     │
│  ├── Socket.io (WebSocket server)                               │
│  ├── MQTT.js (drone communication)                              │
│  ├── BullMQ (job queues)                                        │
│  ├── Zod (validation)                                           │
│  ├── JWT (authentication)                                       │
│  └── Winston (logging)                                          │
│                                                                 │
│  💾 DATA                                                        │
│  ├── MongoDB Atlas (primary DB)                                 │
│  ├── Redis Cloud (geo, cache, queues)                           │
│  └── AWS S3 (images, logs)                                      │
│                                                                 │
│  📡 REAL-TIME                                                    │
│  ├── Socket.io (app ↔ backend)                                  │
│  └── Mosquitto MQTT (drone ↔ backend)                           │
│                                                                 │
│  🤖 DRONE EDGE                                                   │
│  ├── Python 3.11                                                │
│  ├── DroneKit + MAVLink                                         │
│  ├── paho-mqtt                                                  │
│  └── OpenCV (cameras)                                           │
│                                                                 │
│  🚀 DEVOPS                                                       │
│  ├── Docker                                                     │
│  ├── GitHub Actions (CI/CD)                                     │
│  ├── Expo EAS Build (mobile)                                    │
│  ├── Sentry (error tracking)                                    │
│  └── Cloudflare (CDN + DNS)                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. WHAT TO BUILD FIRST (Priority Order)

| # | What | Why | Timeline |
|---|------|-----|----------|
| 1 | **Backend APIs** (Auth + Shop + Order) | Everything depends on this | Week 1-2 |
| 2 | **Customer App** (Home → Shop → Cart → Order) | Core product, revenue generator | Week 2-4 |
| 3 | **Socket.io + MQTT bridge** | Live tracking is the killer feature | Week 3-4 |
| 4 | **Live Tracking screen** | This is what makes AURA special | Week 4-5 |
| 5 | **Payment integration** (Razorpay) | Can't collect money without this | Week 5 |
| 6 | **Shopkeeper App** | Need shops to fulfil orders | Week 5-6 |
| 7 | **Admin GCS enhancement** | Fleet monitoring | Week 6-7 |
| 8 | **Drone MQTT integration** | Connect real hardware | Week 7-8 |
