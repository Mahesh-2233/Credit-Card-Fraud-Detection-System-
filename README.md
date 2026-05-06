# Credit Card Fraud Detection System

A real-time, end-to-end Machine Learning system designed to detect fraudulent credit card transactions using a **Random Forest** algorithm.

## 🚀 Project Overview
This system uses a trained ML model to analyze 7 key transactional features and predict the probability of fraud in under 200 milliseconds. It features a premium, real-time dashboard for monitoring and manual transaction analysis.

---

## 🛠️ System Workflow
1.  **Data Layer**: A synthetic dataset of 50,000 transactions (`fraud_data.csv`) with realistic fraud patterns.
2.  **ML Layer**: A Random Forest classifier trained on 50k rows, achieving high precision in detecting anomalies.
3.  **Backend (API)**: A FastAPI server that loads the trained model and provides a `/predict` endpoint.
4.  **Frontend (UI)**: A React/Vite dashboard with real-time monitoring and a manual check tool.

---

## 📦 Installation & Setup

### 1. Prerequisite
Make sure you have **Python 3.x** and **Node.js (npm)** installed on your system.

### 2. Install Python Dependencies
Open your terminal and run:
```bash
pip install pandas scikit-learn joblib fastapi uvicorn
```

### 3. Install Frontend Dependencies
Navigate to the frontend folder and install:
```bash
cd frontend
npm install
```

---

## 🚦 How to Run the System

You need to run the **Backend** and the **Frontend** in two separate terminal windows.

### Step 1: Train the Model (If not already trained)
In the main project folder, run:
```bash
python train_model.py
```
*This will create `fraud_model.pkl` and `encoder.pkl`.*

### Step 2: Start the Backend
```bash
cd backend
python main.py
```
*The server will start at http://localhost:8000*

### Step 3: Start the Frontend
In a NEW terminal window:
```bash
cd frontend
npm run dev
```
*The dashboard will be available at http://localhost:5173*

---

## 🧪 Testing the Model
Use the **Manual Analysis** form on the dashboard to test these scenarios:
- **Legit**: $50 at Grocery, local location.
- **Fraud**: $5,000 at Electronics, 3:00 AM, International location.

---

## 📂 Project Structure
- `backend/` - FastAPI server and API logic.
- `frontend/` - React/Vite source code and dashboard UI.
- `fraud_data.csv` - The training dataset (50k rows).
- `train_model.py` - Script to train the Random Forest model.
- `colab_model.py` - Optimized script for Google Colab testing.
