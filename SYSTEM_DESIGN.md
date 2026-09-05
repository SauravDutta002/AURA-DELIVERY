# 🚁 AURA DRONE DELIVERY — COMPLETE SYSTEM DESIGN
### *"Blinkit, but with Drones"*

> **Version:** 1.0  
> **Date:** May 2026  
> **Team:** AURA Engineering  

---

## TABLE OF CONTENTS

1. [Business Model & Vision](#1-business-model--vision)
2. [System Overview — All Applications](#2-system-overview--all-applications)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Deployment Architecture](#4-deployment-architecture)
5. [Database Design (ER Diagram)](#5-database-design-er-diagram)
6. [Backend Microservices & API Design](#6-backend-microservices--api-design)
7. [Communication Protocols](#7-communication-protocols)
8. [User App — Screens & Flow](#8-user-app--screens--flow)
9. [Shopkeeper App — Screens & Flow](#9-shopkeeper-app--screens--flow)
10. [Admin GCS Dashboard](#10-admin-gcs-dashboard)
11. [Drone Edge System (Python)](#11-drone-edge-system-python)
12. [Complete Order Lifecycle — Sequence Diagram](#12-complete-order-lifecycle--sequence-diagram)
13. [Fleet Management & Dispatch Algorithm](#13-fleet-management--dispatch-algorithm)
14. [Class Diagram — Backend Domain Models](#14-class-diagram--backend-domain-models)
15. [State Machine — Order States](#15-state-machine--order-states)
16. [State Machine — Drone States](#16-state-machine--drone-states)
17. [Security Architecture](#17-security-architecture)
18. [Scalability & Future Roadmap](#18-scalability--future-roadmap)

---

## 1. BUSINESS MODEL & VISION

### How it works (Blinkit/Rapido analogy)

| Blinkit / Rapido             | AURA Drone Delivery                          |
|------------------------------|----------------------------------------------|
| Customer orders via app      | Customer orders via AURA App                 |
| Order goes to nearest store  | Order goes to nearest registered shop         |
| Rider picks up from store    | Drone autonomously flies to shop's SkyLink   |
| Rider drives to customer     | Drone flies to customer's nearest SkyLink    |
| Customer receives at door    | Customer collects from SkyLink Port           |
| Rider goes back/takes next   | Drone auto-returns to base / charging pad    |

### Key Differentiators
- **No traffic dependency** — Drones fly direct routes
- **Sub-15-minute delivery** — Within 5km radius
- **50km operational radius** — Using 4G/LTE + RTK GPS
- **cm-level precision landing** — Using UWB anchors at SkyLink ports
- **Autonomous fleet** — No human pilot needed per delivery

### Stakeholders
```
┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CUSTOMER   │  │  SHOPKEEPER  │  │    ADMIN     │  │    DRONE     │
│   (User App) │  │ (Shop Panel) │  │  (GCS Panel) │  │  (Hardware)  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       └────────── ALL CONNECT TO CENTRAL BACKEND ──────────┘
```

---

## 2. SYSTEM OVERVIEW — ALL APPLICATIONS

```mermaid
graph TB
    subgraph "📱 Client Applications"
        UA["👤 User App<br/>(React / React Native)<br/>Browse → Order → Track → Collect"]
        SK["🏪 Shopkeeper App<br/>(React Tablet App)<br/>Accept → Pack → Load → Dispatch"]
        AD["🎖️ Admin GCS Dashboard<br/>(React Web App)<br/>Monitor → Control → Override → Analytics"]
    end

    subgraph "☁️ Cloud Backend"
        GW["🔀 API Gateway<br/>(Nginx / Express Gateway)"]
        AUTH["🔐 Auth Service"]
        ORD["📦 Order Service"]
        SHOP["🏪 Shop & Catalog Service"]
        FLEET["🚁 Fleet Management Service"]
        PAY["💳 Payment Service"]
        NOTIF["🔔 Notification Service"]
        WS["⚡ WebSocket Hub"]
        MQTT["📡 MQTT Broker<br/>(Mosquitto / AWS IoT)"]
    end

    subgraph "💾 Data Layer"
        MONGO[("🗄️ MongoDB<br/>Orders, Users, Shops")]
        REDIS[("⚡ Redis<br/>Geo, Cache, Queues")]
        S3["📁 S3 / Cloud Storage<br/>Images, Logs"]
    end

    subgraph "🤖 Drone Hardware"
        PI["🍓 Raspberry Pi<br/>(Companion Computer)"]
        FC["🎮 Flight Controller<br/>(Pixhawk via MAVLink)"]
        CAM["📷 Cameras (×2)<br/>(RTSP Streams)"]
        UWB["📡 UWB Receiver<br/>(Precision Landing)"]
        LTE["📶 JioFi 4G/LTE<br/>(Internet)"]
    end

    UA <-->|REST + WS| GW
    SK <-->|REST + WS| GW
    AD <-->|REST + WS| GW

    GW --> AUTH & ORD & SHOP & FLEET & PAY & NOTIF
    AUTH & ORD & SHOP & FLEET --> MONGO
    FLEET --> REDIS
    NOTIF --> REDIS

    GW <--> WS
    FLEET <--> MQTT

    PI <-->|MQTT (4G/LTE)| MQTT
    PI <-->|MAVLink Serial| FC
    PI --- CAM
    PI --- UWB
    PI --- LTE
```

---

## 3. HIGH-LEVEL ARCHITECTURE

### Architecture Style: **Event-Driven Modular Monolith** (→ Microservices later)

We start with a modular monolith where each "service" is a separate module/folder within a single Node.js process. This gives us:
- ✅ Simple deployment (1 server)
- ✅ Easy debugging
- ✅ Clean boundaries for future split into microservices

```
Backend/
├── server.js                    # Express entry point
├── config/
│   ├── db.js                    # MongoDB connection
│   ├── redis.js                 # Redis connection
│   └── mqtt.js                  # MQTT broker connection
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── rbac.js                  # Role-based access control
│   └── rateLimiter.js           # API rate limiting
├── modules/
│   ├── auth/                    # 🔐 Authentication & Authorization
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.routes.js
│   │   └── auth.model.js        # User schema
│   ├── order/                   # 📦 Order Management
│   │   ├── order.controller.js
│   │   ├── order.service.js
│   │   ├── order.routes.js
│   │   └── order.model.js
│   ├── shop/                    # 🏪 Shop & Catalog
│   │   ├── shop.controller.js
│   │   ├── shop.service.js
│   │   ├── shop.routes.js
│   │   ├── shop.model.js
│   │   └── product.model.js
│   ├── fleet/                   # 🚁 Fleet & Drone Management
│   │   ├── fleet.controller.js
│   │   ├── fleet.service.js
│   │   ├── fleet.routes.js
│   │   ├── drone.model.js
│   │   └── telemetry.model.js
│   ├── payment/                 # 💳 Payment
│   │   ├── payment.controller.js
│   │   ├── payment.service.js
│   │   └── payment.routes.js
│   ├── notification/            # 🔔 Push Notifications
│   │   ├── notification.service.js
│   │   └── notification.routes.js
│   └── skylink/                 # 📍 SkyLink Port Registry
│       ├── skylink.controller.js
│       ├── skylink.service.js
│       ├── skylink.routes.js
│       └── skylink.model.js
├── websocket/
│   └── wsHub.js                 # WebSocket event hub
├── mqtt/
│   ├── mqttHandler.js           # MQTT message handler
│   └── topics.js                # MQTT topic definitions
└── utils/
    ├── haversine.js             # Distance calculation
    ├── generateOrderId.js       # Unique order IDs
    └── logger.js                # Winston logger
```

---

## 4. DEPLOYMENT ARCHITECTURE

```mermaid
graph TB
    subgraph "Internet / Cloud"
        CDN["🌐 CDN (Cloudflare)<br/>Static Assets"]
        LB["⚖️ Load Balancer<br/>(Nginx)"]
        
        subgraph "Application Server(s)"
            APP1["🖥️ Node.js Instance 1"]
            APP2["🖥️ Node.js Instance 2"]
        end
        
        MQTTB["📡 MQTT Broker<br/>(Mosquitto on VPS<br/>or AWS IoT Core)"]
        
        subgraph "Databases"
            MDB[("🗄️ MongoDB Atlas<br/>(Replica Set)")]
            RDB[("⚡ Redis Cloud")]
        end
    end

    subgraph "On-Ground (Warehouse)"
        GCS["🎖️ Admin GCS<br/>(Browser)"]
        SHOP_TAB["🏪 Shopkeeper Tablet"]
    end

    subgraph "In-Air (Per Drone)"
        RPI["🍓 Raspberry Pi"]
        JIOFI["📶 JioFi (4G)"]
        PIXHAWK["🎮 Pixhawk FC"]
    end

    subgraph "Customer Side"
        PHONE["📱 Customer Phone"]
        UWB_ANC["📡 UWB Anchors<br/>(at SkyLink Ports)"]
    end

    PHONE -->|HTTPS| CDN --> LB
    GCS -->|HTTPS| LB
    SHOP_TAB -->|HTTPS| LB
    LB --> APP1 & APP2
    APP1 & APP2 --> MDB & RDB
    APP1 & APP2 <--> MQTTB
    RPI <-->|MQTT over 4G| MQTTB
    RPI <-->|MAVLink Serial| PIXHAWK
    RPI --- JIOFI
```

---

## 5. DATABASE DESIGN (ER DIAGRAM)

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String phone UK
        String email UK
        String passwordHash
        String role "customer | shopkeeper | admin"
        Float defaultLat
        Float defaultLng
        String fcmToken "Push notification token"
        Date createdAt
        Date updatedAt
    }

    SHOP {
        ObjectId _id PK
        ObjectId ownerId FK "→ USER"
        String name
        String address
        Float lat
        Float lng
        String category "grocery | medical | tech | food"
        Boolean isActive
        String skyLinkPortId FK "→ SKYLINK_PORT"
        Object operatingHours "{ open, close }"
        Float rating
        Date createdAt
    }

    PRODUCT {
        ObjectId _id PK
        ObjectId shopId FK "→ SHOP"
        String name
        String description
        Float price
        String category
        String imageUrl
        Boolean inStock
        Float weight "grams"
        Date createdAt
    }

    ORDER {
        ObjectId _id PK
        String orderId UK "AURA-XXXXXX"
        ObjectId customerId FK "→ USER"
        ObjectId shopId FK "→ SHOP"
        ObjectId droneId FK "→ DRONE"
        Array items "[ {productId, name, qty, price} ]"
        Float totalPrice
        Float deliveryFee
        String status "See State Machine"
        String paymentStatus "pending | paid | refunded"
        String paymentId
        Float customerLat
        Float customerLng
        String skyLinkPortId FK "→ SKYLINK_PORT"
        Date createdAt
        Date acceptedAt
        Date packedAt
        Date dispatchedAt
        Date deliveredAt
        Date cancelledAt
    }

    DRONE {
        ObjectId _id PK
        String droneId UK "DRONE001"
        String status "idle | assigned | en_route_shop | loading | en_route_customer | delivering | returning | charging | maintenance"
        Float currentLat
        Float currentLng
        Float currentAlt
        Float batteryLevel
        String currentOrderId FK "→ ORDER"
        String homeBaseId FK "→ SKYLINK_PORT"
        Float maxPayloadKg
        Float maxRangeKm
        Date lastMaintenanceAt
        Date createdAt
    }

    TELEMETRY {
        ObjectId _id PK
        String droneId FK "→ DRONE"
        Float lat
        Float lng
        Float alt
        Float speed
        Float batteryVoltage
        Float batteryCurrent
        Float batteryPercent
        Float pitch
        Float roll
        Float yaw
        String missionState
        Date timestamp
    }

    SKYLINK_PORT {
        ObjectId _id PK
        String portId UK "SKL-01"
        String name
        String address
        Float lat
        Float lng
        String type "warehouse | delivery | dual"
        Boolean isActive
        Boolean hasUWB "UWB anchors installed?"
        Int capacity "Max drones simultaneously"
        Date createdAt
    }

    USER ||--o{ ORDER : "places"
    USER ||--o| SHOP : "owns"
    SHOP ||--o{ PRODUCT : "sells"
    SHOP ||--o{ ORDER : "receives"
    SHOP }o--|| SKYLINK_PORT : "pickup at"
    ORDER }o--|| DRONE : "assigned to"
    ORDER }o--|| SKYLINK_PORT : "deliver to"
    DRONE ||--o{ TELEMETRY : "streams"
    DRONE }o--|| SKYLINK_PORT : "home base"
```

---

## 6. BACKEND MICROSERVICES & API DESIGN

### 6.1 Auth Service

| Method | Endpoint              | Description              | Access       |
|--------|-----------------------|--------------------------|-------------|
| POST   | `/api/auth/register`  | Register new user        | Public       |
| POST   | `/api/auth/login`     | Login → JWT token        | Public       |
| POST   | `/api/auth/refresh`   | Refresh JWT              | Authenticated|
| GET    | `/api/auth/me`        | Get current user profile | Authenticated|
| PATCH  | `/api/auth/me`        | Update profile           | Authenticated|
| POST   | `/api/auth/fcm-token` | Save FCM push token      | Authenticated|

### 6.2 Shop & Catalog Service

| Method | Endpoint                        | Description                    | Access      |
|--------|---------------------------------|--------------------------------|-------------|
| GET    | `/api/shops`                    | List shops near user (geo)     | Customer    |
| GET    | `/api/shops/:id`                | Shop details                   | Customer    |
| GET    | `/api/shops/:id/products`       | Products in a shop             | Customer    |
| POST   | `/api/shops`                    | Register new shop              | Shopkeeper  |
| PATCH  | `/api/shops/:id`                | Update shop details            | Shopkeeper  |
| POST   | `/api/shops/:id/products`       | Add product                    | Shopkeeper  |
| PATCH  | `/api/products/:id`             | Update product                 | Shopkeeper  |
| DELETE | `/api/products/:id`             | Remove product                 | Shopkeeper  |

### 6.3 Order Service

| Method | Endpoint                        | Description                    | Access      |
|--------|---------------------------------|--------------------------------|-------------|
| POST   | `/api/orders`                   | Place new order                | Customer    |
| GET    | `/api/orders/:id`               | Get order details              | Authenticated|
| GET    | `/api/orders/my`                | Customer's order history       | Customer    |
| GET    | `/api/orders/shop/:shopId`      | Orders for a shop              | Shopkeeper  |
| PATCH  | `/api/orders/:id/accept`        | Shopkeeper accepts order       | Shopkeeper  |
| PATCH  | `/api/orders/:id/packed`        | Mark order packed              | Shopkeeper  |
| PATCH  | `/api/orders/:id/loaded`        | Drone loaded, ready to fly     | Shopkeeper  |
| PATCH  | `/api/orders/:id/cancel`        | Cancel order                   | Customer/Admin|
| GET    | `/api/orders/active`            | All active orders (GCS)        | Admin       |

### 6.4 Fleet Management Service

| Method | Endpoint                        | Description                    | Access      |
|--------|---------------------------------|--------------------------------|-------------|
| GET    | `/api/fleet/drones`             | List all drones                | Admin       |
| GET    | `/api/fleet/drones/:id`         | Drone status                   | Admin       |
| POST   | `/api/fleet/drones`             | Register new drone             | Admin       |
| PATCH  | `/api/fleet/drones/:id`         | Update drone status            | Admin       |
| GET    | `/api/fleet/drones/:id/telemetry`| Latest telemetry              | Admin       |
| GET    | `/api/fleet/available`          | Find nearest idle drone        | Internal    |
| POST   | `/api/fleet/dispatch`           | Dispatch drone for order       | Internal    |
| POST   | `/api/fleet/abort/:droneId`     | Emergency abort (RTL)          | Admin       |

### 6.5 SkyLink Port Service

| Method | Endpoint                        | Description                    | Access      |
|--------|---------------------------------|--------------------------------|-------------|
| GET    | `/api/skylink/ports`            | List all ports                 | Public      |
| GET    | `/api/skylink/nearest`          | Find nearest port to lat/lng   | Customer    |
| POST   | `/api/skylink/ports`            | Register new port              | Admin       |
| PATCH  | `/api/skylink/ports/:id`        | Update port                    | Admin       |

### 6.6 Payment Service

| Method | Endpoint                        | Description                    | Access      |
|--------|---------------------------------|--------------------------------|-------------|
| POST   | `/api/payment/initiate`         | Create payment (Razorpay/Stripe)| Customer   |
| POST   | `/api/payment/verify`           | Verify payment callback        | Webhook     |
| GET    | `/api/payment/:orderId`         | Payment status                 | Customer    |

---

## 7. COMMUNICATION PROTOCOLS

### 7.1 Who talks to whom?

```mermaid
graph LR
    subgraph "REST API (HTTPS)"
        UA_R["User App"] -->|"Orders, Shops, Auth"| BE["Backend"]
        SK_R["Shopkeeper"] -->|"Accept, Pack, Load"| BE
        AD_R["Admin GCS"] -->|"Fleet, Analytics"| BE
    end

    subgraph "WebSocket (Real-time UI)"
        BE -->|"Order status updates"| UA_W["User App"]
        BE -->|"New order alerts"| SK_W["Shopkeeper"]
        BE -->|"Fleet telemetry"| AD_W["Admin GCS"]
    end

    subgraph "MQTT (Drone Telemetry)"
        DR["Drone (Pi)"] <-->|"Publish: telemetry<br/>Subscribe: commands"| MQ["MQTT Broker"]
        MQ <-->|"Subscribe: telemetry<br/>Publish: commands"| BE2["Backend"]
    end
```

### 7.2 MQTT Topics

```
aura/drone/{droneId}/telemetry        ← Drone PUBLISHES every 1s
                                         { lat, lng, alt, battery, speed, pitch, roll, yaw, missionState }

aura/drone/{droneId}/command           → Backend PUBLISHES commands
                                         { action: "goto_shop" | "goto_customer" | "return_base" | "abort" | "land",
                                           targetLat, targetLng, targetAlt, orderId }

aura/drone/{droneId}/status            ← Drone PUBLISHES state changes
                                         { status: "idle" | "armed" | "taking_off" | ... , timestamp }

aura/drone/{droneId}/ack               ← Drone PUBLISHES command acknowledgments
                                         { commandId, result: "accepted" | "rejected", reason }

aura/fleet/heartbeat                   ← All drones PUBLISH every 5s
                                         { droneId, batteryLevel, status }
```

### 7.3 WebSocket Events

```
SERVER → CLIENT:
  "order:status_update"      → { orderId, status, droneId, eta }
  "order:new"                → { orderId, items, shopId }          (to shopkeeper)
  "drone:telemetry"          → { droneId, lat, lng, alt, battery } (to admin/user tracking)
  "drone:status_change"      → { droneId, oldStatus, newStatus }   (to admin)
  "notification"             → { title, body, type }

CLIENT → SERVER:
  "join:order:{orderId}"     → Subscribe to order updates
  "join:shop:{shopId}"       → Subscribe to shop's incoming orders
  "join:fleet"               → Subscribe to all fleet telemetry (admin only)
```

---

## 8. USER APP — SCREENS & FLOW

```mermaid
graph TD
    SPLASH["🎬 Splash Screen<br/>AURA Logo + Animation"] --> AUTH_CHECK{Logged in?}
    AUTH_CHECK -->|No| LOGIN["🔐 Login / Register<br/>Phone OTP / Email"]
    AUTH_CHECK -->|Yes| HOME

    LOGIN --> HOME["🏠 Home Screen<br/>- Location bar<br/>- Category cards<br/>- Nearby shops<br/>- Promotional banners"]

    HOME --> SHOP_LIST["🏪 Shop List<br/>- Filter by category<br/>- Distance & rating sort<br/>- Search bar"]
    HOME --> ORDERS["📋 My Orders<br/>- Active orders<br/>- Past order history"]

    SHOP_LIST --> SHOP_DETAIL["🏪 Shop Detail<br/>- Product grid<br/>- Category tabs<br/>- Cart preview bar"]

    SHOP_DETAIL --> CART["🛒 Cart Screen<br/>- Items with qty<br/>- Price breakdown<br/>- Delivery fee<br/>- SkyLink port assigned"]

    CART --> PAYMENT["💳 Payment Screen<br/>- UPI / Card / Wallet<br/>- Razorpay integration"]

    PAYMENT --> TRACKING["📍 Live Tracking<br/>- Full-screen Leaflet map<br/>- Drone icon on flight path<br/>- ETA countdown<br/>- Status timeline<br/>- Winch drop animation<br/>- Delivery celebration"]

    ORDERS --> ORDER_DETAIL["📦 Order Detail<br/>- Items, amounts<br/>- Drone assignment<br/>- Status timeline<br/>- Re-order button"]

    TRACKING --> DELIVERED["✅ Delivery Complete<br/>- Collect from SkyLink<br/>- Rate experience<br/>- Tip drone (optional 😄)"]
```

### User App Tech Stack
| Layer      | Technology                         |
|------------|-----------------------------------|
| Framework  | React (Vite) or React Native      |
| Styling    | Tailwind CSS                       |
| Animations | Framer Motion                      |
| Maps       | React-Leaflet / Mapbox GL          |
| State      | React Context + useReducer         |
| HTTP       | Axios                              |
| WebSocket  | socket.io-client                   |
| Payment    | Razorpay Web SDK                   |

---

## 9. SHOPKEEPER APP — SCREENS & FLOW

```mermaid
graph TD
    SK_LOGIN["🔐 Shopkeeper Login"] --> SK_DASH["📊 Dashboard<br/>- Today's stats<br/>- Active orders count<br/>- Revenue summary"]

    SK_DASH --> SK_ORDERS["📋 Live Order Queue<br/>┌─────────────────────┐<br/>│ NEW (🔴 bell ring)  │<br/>│ ACCEPTED (🟡)       │<br/>│ PACKING (🟠)        │<br/>│ READY (🟢)          │<br/>│ LOADED (✅)         │<br/>└─────────────────────┘"]

    SK_ORDERS --> SK_DETAIL["📦 Order Detail<br/>- Customer name<br/>- Items to pack<br/>- Checklist UI<br/>- Drone info"]

    SK_DETAIL -->|"Accept"| ACCEPT["✅ Order Accepted<br/>→ Customer notified<br/>→ Start packing"]
    ACCEPT -->|"All items packed"| PACKED["📦 Order Packed<br/>→ Drone dispatched to shop"]
    PACKED -->|"Drone arrives, load parcel"| LOADED["🚁 Drone Loaded<br/>→ Confirm weight<br/>→ Drone takes off to customer"]

    SK_DASH --> SK_CATALOG["📝 Manage Catalog<br/>- Add/Edit/Delete products<br/>- Toggle availability<br/>- Update prices"]

    SK_DASH --> SK_PROFILE["⚙️ Shop Settings<br/>- Operating hours<br/>- SkyLink port assignment<br/>- Account details"]
```

### Shopkeeper App Features
| Feature                | Description |
|------------------------|-------------|
| **Real-time alerts**   | WebSocket push when new order arrives — loud notification sound |
| **Order queue**        | Kanban-style board: New → Accepted → Packing → Ready → Loaded |
| **Item checklist**     | Tap each item as it's packed — prevents missed items |
| **Drone status**       | See assigned drone, ETA to shop, battery level |
| **Load confirmation**  | Physical scan/tap to confirm parcel on drone. Triggers takeoff |
| **Daily analytics**    | Orders completed, revenue, avg prep time |

---

## 10. ADMIN GCS DASHBOARD

```mermaid
graph TD
    AD_LOGIN["🔐 Admin Login<br/>(Role: admin)"] --> GCS["🎖️ Ground Control Station"]

    GCS --> MAP["🗺️ Tactical Fleet Map<br/>- All drones on radar<br/>- Flight paths drawn<br/>- Status color coding<br/>- Click drone for details"]

    GCS --> FLEET["🚁 Fleet Panel<br/>- Drone list with status<br/>- Battery levels<br/>- Current mission<br/>- Maintenance schedule"]

    GCS --> ORDERS_ADMIN["📦 All Active Orders<br/>- Order → Shop → Drone mapping<br/>- Override / Cancel"]

    GCS --> USERS_ADMIN["👥 User Management<br/>- Customers list<br/>- Shopkeepers list<br/>- Approval queue"]

    GCS --> SKYLINK_ADMIN["📍 SkyLink Port Mgmt<br/>- Port locations on map<br/>- Enable / Disable<br/>- UWB status"]

    GCS --> ANALYTICS["📊 Analytics Dashboard<br/>- Orders per day/hour<br/>- Avg delivery time<br/>- Revenue charts<br/>- Fleet utilization"]

    MAP --> DRONE_DETAIL["🚁 Drone Detail Panel<br/>- Live telemetry readout<br/>- Camera feeds (2 streams)<br/>- Manual override controls<br/>- Emergency ABORT button"]
```

### GCS Tech Details
| Feature              | Implementation |
|----------------------|---------------|
| **Radar map**        | Leaflet + CSS `invert/hue-rotate` filter for tactical look |
| **Live drone icons** | Custom Leaflet markers, rotated by yaw angle |
| **Telemetry stream** | WebSocket from backend (bridged from MQTT) |
| **Camera feeds**     | `<img>` tag pointing to Pi's Flask MJPEG endpoint |
| **Emergency abort**  | POST `/api/fleet/abort/:droneId` → MQTT → Drone switches to STABILIZE |

---

## 11. DRONE EDGE SYSTEM (PYTHON)

### Architecture on Raspberry Pi

```mermaid
graph TD
    subgraph "Raspberry Pi (Companion Computer)"
        MAIN["main.py<br/>(Entry Point)"]

        MAIN --> MAV["mavlink_handler.py<br/>- Connect to Pixhawk<br/>- Send/receive MAVLink<br/>- Attribute listeners"]

        MAIN --> MQTT_C["mqtt_client.py<br/>- Connect to broker<br/>- Publish telemetry @ 1Hz<br/>- Subscribe to commands"]

        MAIN --> MISSION["mission_manager.py<br/>- State machine<br/>- fly_to_and_wait()<br/>- change_altitude()<br/>- precision_land()"]

        MAIN --> CAM_M["camera_manager.py<br/>- RTSP capture<br/>- MJPEG Flask server<br/>- Dual camera"]

        MAIN --> UWB_M["uwb_handler.py<br/>- Serial to UWB receiver<br/>- Distance to anchors<br/>- Precision offset calc"]

        MAIN --> SAFETY["safety_monitor.py<br/>- Battery watchdog<br/>- RC override detection<br/>- Geofence check<br/>- Auto RTL on low battery"]
    end

    subgraph "External"
        PIXHAWK["🎮 Pixhawk FC<br/>(Serial /dev/ttyACM0)"]
        BROKER["📡 MQTT Broker<br/>(Cloud)"]
        UWB_A["📡 UWB Anchors<br/>(at SkyLink)"]
    end

    MAV <-->|MAVLink| PIXHAWK
    MQTT_C <-->|MQTT over 4G| BROKER
    UWB_M <-->|Serial| UWB_A
```

### Drone Mission State Machine

```
IDLE → ARMED → TAKING_OFF → FLYING_TO_SHOP → HOVERING_AT_SHOP
→ LOADING → FLYING_TO_CUSTOMER → DESCENDING → DELIVERING (servo)
→ CLIMBING → RETURNING_HOME → LANDING → IDLE
```

At ANY point: RC Override → ABORT (STABILIZE, pilot takes over)

---

## 12. COMPLETE ORDER LIFECYCLE — SEQUENCE DIAGRAM

```mermaid
sequenceDiagram
    autonumber
    participant C as 👤 Customer App
    participant BE as ☁️ Backend
    participant DB as 🗄️ MongoDB
    participant WS as ⚡ WebSocket Hub
    participant SK as 🏪 Shopkeeper App
    participant MQTT as 📡 MQTT Broker
    participant D as 🚁 Drone (Pi)

    Note over C,D: ── PHASE 1: ORDER PLACEMENT ──

    C->>BE: POST /api/orders { shopId, items, customerLat/Lng }
    BE->>BE: Calculate nearest SkyLink port (Haversine)
    BE->>BE: Calculate delivery fee based on distance
    BE->>DB: Save order (status: "pending_payment")
    BE->>C: 201 { orderId, totalPrice, skyLinkPort }

    C->>BE: POST /api/payment/initiate { orderId, amount }
    BE->>C: { razorpayOrderId }
    C->>C: Razorpay checkout UI
    C->>BE: POST /api/payment/verify { paymentId, signature }
    BE->>DB: Update order (status: "placed", paymentStatus: "paid")

    Note over C,D: ── PHASE 2: SHOPKEEPER ACCEPTS ──

    BE->>WS: Emit "order:new" to shop:{shopId}
    WS->>SK: NEW ORDER ALERT
    SK->>BE: PATCH /api/orders/:id/accept
    BE->>DB: Update order (status: "accepted")
    BE->>WS: Emit "order:status_update"
    WS->>C: "Order accepted! Shop is preparing..."

    Note over C,D: ── PHASE 3: PACKING & DRONE DISPATCH ──

    SK->>BE: PATCH /api/orders/:id/packed
    BE->>DB: Update order (status: "packed")
    BE->>BE: Find nearest IDLE drone (Redis GEO query)
    BE->>DB: Assign drone to order (drone.status → "assigned")
    BE->>DB: Update order (droneId, status: "drone_assigned")
    BE->>MQTT: Publish aura/drone/{id}/command { action: "goto_shop", shopLat, shopLng }
    MQTT->>D: 📡 Command: Fly to shop
    D->>D: ARM → TAKEOFF → FLY TO SHOP

    Note over C,D: ── PHASE 4: DRONE AT SHOP ──

    D->>MQTT: Publish status { status: "at_shop" }
    MQTT->>BE: Drone at shop
    BE->>WS: Emit to shopkeeper
    WS->>SK: "Drone arrived! Load the parcel."
    SK->>SK: Physically load parcel onto drone
    SK->>BE: PATCH /api/orders/:id/loaded
    BE->>DB: Update order (status: "loaded")
    BE->>MQTT: Publish command { action: "goto_customer", customerSkyLink }
    MQTT->>D: 📡 Command: Fly to customer SkyLink

    Note over C,D: ── PHASE 5: IN-FLIGHT TRACKING ──

    loop Every 1 second
        D->>MQTT: Publish telemetry { lat, lng, alt, battery, speed }
        MQTT->>BE: Receive telemetry
        BE->>DB: Save to Telemetry collection
        BE->>BE: Calculate ETA
        BE->>WS: Emit "drone:telemetry" to order:{orderId}
        WS->>C: 📍 Live map update + ETA
    end

    Note over C,D: ── PHASE 6: DELIVERY ──

    D->>D: Arrived at SkyLink → Descend → UWB precision
    D->>D: Servo release (payload drop)
    D->>MQTT: Publish status { status: "delivered" }
    MQTT->>BE: Delivery confirmed
    BE->>DB: Update order (status: "delivered", deliveredAt)
    BE->>WS: Emit "order:status_update"
    WS->>C: "✅ Package delivered! Collect from SkyLink Port"
    BE->>C: Push notification (FCM)

    Note over C,D: ── PHASE 7: RETURN TO BASE ──

    BE->>MQTT: Publish command { action: "return_base" }
    MQTT->>D: 📡 Command: Return to charging pad
    D->>D: Fly home → Land → Disarm
    D->>MQTT: Publish status { status: "idle" }
    MQTT->>BE: Drone available again
    BE->>DB: Update drone (status: "idle", currentOrderId: null)
```

---

## 13. FLEET MANAGEMENT & DISPATCH ALGORITHM

### Finding the Best Drone

```
INPUT:  shopLat, shopLng (order's shop location)
OUTPUT: bestDrone (nearest idle drone with sufficient battery)

ALGORITHM:
  1. Query Redis GEO for all drones within 10km of shop
     → GEORADIUS drones:locations shopLng shopLat 10 km ASC

  2. Filter: status === "idle" AND batteryLevel >= 40%

  3. Sort by:
     a. Distance to shop (ascending)     — primary
     b. Battery level (descending)       — secondary

  4. Pick drone[0] → Assign to order

  5. If no drones available:
     → Queue order (Redis FIFO queue)
     → Notify admin via WebSocket
     → Notify customer: "All drones busy, ETA ~X min"

  6. When any drone becomes idle:
     → Pop from queue → Auto-dispatch
```

### Redis Geospatial Commands Used

```bash
# Store drone location (updated from MQTT telemetry)
GEOADD drones:locations 78.2210 30.0133 "DRONE001"

# Find drones near shop
GEORADIUS drones:locations 78.2200 30.0125 10 km ASC COUNT 5

# Calculate distance
GEODIST drones:locations "DRONE001" "SHOP_SKL02" km
```

---

## 14. CLASS DIAGRAM — BACKEND DOMAIN MODELS

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String phone
        +String email
        +String passwordHash
        +String role
        +Float defaultLat
        +Float defaultLng
        +String fcmToken
        +register()
        +login()
        +updateProfile()
    }

    class Shop {
        +ObjectId _id
        +ObjectId ownerId
        +String name
        +String address
        +Float lat
        +Float lng
        +String category
        +Boolean isActive
        +String skyLinkPortId
        +addProduct()
        +updateProduct()
        +toggleActive()
    }

    class Product {
        +ObjectId _id
        +ObjectId shopId
        +String name
        +Float price
        +String category
        +String imageUrl
        +Boolean inStock
        +Float weight
    }

    class Order {
        +ObjectId _id
        +String orderId
        +ObjectId customerId
        +ObjectId shopId
        +ObjectId droneId
        +Array items
        +Float totalPrice
        +String status
        +String paymentStatus
        +Float customerLat
        +Float customerLng
        +String skyLinkPortId
        +place()
        +accept()
        +markPacked()
        +markLoaded()
        +markDelivered()
        +cancel()
    }

    class Drone {
        +ObjectId _id
        +String droneId
        +String status
        +Float currentLat
        +Float currentLng
        +Float batteryLevel
        +String currentOrderId
        +String homeBaseId
        +assignMission()
        +updateTelemetry()
        +abort()
        +returnToBase()
    }

    class SkyLinkPort {
        +ObjectId _id
        +String portId
        +String name
        +Float lat
        +Float lng
        +String type
        +Boolean hasUWB
        +Int capacity
    }

    class Telemetry {
        +ObjectId _id
        +String droneId
        +Float lat
        +Float lng
        +Float alt
        +Float speed
        +Float batteryVoltage
        +String missionState
        +Date timestamp
    }

    User "1" --> "*" Order : places
    User "1" --> "0..1" Shop : owns
    Shop "1" --> "*" Product : sells
    Shop "1" --> "*" Order : receives
    Shop "*" --> "1" SkyLinkPort : pickup_at
    Order "*" --> "0..1" Drone : assigned_to
    Order "*" --> "1" SkyLinkPort : deliver_to
    Drone "1" --> "*" Telemetry : streams
    Drone "*" --> "1" SkyLinkPort : home_base
```

---

## 15. STATE MACHINE — ORDER STATES

```mermaid
stateDiagram-v2
    [*] --> pending_payment : User places order

    pending_payment --> placed : Payment successful
    pending_payment --> cancelled : Payment failed / timeout

    placed --> accepted : Shopkeeper accepts
    placed --> cancelled : Shopkeeper rejects / timeout

    accepted --> packed : Shopkeeper finishes packing
    accepted --> cancelled : Shopkeeper cancels

    packed --> drone_assigned : Dispatcher finds idle drone

    drone_assigned --> drone_en_route_shop : Drone takes off to shop
    drone_assigned --> packed : Drone unavailable (reassign)

    drone_en_route_shop --> drone_at_shop : Drone arrives at shop SkyLink

    drone_at_shop --> loaded : Shopkeeper loads parcel

    loaded --> in_flight : Drone takes off to customer SkyLink

    in_flight --> arriving : Drone within 200m of destination

    arriving --> delivering : Drone descending + winch drop

    delivering --> delivered : Servo release + confirmed

    delivered --> completed : Customer rated / auto-complete after 1hr

    cancelled --> [*]
    completed --> [*]

    note right of in_flight : Live tracking active
    note right of delivering : UWB precision landing
```

---

## 16. STATE MACHINE — DRONE STATES

```mermaid
stateDiagram-v2
    [*] --> idle : Boot / Mission complete

    idle --> assigned : Backend assigns order
    assigned --> arming : Received goto_shop command
    arming --> taking_off : Motors armed

    taking_off --> flying_to_shop : Reached cruise altitude

    flying_to_shop --> hovering_at_shop : Arrived at shop SkyLink

    hovering_at_shop --> loading : Shopkeeper loading
    loading --> flying_to_customer : Loaded confirmed, takeoff

    flying_to_customer --> descending : Arrived at customer SkyLink
    descending --> delivering : Reached drop altitude
    delivering --> climbing : Servo release complete

    climbing --> returning_home : Reached cruise altitude
    returning_home --> landing : Arrived at base
    landing --> idle : Disarmed

    idle --> charging : Battery < 20%
    charging --> idle : Battery > 80%

    idle --> maintenance : Scheduled / flagged
    maintenance --> idle : Cleared by admin

    arming --> aborted : RC override / safety fail
    taking_off --> aborted : RC override
    flying_to_shop --> aborted : RC override / low battery
    flying_to_customer --> aborted : RC override / low battery
    descending --> aborted : RC override
    returning_home --> aborted : RC override

    aborted --> idle : Manual reset

    note right of aborted : STABILIZE mode<br/>Pilot takes over
    note left of charging : At charging pad
```

---

## 17. SECURITY ARCHITECTURE

### Authentication & Authorization

```
┌──────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. HTTPS (TLS 1.3) — All traffic encrypted              │
│                                                          │
│  2. JWT Authentication                                    │
│     - Access Token (15min) + Refresh Token (7 days)      │
│     - Stored in HttpOnly cookie (web) / SecureStore (app)│
│                                                          │
│  3. Role-Based Access Control (RBAC)                     │
│     ┌────────────┬──────────────────────────────────┐    │
│     │   Role     │   Permissions                    │    │
│     ├────────────┼──────────────────────────────────┤    │
│     │ customer   │ Browse, order, track, pay        │    │
│     │ shopkeeper │ Manage shop, accept orders       │    │
│     │ admin      │ Fleet control, user mgmt, GCS    │    │
│     │ drone      │ Telemetry push only (API key)    │    │
│     └────────────┴──────────────────────────────────┘    │
│                                                          │
│  4. API Key for Drone ↔ Backend (MQTT + REST)            │
│     - Unique key per drone, rotated monthly              │
│                                                          │
│  5. Rate Limiting (Redis-based)                          │
│     - 100 req/min per user, 1000 req/min per shop        │
│                                                          │
│  6. Input Validation (Joi / Zod schemas on all routes)   │
│                                                          │
│  7. Geofence — Drone cannot fly outside 50km radius      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 18. SCALABILITY & FUTURE ROADMAP

### Phase 1 (Current → 3 months): MVP
- [x] Single drone delivery simulation
- [ ] Multi-shop catalog
- [ ] Real payment integration (Razorpay)
- [ ] Shopkeeper app
- [ ] MQTT-based real telemetry (replace HTTP polling)

### Phase 2 (3–6 months): Multi-Drone Fleet
- [ ] Fleet of 5-10 drones
- [ ] Automated dispatch algorithm
- [ ] Battery management & auto-charging
- [ ] SkyLink port UWB installation

### Phase 3 (6–12 months): City Scale
- [ ] 50+ drones, 100+ shops
- [ ] Split to microservices (Kubernetes)
- [ ] ML-based ETA prediction
- [ ] Dynamic pricing based on demand
- [ ] Regulatory compliance (DGCA India)

### Phase 4 (12+ months): Multi-City
- [ ] Multi-city deployment
- [ ] Franchise model for shops
- [ ] Drone-as-a-Service API for B2B
- [ ] Advanced autonomy (obstacle avoidance, VTOL transitions)

---

## QUICK REFERENCE — TECH STACK SUMMARY

| Component          | Technology                                  |
|--------------------|---------------------------------------------|
| **User App**       | React / React Native, Tailwind, Framer Motion|
| **Shopkeeper App** | React, Tailwind, Socket.io                  |
| **Admin GCS**      | React, Leaflet, Tailwind, Socket.io         |
| **Backend**        | Node.js, Express, Mongoose, Socket.io       |
| **Database**       | MongoDB Atlas (primary), Redis (geo + cache)|
| **MQTT Broker**    | Mosquitto / AWS IoT Core                    |
| **Drone Edge**     | Python, DroneKit, MAVLink, MQTT (paho)      |
| **Payment**        | Razorpay / Stripe                           |
| **Push Notif**     | Firebase Cloud Messaging (FCM)              |
| **Deployment**     | VPS (Render/Railway) → AWS ECS/K8s later    |
| **CI/CD**          | GitHub Actions                              |
| **Monitoring**     | Winston logs, Grafana + Prometheus (later)  |
