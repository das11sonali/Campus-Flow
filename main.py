import sqlite3
import requests
from flask import Flask,render_template,request,redirect,jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import random

load_dotenv
app = Flask(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def get_db():

    conn = sqlite3.connect("campusflow.db")
    conn.row_factory = sqlite3.Row

    return conn
def get_destination_image(destination):

    url = "https://api.pexels.com/v1/search"

    headers = {
        "Authorization": os.getenv("PEXELS_API_KEY")
    }

    params = {
        "query": f"{destination} tourist attraction",
        "per_page": 2
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )

    data = response.json()

    if data.get("photos"):
        return data["photos"][0]["src"]["large"]

    return ""
def get_roast(days_left):

    if days_left > 7:
        return "Future You is pretending this doesn't exist."

    elif days_left > 3:
        return "The assignment has started watching you."

    elif days_left > 1:
        return "Panic loading..."

    elif days_left == 1:
        return "Tomorrow's deadline called."

    elif days_left == 0:
        return "Today is the day."

    else:
        return "The deadline has left the chat."
    
def get_completion_message():

    messages = [
        "☕ Assignment defeated. Coffee break unlocked.",
        "🌳 Time to touch some grass.",
        "🎬 One guilt-free movie scene approved.",
        "🍕 Productivity achieved. Snack recommended.",
        "😴 Your brain requests a power nap.",
        "🫡 Mission complete. Go annoy your friends.",
        "🚀 Academic weapon activated.",
        "🎉 Great work! Hangout mode unlocked.",
        "📚 Another deadline survives.",
        "🌟 You earned 15 minutes of absolutely nothing."
    ]

    return random.choice(messages)

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/assignment")
def assignment():

    today = datetime.now().date()
    conn = get_db()

    assignments = conn.execute(
        "SELECT * FROM assignments"
    ).fetchall()

    conn.close()

    assignment_list = []

    for item in assignments:

        due_date = datetime.strptime(
            item["due_date"],
            "%Y-%m-%d"
        ).date()

        days_left = (due_date - today).days

        assignment_list.append({
            "id": item["id"],
            "title": item["title"],
            "due_date": item["due_date"],
            "completed": item["completed"],
            "completion_message": item["completion_message"],
            "roast": get_roast(days_left)
        })

    return render_template(
        "assignment.html",
        assignments=assignment_list
    )


@app.route("/add", methods=["POST"])
def add():

    title = request.form["title"]
    due_date = request.form["due_date"]

    conn = get_db()

    conn.execute(
        """
        INSERT INTO assignments
        (title,due_date)
        VALUES (?,?)
        """,
        (title,due_date)
    )

    conn.commit()
    conn.close()

    return redirect("/assignment")


@app.route("/complete/<int:index>")
def complete(index):

    message = get_completion_message()

    conn = get_db()

    conn.execute(
        """
        UPDATE assignments
        SET completed=1,
            completion_message=?
        WHERE id=?
        """,
        (message,index)
    )

    conn.commit()
    conn.close()
    
    return redirect("/assignment")


@app.route("/delete_assignment/<int:id>")
def delete_assignment(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM assignments WHERE id=?",
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect("/assignment")

@app.route("/hangout")
def hangout():

    return render_template("hangout.html")



@app.route("/planner",methods=[ "GET","POST"])
def planner():
    if request.method == "GET":
        return render_template("planner.html")
    try:
        data = request.json
        subjects= data["subjects"]
        hours = data["hours"]
        
        prompt = f"""
        You are an academic planner.

        Subjects:
        {subjects}

        Available study time:
        {hours} hours per day.

        Create a realistic day-wise study plan.

        Requirements:
        - Split time among subjects.
        - Prioritize earlier deadlines.
        - Mention hours for each subject.
        - Use simple readable formatting.
        - Use separators --- after each day

        Example:

        📅 1 June

        Maths - 2 hrs
        Chemistry - 1 hr

        📅 2 June

        Maths - 1.5 hrs
        Biology - 1.5 hrs

        No markdown table.
        """
        response = model.generate_content(prompt)
        

        return jsonify({
            "plan":response.text})
    except Exception as e:
        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500







@app.route("/cafes")
def cafes():
    
    return render_template("cafes.html")

@app.route("/movies")
def movies():

    return render_template("movies.html")

@app.route("/trips")
def trips_page():
    return render_template("trips.html")

@app.route("/api/trips", methods=["POST"])
def generate_trip():

    print("Route reached!")

    data = request.get_json()

    destination = data["destination"]
    budget = data["budget"]
    days = data["days"]

    response = model.generate_content(
        f"""Create a {days}-day trip itinerary for {destination} under ₹{budget}.
        Return ONLY HTML using:
        <div class="summary-card">...</div>
        <div class="day-card">
        <h2>🌍 Day X</h2>
        <ul>
        <li>Morning...</li>
        <li>Afternoon...</li>
        <li>Evening...</li>
        </ul>
        <p><strong>Estimated Cost:</strong> ₹XXXX</p>
        </div>

        After all days, create:

       <div class="tips-card">
       ...
       </div>

       <div class="food-card">
       .   ..
       </div>"""
        
    )
    image_url = get_destination_image(destination)

    return jsonify({
        "itinerary": response.text,
        "image": image_url
    })
if __name__ == "__main__":
    app.run(debug=True)
    