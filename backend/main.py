from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import time

app = FastAPI()

# Load the real ML model and the category encoder
model = joblib.load('../fraud_model.pkl')
encoder = joblib.load('../encoder.pkl')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    user_id: int
    amount: float
    merchant_category: str
    hour_of_day: int
    is_international: int
    avg_user_spend: float

@app.get("/")
def home():
    return {"message": "REAL Fraud Detection API is running"}

@app.post("/predict")
def predict_fraud(transaction: Transaction):
    # 1. Prepare data for the model
    # We must convert the category name to the same number used in training
    try:
        cat_encoded = encoder.transform([transaction.merchant_category])[0]
    except:
        # If user enters a category the model doesn't know
        cat_encoded = 0

    # 2. Create a DataFrame for the model (must match training columns)
    input_df = pd.DataFrame([[
        transaction.user_id, 
        transaction.amount, 
        cat_encoded, 
        transaction.hour_of_day, 
        transaction.is_international, 
        transaction.avg_user_spend
    ]], columns=['user_id', 'amount', 'merchant_category', 'hour_of_day', 'is_international', 'avg_user_spend'])

    # 3. Get real prediction and probability
    prediction = int(model.predict(input_df)[0])
    probabilities = model.predict_proba(input_df)[0]
    risk_score = probabilities[1] # Probability of being Fraud (class 1)
    
    # Cap risk score at 75% maximum
    risk_score = min(risk_score, 0.75)

    # Strict Binary Decision (50/50)
    status = "Fraud" if prediction == 1 else "Legit"

    return {
        "risk_score": round(float(risk_score), 2),
        "status": status,
        "timestamp": time.strftime("%H:%M:%S")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
