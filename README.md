# LifeSRE
# LifeSRE – Subscription Risk & Savings Engine

LifeSRE is a full-stack web application that helps users track, analyze, and optimize their digital subscriptions. It automatically detects subscriptions from emails or manual inputs, evaluates financial risk, suggests cost-saving alternatives, and provides automated alerts and cancellation support.

---

## Overview

Many users lose money due to forgotten subscriptions, duplicate services, and automatic renewals. LifeSRE provides a centralized platform to:

* Detect active subscriptions
* Monitor monthly spending
* Identify high-risk or unnecessary services
* Recommend cheaper alternatives
* Send renewal alerts
* Assist with subscription cancellation

---

## Tech Stack

**Frontend**

* React (Vite)
* JavaScript
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose

**Integrations**

* Gmail API
* Twilio (WhatsApp)
* Nodemailer (Email)
* Node-cron (Background jobs)

---

## Project Structure

```
LifeSRE/
│
├── frontend/        # React (Vite) application
│   ├── src/
│   └── .env
│
├── backend/         # Node + Express server
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## Phase-wise Development

### Phase 1 – Data Collection & Extraction

* User Authentication
* Gmail integration to fetch subscription emails
* Manual upload fallback
* Basic extraction:

  * Vendor name
  * Amount
  * Billing cycle
  * Renewal date

---

### Phase 2 – Risk Analysis & Dashboard

* MongoDB schema design
* Risk Engine:

  * High-cost subscriptions
  * Duplicate services
  * Renewal risk detection
* Dashboard:

  * Total monthly spend
  * Active subscriptions
  * Risk indicators
* Savings tracking

---

### Phase 3 – Comparison & Recommendation

* Market database of alternative plans
* Vendor comparison engine
* Recommendation scoring
* Savings opportunity calculation
* Smart filtering and ranking

---

### Phase 4 – Automation & Communication

* WhatsApp alerts for:

  * Renewal reminders
  * Risk notifications
  * Savings suggestions
* Automated cancellation email generation
* Background jobs using cron
* API endpoints for automation
* Polished UI for actions and alerts

---

## Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/Aakanksharatate/LifeSRE.git
cd LifeSRE
```

---

### 2. Backend Setup

```
cd backend
npm install
npm start
```

Server runs at:

```
http://localhost:8000
```

**Backend .env**

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
EMAIL=your_email
EMAIL_PASSWORD=your_app_password
TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=your_whatsapp_number
```

---

### 3. Frontend Setup

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

**Frontend .env**

```
VITE_API_URL=http://localhost:8000
```

---

## Key APIs

| Endpoint                | Description               |
| ----------------------- | ------------------------- |
| POST /api/extract       | Extract subscription data |
| GET /api/subscriptions  | Fetch subscriptions       |
| POST /api/send-email    | Send cancellation email   |
| POST /api/send-whatsapp | Send WhatsApp alert       |

---

## Background Automation

A scheduled job runs daily to:

* Check upcoming renewals
* Send WhatsApp/email alerts
* Update risk status

---

## Demo Flow

1. User logs in
2. Subscriptions fetched via Gmail/manual upload
3. Dashboard displays spending and risks
4. System suggests savings options
5. User receives WhatsApp alert
6. One-click cancellation email generated
7. Savings updated

---

## Team Responsibilities

**Backend**

* Gmail integration
* Extraction engine
* Risk engine
* Database schema
* API architecture

**Frontend**

* Dashboard UI
* Analytics components
* API integration
* State management

**AI/Logic**

* Vendor detection
* Risk scoring improvements
* Data normalization
* Recommendation logic

**Automation**

* WhatsApp bot
* Email automation
* Background jobs
* Integration workflows

---

## Future Enhancements

* Mobile application
* AI-based subscription detection
* Auto-cancellation via vendor APIs
* Advanced spending analytics

---

## Outcome

LifeSRE enables users to gain visibility into subscriptions, avoid unnecessary renewals, and reduce monthly expenses through intelligent analysis and automation.

