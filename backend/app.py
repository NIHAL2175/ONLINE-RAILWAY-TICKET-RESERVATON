from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["railway"]
collection = db["reservations"]

@app.route("/book", methods=["POST"])
def book_ticket():
    data = request.json
    collection.insert_one(data)
    return jsonify({"message": "Ticket booked successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
