from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch OpenRouter API Key from .env
API_KEY = os.getenv('API_KEY')
if not API_KEY:
    raise ValueError("API_KEY not found. Please check your .env file.")

# List of waste types and their associated sample questions
waste_types = {
    "Plastic Waste": [
        "How can plastic waste be recycled?",
        "What are the environmental impacts of plastic waste?",
        "How do we reduce plastic waste?"
    ],
    "Electronic Waste (E-Waste)": [
        "How can we dispose of electronic waste safely?",
        "What is the impact of improper e-waste disposal?",
        "What are the recycling methods for e-waste?"
    ],
    "Organic Waste": [
        "How can organic waste be composted?",
        "What is the environmental impact of organic waste?",
        "How can we reduce organic waste in landfills?"
    ],
    "Paper Waste": [
        "How is paper waste recycled?",
        "What are the environmental effects of paper waste?",
        "How can we reduce paper waste?"
    ],
    "Glass Waste": [
        "How is glass waste recycled?",
        "What are the benefits of recycling glass?",
        "How can we reduce glass waste?"
    ],
    "Metal Waste": [
        "How is metal waste recycled?",
        "What are the environmental impacts of metal waste?",
        "What can be made from recycled metal?"
    ],
    "Hazardous Waste": [
        "How is hazardous waste disposed of?",
        "What are the risks of improper hazardous waste disposal?",
        "How can we safely manage hazardous waste?"
    ],
    "Medical Waste": [
        "What is the proper disposal method for medical waste?",
        "Why is it important to safely dispose of medical waste?",
        "What are the risks of improper medical waste disposal?"
    ],
    "Construction Waste": [
        "How can construction waste be recycled?",
        "What are the environmental impacts of construction waste?",
        "How can we reduce construction waste?"
    ],
    "Textile Waste": [
        "How can textile waste be recycled?",
        "What are the environmental effects of textile waste?",
        "How can we reduce textile waste in landfills?"
    ]
}

# Function to query OpenRouter API and get response from GPT-3.5 / GPT-4 model
def query_openrouter(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",  # or "openai/gpt-4"
        "messages": [
            {"role": "system", "content": "You are an expert in waste management."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

# Initialize the Flask app
app = Flask(__name__)

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html', waste_types=waste_types)

# Route to handle the question selection and response fetching
@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    waste_type = data['waste_type']
    question = data['question']

    # Build the prompt based on the waste type and the selected question
    prompt = f"For {waste_type}, {question}"

    try:
        # Fetch answer from OpenRouter (ChatGPT)
        answer = query_openrouter(prompt)
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'answer': f"Error: {str(e)}"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
