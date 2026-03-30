from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np
from crop_knowledge import CROP_KNOWLEDGE

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
preprocessor = joblib.load("preprocessor.pkl")
label_encoder = joblib.load("label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Input dataframe (MUST match training columns)
    input_df = pd.DataFrame([{
        "soil_type": data["soil_type"],
        "soil_ph": data["soil_ph"],
        "moisture_level": data["moisture_level"],
        "season": data["season"],
        "previous_crop": data.get("previous_crop", "None")
    }])

    X_processed = preprocessor.transform(input_df)
    probs = model.predict_proba(X_processed)

    top3_idx = np.argsort(probs[0])[-3:][::-1]

    results = []

    for idx in top3_idx:
        crop = label_encoder.inverse_transform([idx])[0]
        confidence = float(probs[0][idx])

        info = CROP_KNOWLEDGE.get(crop, {})

        results.append({
            "crop": crop,
            "confidence": round(confidence, 3),
            "expected_yield": info.get("yield", "N/A"),
            "profitability": info.get("profitability", "N/A"),
            "fertilizer": info.get("fertilizer", {}),
            "irrigation": info.get("irrigation", "General irrigation recommended")
        })

    return jsonify({
        "status": "success",
        "predictions": results
    })

if __name__ == "__main__":
    app.run(debug=True)
