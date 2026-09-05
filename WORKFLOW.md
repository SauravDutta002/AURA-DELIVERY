# 🔄 AURA DRONE DELIVERY — COMPLETE WORKFLOW
### *Every step, every stakeholder, every decision — from app open to package in hand*

---

## 1. THE BIG PICTURE — END TO END

```mermaid
graph LR
    A["👤 Customer<br/>Opens App"] --> B["🛒 Browse &<br/>Add to Cart"]
    B --> C["💳 Pay"]
    C --> D["🏪 Shopkeeper<br/>Gets Alert"]
    D --> E["📦 Pack<br/>Items"]
    E --> F["🚁 Drone<br/>Dispatched"]
    F --> G["🏪 Drone Picks<br/>from Shop"]
    G --> H["✈️ Drone Flies<br/>to Customer"]
    H --> I["📍 Drone Lands<br/>at SkyLink"]
    I --> J["📦 Package<br/>Dropped"]
    J --> K["👤 Customer<br/>Collects"]
    K --> L["🚁 Drone<br/>Returns Home"]
```

---

## 2. DETAILED WORKFLOW — EVERY STAKEHOLDER'S VIEW

### PHASE 1: CUSTOMER PLACES ORDER

```mermaid
flowchart TD
    START(("👤 Customer<br/>Opens App")) --> LOGIN{"Logged in?"}
    LOGIN -->|No| REG["Register / Login<br/>(Phone OTP)"]
    REG --> HOME
    LOGIN -->|Yes| HOME["🏠 Home Screen<br/>Shows nearby shops<br/>based on GPS location"]

    HOME --> BROWSE["🔍 Browse Shops<br/>Filter: Grocery, Medical,<br/>Tech, Food"]
    BROWSE --> SHOP["🏪 Select a Shop<br/>See products, prices,<br/>ratings, delivery time"]
    SHOP --> ADD["🛒 Add Items to Cart<br/>Select quantity<br/>See running total"]
    ADD --> MORE{"Add more<br/>items?"}
    MORE -->|Yes| SHOP
    MORE -->|No| CART["🛒 View Cart<br/>- Item list with qty<br/>- Subtotal<br/>- Delivery fee<br/>- Platform fee<br/>- Total amount"]

    CART --> SKYLINK["📍 Auto-Assign SkyLink Port<br/>Nearest port to customer's<br/>GPS location (Haversine)"]
    SKYLINK --> CONFIRM["Review Order<br/>- Items ✅<br/>- SkyLink pickup point ✅<br/>- Estimated delivery time ✅<br/>- Total price ✅"]

    CONFIRM --> PAY["💳 Payment<br/>- UPI (Google Pay, PhonePe)<br/>- Credit/Debit Card<br/>- Wallet"]
    PAY --> PAY_STATUS{"Payment<br/>Success?"}
    PAY_STATUS -->|Failed| PAY
    PAY_STATUS -->|Success| PLACED["✅ ORDER PLACED<br/>Order ID: AURA-XXXXXX<br/>Status: PLACED"]

    PLACED --> WAIT["⏳ Waiting Screen<br/>'Looking for your shop...'"]

    style START fill:#4CAF50,color:#fff
    style PLACED fill:#2196F3,color:#fff
    style SKYLINK fill:#FF9800,color:#fff
```

---

### PHASE 2: SHOPKEEPER RECEIVES & PREPARES ORDER

```mermaid
flowchart TD
    ALERT(("🔔 NEW ORDER<br/>ALERT<br/>(Push + Sound)")) --> QUEUE["📋 Order Appears in Queue<br/>Status: NEW<br/>Shows: Items, Qty, Customer area"]

    QUEUE --> DECIDE{"Accept or<br/>Reject?"}
    DECIDE -->|Reject| REJECT["❌ Order Rejected<br/>→ Backend tries next<br/>nearest shop<br/>→ Customer notified"]
    DECIDE -->|Timeout 2min| REJECT
    DECIDE -->|Accept| ACCEPT["✅ ACCEPTED<br/>Timer starts:<br/>Prep time tracking"]

    ACCEPT --> PACK["📦 Pack Items<br/>Checklist UI:<br/>☐ Item 1 (×2)<br/>☐ Item 2 (×1)<br/>☐ Item 3 (×3)"]
    PACK --> CHECK["✅ All Items Checked<br/>Mark as PACKED"]

    CHECK --> WEIGHT["⚖️ Enter Package Weight<br/>(Must be under drone<br/>max payload: 2kg)"]
    WEIGHT --> OVER{"Over weight<br/>limit?"}
    OVER -->|Yes| SPLIT["⚠️ Split into<br/>multiple deliveries<br/>or remove items"]
    SPLIT --> WEIGHT
    OVER -->|No| READY["📦 ORDER READY<br/>Status: PACKED<br/>→ Drone dispatched to shop"]

    READY --> WAIT_DRONE["⏳ Waiting for Drone<br/>Shows: Drone ID, ETA to shop,<br/>Battery level"]
    WAIT_DRONE --> DRONE_ARRIVES["🚁 Drone Arrives at<br/>Shop SkyLink Port"]

    DRONE_ARRIVES --> LOAD["📦 LOAD PARCEL<br/>1. Place box on drone mount<br/>2. Secure with clip<br/>3. Tap 'LOADED' button"]
    LOAD --> LOADED["✅ LOADED<br/>→ Drone takes off<br/>→ Flying to customer"]

    style ALERT fill:#f44336,color:#fff
    style ACCEPT fill:#4CAF50,color:#fff
    style LOADED fill:#2196F3,color:#fff
```

---

### PHASE 3: DRONE DISPATCH & ASSIGNMENT

```mermaid
flowchart TD
    TRIGGER(("📦 Order PACKED<br/>by Shopkeeper")) --> FIND["🔍 FIND BEST DRONE<br/>Query: All drones within<br/>10km of shop"]

    FIND --> FILTER["Filter Criteria:<br/>1. Status = IDLE<br/>2. Battery ≥ 40%<br/>3. Payload capacity OK<br/>4. No maintenance flag"]

    FILTER --> FOUND{"Drone<br/>found?"}
    FOUND -->|No| QUEUE["📋 Add to Dispatch Queue<br/>→ Wait for next available drone<br/>→ Notify admin<br/>→ Tell customer: 'Slight delay'"]
    QUEUE --> RETRY["🔄 Retry every 30 seconds"]
    RETRY --> FOUND

    FOUND -->|Yes| SORT["Sort by:<br/>1. Distance to shop (nearest)<br/>2. Battery level (highest)"]
    SORT --> ASSIGN["✅ DRONE ASSIGNED<br/>Drone ID: DRONE-001<br/>→ Update order status<br/>→ Update drone status"]

    ASSIGN --> COMMAND["📡 Send MQTT Command<br/>Topic: aura/drone/DRONE001/command<br/>Action: GOTO_SHOP<br/>Target: Shop SkyLink coordinates"]

    COMMAND --> NOTIFY_ALL["📢 Notify Everyone:<br/>👤 Customer: 'Drone assigned!'<br/>🏪 Shopkeeper: 'Drone on the way!'<br/>🎖️ Admin: Drone on fleet map"]

    style TRIGGER fill:#FF9800,color:#fff
    style ASSIGN fill:#4CAF50,color:#fff
    style COMMAND fill:#2196F3,color:#fff
```

---

### PHASE 4: DRONE FLIGHT — SHOP PICKUP

```mermaid
flowchart TD
    CMD(("📡 Drone Receives<br/>GOTO_SHOP Command")) --> PRE["🔍 PRE-FLIGHT CHECKS<br/>1. GPS lock? ✅<br/>2. Battery OK? ✅<br/>3. Motors OK? ✅<br/>4. No RC override? ✅"]

    PRE --> PREFAIL{"All checks<br/>pass?"}
    PREFAIL -->|No| ABORT1["❌ ABORT<br/>→ Notify backend<br/>→ Reassign to another drone"]
    PREFAIL -->|Yes| ARM["⚡ ARM Motors"]

    ARM --> TAKEOFF["📈 TAKEOFF<br/>Climb to cruise altitude<br/>(40m AGL)"]
    TAKEOFF --> CRUISE["✈️ FLY TO SHOP<br/>- GPS waypoint navigation<br/>- Maintain altitude<br/>- Stream telemetry @ 1Hz"]

    CRUISE --> TELEM["📡 Every 1 Second:<br/>Drone → MQTT → Backend<br/>→ WebSocket → All Apps<br/><br/>Data: lat, lng, alt,<br/>speed, battery, ETA"]

    TELEM --> ARRIVE_SHOP{"Arrived at<br/>Shop SkyLink?<br/>(within 2m radius)"}
    ARRIVE_SHOP -->|No| CRUISE
    ARRIVE_SHOP -->|Yes| HOVER["🚁 HOVER at Shop SkyLink<br/>→ Status: AT_SHOP<br/>→ Notify shopkeeper:<br/>'Load the parcel!'"]

    HOVER --> WAIT_LOAD["⏳ Wait for Shopkeeper<br/>to load and confirm"]

    style CMD fill:#2196F3,color:#fff
    style HOVER fill:#FF9800,color:#fff
    style TELEM fill:#9C27B0,color:#fff
```

---

### PHASE 5: DRONE FLIGHT — DELIVERY TO CUSTOMER

```mermaid
flowchart TD
    LOADED(("✅ Shopkeeper<br/>Confirms LOADED")) --> CMD2["📡 MQTT Command:<br/>GOTO_CUSTOMER<br/>Target: Customer's SkyLink Port"]

    CMD2 --> FLY["✈️ FLY TO CUSTOMER SKYLINK<br/>- Navigate to port coordinates<br/>- Cruise altitude: 40m<br/>- Avoid other drones (future)"]

    FLY --> LIVE["📍 LIVE TRACKING<br/>Customer sees on map:<br/>- Drone icon moving<br/>- Flight path line<br/>- ETA countdown<br/>- Distance remaining"]

    LIVE --> NEAR{"Within<br/>200m?"}
    NEAR -->|No| FLY
    NEAR -->|Yes| ARRIVING["📢 ARRIVING<br/>→ Push notification to customer:<br/>'Your drone is arriving!'<br/>→ Status: ARRIVING"]

    ARRIVING --> UWB{"UWB Anchors<br/>detected?"}
    UWB -->|Yes| PRECISION["📡 UWB PRECISION APPROACH<br/>Switch from GPS to UWB<br/>for cm-level accuracy"]
    UWB -->|No| GPS_LAND["📍 GPS Landing<br/>(less precise, ~1-2m accuracy)"]

    PRECISION --> DESCEND["⬇️ DESCEND<br/>From 40m → 5m<br/>Directly above SkyLink pad"]
    GPS_LAND --> DESCEND

    DESCEND --> DROP["📦 PACKAGE DROP<br/>1. Hover at 5m<br/>2. Winch lowers package<br/>3. Servo releases<br/>4. Package on ground"]

    DROP --> CONFIRM_DEL["✅ DELIVERY CONFIRMED<br/>→ Status: DELIVERED<br/>→ Push notification:<br/>'Package delivered!'<br/>→ Timestamp recorded"]

    style LOADED fill:#4CAF50,color:#fff
    style LIVE fill:#9C27B0,color:#fff
    style DROP fill:#FF5722,color:#fff
    style CONFIRM_DEL fill:#4CAF50,color:#fff
```

---

### PHASE 6: CUSTOMER COLLECTION & COMPLETION

```mermaid
flowchart TD
    NOTIF(("📱 Customer Gets<br/>Push Notification<br/>'Package Delivered!'")) --> MAP["📍 App Shows:<br/>- SkyLink Port location<br/>- Walking directions<br/>- Port name & address"]

    MAP --> WALK["🚶 Customer Walks to<br/>SkyLink Port<br/>(avg 2-5 min walk)"]
    WALK --> COLLECT["📦 COLLECT PACKAGE<br/>- Scan QR on package (future)<br/>- Tap 'Collected' in app"]

    COLLECT --> RATE["⭐ RATE EXPERIENCE<br/>1-5 stars<br/>Optional feedback"]
    RATE --> COMPLETE["✅ ORDER COMPLETE<br/>Status: COMPLETED<br/>→ Order moves to history"]

    COMPLETE --> REORDER{"Order<br/>again?"}
    REORDER -->|Yes| HOME["🏠 Back to Home<br/>→ Start new order"]
    REORDER -->|No| CLOSE["👋 Close App"]

    style NOTIF fill:#4CAF50,color:#fff
    style COLLECT fill:#2196F3,color:#fff
    style COMPLETE fill:#4CAF50,color:#fff
```

---

### PHASE 7: DRONE RETURN TO BASE

```mermaid
flowchart TD
    DEL_DONE(("✅ Delivery<br/>Confirmed")) --> CLIMB["⬆️ CLIMB<br/>Back to cruise altitude (40m)"]

    CLIMB --> RTB["🏠 RETURN TO BASE<br/>Fly back to home<br/>charging pad / warehouse"]

    RTB --> ARRIVE_BASE{"Arrived<br/>at base?"}
    ARRIVE_BASE -->|No| RTB
    ARRIVE_BASE -->|Yes| LAND["🛬 LANDING<br/>Precision land on pad"]

    LAND --> DISARM["🔒 DISARM<br/>Motors off<br/>Servo reset"]

    DISARM --> BATTERY{"Battery<br/>level?"}
    BATTERY -->|"≥ 40%"| IDLE["✅ IDLE<br/>Ready for next order<br/>→ Backend notified"]
    BATTERY -->|"< 40%"| CHARGE["🔋 CHARGING<br/>Auto-dock to charger<br/>→ Status: CHARGING"]
    CHARGE --> CHARGED{"Battery<br/>≥ 80%?"}
    CHARGED -->|No| CHARGE
    CHARGED -->|Yes| IDLE

    IDLE --> NEXT["🔄 Available for<br/>next dispatch"]

    style DEL_DONE fill:#4CAF50,color:#fff
    style IDLE fill:#2196F3,color:#fff
    style CHARGE fill:#FF9800,color:#fff
```

---

## 3. ADMIN (GCS) WORKFLOW — MONITORING EVERYTHING

```mermaid
flowchart TD
    GCS(("🎖️ Admin Opens<br/>GCS Dashboard")) --> OVERVIEW["📊 DASHBOARD OVERVIEW<br/>- Active orders: 12<br/>- Drones flying: 5<br/>- Drones idle: 8<br/>- Drones charging: 3<br/>- Revenue today: ₹15,400"]

    OVERVIEW --> MAP_VIEW["🗺️ FLEET MAP VIEW<br/>All drones on tactical radar<br/>Color coded:<br/>🟢 Idle  🔵 Flying<br/>🟡 Charging  🔴 Alert"]

    MAP_VIEW --> CLICK_DRONE["Click any drone →<br/>📋 DRONE DETAIL<br/>- Live telemetry<br/>- Camera feeds<br/>- Current mission<br/>- Battery graph"]

    CLICK_DRONE --> EMERGENCY{"Emergency<br/>needed?"}
    EMERGENCY -->|No| MONITOR["Continue monitoring"]
    MONITOR --> MAP_VIEW
    EMERGENCY -->|Yes| ABORT["🚨 EMERGENCY ABORT<br/>→ Drone switches to STABILIZE<br/>→ Pilot takes manual control<br/>→ Order reassigned"]

    OVERVIEW --> ORDERS_VIEW["📦 ALL ORDERS<br/>- Filter by status<br/>- Search by ID<br/>- Override / Cancel"]

    OVERVIEW --> SHOPS_VIEW["🏪 SHOP MANAGEMENT<br/>- Approve new shops<br/>- Suspend shops<br/>- View performance"]

    OVERVIEW --> SKYLINK_VIEW["📍 SKYLINK MANAGEMENT<br/>- Add/remove ports<br/>- Enable/disable<br/>- UWB status"]

    OVERVIEW --> ANALYTICS["📈 ANALYTICS<br/>- Orders per hour graph<br/>- Avg delivery time<br/>- Drone utilization %<br/>- Revenue trends"]

    style GCS fill:#1a1a2e,color:#0f0
    style ABORT fill:#f44336,color:#fff
    style MAP_VIEW fill:#1a1a2e,color:#0f0
```

---

## 4. EDGE CASES & ERROR HANDLING WORKFLOW

```mermaid
flowchart TD
    subgraph "Order Failures"
        OF1["Payment fails"] --> OF1A["→ Retry payment<br/>→ Order stays pending<br/>→ Auto-cancel after 10min"]
        OF2["Shop rejects order"] --> OF2A["→ Try next nearest shop<br/>→ If no shop: refund + cancel"]
        OF3["Shop doesn't respond<br/>within 2 min"] --> OF3A["→ Auto-reject<br/>→ Try next shop"]
    end

    subgraph "Drone Failures"
        DF1["No drone available"] --> DF1A["→ Queue order<br/>→ Notify customer: 'Slight delay'<br/>→ Auto-dispatch when free"]
        DF2["Low battery mid-flight"] --> DF2A["→ Emergency land at<br/>nearest safe point<br/>→ Reassign new drone"]
        DF3["GPS loss"] --> DF3A["→ Hold position (hover)<br/>→ Wait for GPS fix (30s)<br/>→ If no fix: RTL"]
        DF4["RC Override (pilot)"] --> DF4A["→ Abort mission instantly<br/>→ STABILIZE mode<br/>→ Pilot has full control"]
        DF5["Communication lost<br/>(4G drop)"] --> DF5A["→ Drone continues to<br/>last known waypoint<br/>→ Auto-RTL after 60s<br/>of no connection"]
    end

    subgraph "Delivery Failures"
        DL1["Package too heavy"] --> DL1A["→ Shopkeeper splits order<br/>→ Multiple drone trips"]
        DL2["SkyLink port occupied"] --> DL2A["→ Drone circles/holds<br/>→ Land when clear"]
        DL3["Customer doesn't collect<br/>within 1 hour"] --> DL3A["→ Auto-complete order<br/>→ Package at port<br/>→ Support ticket created"]
    end
```

---

## 5. COMPLETE WORKFLOW — ONE SINGLE VIEW

This is the master diagram showing every stakeholder's actions in chronological order:

```mermaid
flowchart TB
    %% CUSTOMER SIDE
    subgraph CUSTOMER["👤 CUSTOMER"]
        C1["Open App"] --> C2["Browse Shops"]
        C2 --> C3["Add to Cart"]
        C3 --> C4["💳 Pay"]
        C4 --> C5["⏳ Wait"]
        C5 --> C6["📍 Track Drone"]
        C6 --> C7["📦 Collect Package"]
        C7 --> C8["⭐ Rate"]
    end

    %% BACKEND
    subgraph BACKEND["☁️ BACKEND"]
        B1["Receive Order"] --> B2["Process Payment"]
        B2 --> B3["Alert Shopkeeper"]
        B3 --> B4["Wait for Accept"]
        B4 --> B5["Wait for Packed"]
        B5 --> B6["Find Best Drone"]
        B6 --> B7["Dispatch Drone"]
        B7 --> B8["Bridge Telemetry<br/>MQTT → WebSocket"]
        B8 --> B9["Confirm Delivery"]
        B9 --> B10["Mark Complete"]
    end

    %% SHOPKEEPER
    subgraph SHOPKEEPER["🏪 SHOPKEEPER"]
        S1["🔔 Alert!"] --> S2["Accept Order"]
        S2 --> S3["📦 Pack Items"]
        S3 --> S4["Mark Packed"]
        S4 --> S5["⏳ Wait for Drone"]
        S5 --> S6["Load Parcel"]
        S6 --> S7["Confirm Loaded"]
    end

    %% DRONE
    subgraph DRONE["🚁 DRONE"]
        D1["📡 Receive Command"] --> D2["Arm + Takeoff"]
        D2 --> D3["✈️ Fly to Shop"]
        D3 --> D4["Hover at Shop"]
        D4 --> D5["⏳ Wait for Load"]
        D5 --> D6["✈️ Fly to Customer"]
        D6 --> D7["⬇️ Descend"]
        D7 --> D8["📦 Drop Package"]
        D8 --> D9["⬆️ Climb"]
        D9 --> D10["🏠 Return to Base"]
        D10 --> D11["🛬 Land + Idle"]
    end

    %% ADMIN
    subgraph ADMIN["🎖️ ADMIN GCS"]
        A1["See new order on board"] --> A2["Monitor drone on map"]
        A2 --> A3["Track delivery progress"]
        A3 --> A4["🚨 Override if needed"]
    end

    %% CONNECTIONS (chronological flow)
    C4 -.->|"Order + Payment"| B1
    B3 -.->|"WebSocket"| S1
    S2 -.->|"Accept API"| B4
    S4 -.->|"Packed API"| B5
    B7 -.->|"MQTT Command"| D1
    D3 -.->|"Telemetry"| B8
    D4 -.->|"Arrived"| S5
    S7 -.->|"Loaded API"| B8
    B8 -.->|"Live location"| C6
    D6 -.->|"Telemetry"| B8
    B8 -.->|"Fleet data"| A2
    D8 -.->|"Delivered"| B9
    B9 -.->|"Push Notif"| C7
    B10 -.->|"Complete"| C8

    style CUSTOMER fill:#E3F2FD,stroke:#1565C0
    style BACKEND fill:#FFF3E0,stroke:#E65100
    style SHOPKEEPER fill:#E8F5E9,stroke:#2E7D32
    style DRONE fill:#F3E5F5,stroke:#6A1B9A
    style ADMIN fill:#263238,stroke:#0f0,color:#0f0
```

---

## 6. MONEY FLOW

```mermaid
flowchart LR
    CUST["👤 Customer<br/>Pays ₹250"] -->|"Full amount"| RAZORPAY["💳 Razorpay<br/>Escrow"]

    RAZORPAY -->|"₹200<br/>(80%)"| SHOP_ACC["🏪 Shopkeeper<br/>Account"]
    RAZORPAY -->|"₹30<br/>(12%)"| AURA_ACC["🚁 AURA<br/>Commission"]
    RAZORPAY -->|"₹15<br/>(6%)"| DELIVERY_FEE["📦 Delivery<br/>Fee Pool"]
    RAZORPAY -->|"₹5<br/>(2%)"| PG_FEE["💳 Payment<br/>Gateway Fee"]

    DELIVERY_FEE -->|"Covers"| COSTS["Drone ops,<br/>maintenance,<br/>charging"]
```

---

## 7. NOTIFICATION WORKFLOW

| Event | Who Gets Notified | Channel | Message |
|-------|-------------------|---------|---------|
| Order placed | Shopkeeper | Push + Sound + WebSocket | "🔔 New order! 3 items, ₹250" |
| Order accepted | Customer | Push + WebSocket | "✅ Shop accepted your order!" |
| Order packed | Customer | WebSocket | "📦 Your order is packed!" |
| Drone assigned | Customer + Shopkeeper | Push + WebSocket | "🚁 Drone DRONE-001 assigned!" |
| Drone en route to shop | Shopkeeper | WebSocket | "🚁 Drone arriving in 3 min" |
| Drone at shop | Shopkeeper | Push + Sound | "🚁 Drone is here! Load parcel" |
| Drone en route to customer | Customer | Push + WebSocket | "✈️ Drone is on its way!" |
| Drone arriving (200m) | Customer | Push + Sound | "📍 Drone arriving! Head to SkyLink" |
| Package delivered | Customer | Push + Sound | "📦 Package delivered! Collect now" |
| Low battery alert | Admin | WebSocket + Dashboard | "⚠️ DRONE-001 battery 25%" |
| Emergency abort | Admin | Push + Sound + Dashboard | "🚨 DRONE-001 ABORTED" |
| Customer doesn't collect (30min) | Customer | Push (reminder) | "📦 Your package is waiting!" |

---

## 8. TIME ESTIMATES (TYPICAL ORDER)

```
 0:00  ─── Customer places order & pays
 0:00  ─── Shopkeeper gets alert
 0:30  ─── Shopkeeper accepts                           ⏱️ 30 sec
 3:00  ─── Shopkeeper finishes packing                  ⏱️ 2.5 min
 3:00  ─── Drone dispatched
 5:00  ─── Drone arrives at shop (avg 2km)              ⏱️ 2 min
 5:30  ─── Shopkeeper loads parcel                      ⏱️ 30 sec
 5:30  ─── Drone takes off to customer
 8:30  ─── Drone arrives at customer SkyLink (avg 3km)  ⏱️ 3 min
 9:00  ─── Precision landing + package drop             ⏱️ 30 sec
 9:00  ─── ✅ DELIVERED
─────────────────────────────────────────────────
 TOTAL:  ~9 MINUTES (within 5km radius)
```

> **Compare:**  
> Blinkit: 10-15 min (bike, traffic dependent)  
> Rapido: 15-25 min (bike, traffic dependent)  
> **AURA: 8-12 min (drone, zero traffic)**
