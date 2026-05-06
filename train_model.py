import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

def train():
    df = pd.read_csv('fraud_data.csv')
    
    le = LabelEncoder()
    df['merchant_category'] = le.fit_transform(df['merchant_category'])
    
    X = df.drop('is_fraud', axis=1)
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    model.fit(X_train, y_train)
    
    joblib.dump(model, 'fraud_model.pkl')
    joblib.dump(le, 'encoder.pkl')

if __name__ == "__main__":
    train()
