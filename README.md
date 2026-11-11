# AutoSettle AI — AI-Powered Vehicle Insurance Claim Assessment Platform

> **Hackathon Prototype MVP** built in accordance with the *AutoSettle AI Hackathon Project Guide*.  
> Features real-time simulated Computer Vision damage segmentation, interactive vehicle schematic hotspot mapping, automated OEM parts/labor repair matrix pricing in INR, anti-fraud perceptual hash verification, and instant IRDAI-compliant PDF assessment report generation.

---

## 🚀 Live Demo & Local URL

The local development server is active and running:
- working url [ https://autosettleai.vercel.app ]

---

## 🌟 Key Screens & Architectural Modules

### 1. User Dashboard & Claim Submission (`/`)
* **Live AI Computer Vision Analysis**: Simulated YOLOv11 motor damage model detecting dents, structural deformation, and paint abrasions with real-time confidence scores and dynamic scanline animation.
* **Interactive Damage Bounding Box Overlay**: Renders bounding boxes over the vehicle photo with corner pins and hover inspection tooltips.
* **Interactive 2D Vehicle Hotspot Mapper**: Top-down SVG car wireframe enabling policyholders to click and verify impacted panels (Front Bumper, Hood, Windshield, Fenders, Doors, Rear Quarter, Rear Bumper).
* **Multi-Format Image Ingestion**:
  * Drag & drop / file upload (supports JPG, PNG up to 10MB) with instant preview and remove capability.
  * **[📷 Capture via Mobile Cam (QR)]**: Generates a synchronized mobile capture QR code and supports direct system webcam capture.
  * **One-Click Demo Presets**: Pre-loaded scenarios (`Maruti Swift Moderate Bumper`, `Hyundai Creta High Fraud Crash`, `Baleno Minor Scuff`) for instant demonstration to judges.
* **Security & Anti-Fraud Addon Badges**:
  * `[✔ Exif Metadata Verified]`: Real-time hardware GPS telemetry and timestamp validation.
  * `[✔ Duplicate Image Check: Passed]`: Perceptual image hashing guard checking against previous accident submissions.
* **Validation & Instant Claim Creation**: Form validations across vehicle registration number, model, policy number, and location before registering to the client-side ledger.

### 2. Claim Assessment Screen (`/assessment/:id`)
* **Assessment Overview**: Displays Claim ID (`#AS-8942`), status badge, vehicle telemetry, and damage severity.
* **Cost Breakdown Matrix**:
  * OEM Parts & Bumper Replacement (`₹8,000`)
  * Painting & Refinishing (`₹3,000`)
  * Labor & Mechanical Services (`₹1,500`)
  * Shop Consumables & Applicable GST (18%)
  * **Total Estimated Payout (`₹12,500`)** with auto-approval threshold checks.
* **One-Click IRDAI PDF Report Generator**: Generates and downloads an official branded PDF report using `jsPDF` and `jspdf-autotable` featuring policy details, damage matrix, fraud seals, and digital audit QR codes.
* **WhatsApp Instant Notification Simulator**: Realistic smartphone mockup displaying the automated push message (`Claim #AS-8942 auto-approved for ₹12,500. Transferred to Apex Garage linked account.`) with interactive sound/resend actions and two-way reply simulation.
* **Accept & Close Settlement**: Marks the claim as settled, triggers celebratory confetti particles, and generates a digital disbursement transaction reference.

### 3. Insurance Adjuster Review Desk (`/adjuster`)
* **Multi-Role Switcher**: Persistent toggle between Customer Portal and Adjuster Desk.
* **Incoming Claims Queue**:
  * Live searchable and filterable table displaying Claim ID, Vehicle, Damage Severity, AI Payout, Fraud Risk score, and contextual action buttons.
  * Filters for `All`, `⚠️ High Fraud`, and `Pending Review`.
* **Selected Claim Audit Deep Dive**:
  * **Anti-Fraud Flag Details**: Clearly explains flagged reasons (e.g. *Image perceptual hash matches a claim filed 4 months ago in Mumbai under a different policyholder*).
  * **[ Overrule AI ] Action**: Modal allowing adjusters to edit payout amounts, adjust severity ratings, and append audit justification notes.
  * **[ Dispatch Inspector ] Action**: Modal to assign on-ground physical surveyors (e.g., IRDAI field inspectors) with scheduled inspection dates and auto-dispatch work orders.
  * **Single-Click Actions**: Instant scam flagging and payout freezing, or one-click payout authorization.

### 4. My Claims Portal (`/my-claims`)
* Displays all claims stored in browser `LocalStorage`.
* Search and filter claims by status (`Approved`, `Settled`, `In Review`, `Flagged`).
* Direct actions to view detailed assessment reports or download PDF files.

---

## 🛠️ Technology Stack

* **Framework:** React 18 with Vite (Fast HMR & build optimization)
* **Language:** JavaScript (ESNext / JSX)
* **Styling:** Tailwind CSS with custom brand palette (`brand-50` to `brand-950`)
* **Routing:** React Router v6 (`react-router-dom`)
* **Icons:** Lucide React
* **Report Generation:** `jspdf` & `jspdf-autotable`
* **FX & Feedback:** `canvas-confetti` & custom animated toast notification system
* **Persistence:** Browser `LocalStorage` with `Reset Demo State` utility

---

## 🏁 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**
   ```bash
   npm run dev
   ```
3. **Build for Production:**
   ```bash
   npm run build
   ```
4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 💡 Notes on AI Simulation for Hackathon Presentation

As recommended in the project guide, Computer Vision inference and perceptual image hash verification are implemented as a **realistic, production-grade frontend simulation**. The system demonstrates how a production model (such as YOLOv11 and image hashing engines) integrates into the claims workflow without requiring expensive backend GPU infrastructure during the live pitch.
