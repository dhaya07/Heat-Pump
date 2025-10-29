from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

CONFIG_FILE = 'traffic_config.json'

def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def save_config(data):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/config', methods=['GET'])
def get_config():
    return jsonify(load_config())

@app.route('/api/config', methods=['POST'])
def update_config():
    data = request.json
    save_config(data)
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
