waste_keywords = [
    "waste", "plastic", "garbage", "trash", "compost", "recycle",
    "e-waste", "biodegradable", "non-biodegradable", "bin",
    "landfill", "segregation", "hazardous", "organic", "inorganic",
    "reduce", "reuse", "collection", "dump", "wrappers", "packaging",
    "bottle", "bottles", "can", "cans", "foil", "kitchen waste",
    "food waste", "medical waste", "paper waste", "cardboard",
    "municipal waste", "construction waste", "disposal", "dustbin",
    "incineration", "recyclable", "non-recyclable", "garbage truck",
    "pickup schedule", "waste collection", "environment", "pollution"
]

from flask import Flask, render_template, request, jsonify

import requests

def query_openrouter(message):
    headers = {
        "Authorization": "Bearer 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",  # Replace this with your key
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}]
    }
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
    return response.json()['choices'][0]['message']['content']

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json['message'].lower()
    
    # Check if input is related to waste
    if any(keyword in user_input for keyword in waste_keywords):
        prompt = "Answer strictly related to waste management: " + user_input
        bot_reply = query_openrouter(prompt)
    else:
        bot_reply = "I am here to guide you on waste management."

    return jsonify({"reply": bot_reply})


if __name__ == '__main__':
    app.run(debug=True)
