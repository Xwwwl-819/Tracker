from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import webbrowser
import threading
import os
from datetime import datetime, timedelta
import calendar

app = Flask(__name__)
# this is a comment!


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/absence")
def new():
    return render_template("absence.html")


def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")


def check_file_exists():
    if not os.path.exists("transactions.json"):
        with open("transactions.json", "w") as f:
            json.dump({"cash": [], "check": []}, f)


@app.route("/add_income", methods=["POST"])
def add_income():
    # 省略添加收入记录代码
    check_file_exists()
    amount = request.form.get("amount")
    money_type = request.form.get("money_type")
    date = datetime.now().strftime("%Y-%m-%d")

    with open("transactions.json", "r+") as f:
        data = json.load(f)
        data[money_type].append({"amount": float(amount), "time": date})
        f.seek(0)
        f.truncate()
        json.dump(data, f)

    return jsonify({"message": "Record added successfully"})


@app.route("/income_records_data")
def income_records_data():
    with open("transactions.json", "r") as file:
        transactions = json.load(file)
    return jsonify(transactions)


@app.route("/get_records", methods=["GET"])
def get_records():
    check_file_exists()
    with open("transactions.json", "r") as f:
        data = json.load(f)
    return jsonify(data)


@app.route("/clear_records", methods=["POST"])
def clear_records():
    # 省略清空记录代码
    check_file_exists()
    with open("transactions.json", "w") as f:
        json.dump({"cash": [], "check": []}, f)
    return jsonify({"message": "Records cleared successfully"})


# absence

absence_file = "absence.json"


def save_absence_records(records):
    with open(absence_file, "w") as f:
        json.dump(records, f, indent=4)


def get_absence_records():
    if os.path.exists(absence_file):
        with open(absence_file, "r") as f:
            records = json.load(f)
    else:
        records = {}
    return records


def calculate_work_days(start_date, end_date, absence_days):
    day = start_date
    total_days = 0
    work_days = 0
    while day <= end_date:
        if 0 < day.weekday() < 6:
            total_days += 1
            if day.strftime("%Y-%m-%d") not in absence_days:
                work_days += 1
        day += timedelta(days=1)
    return total_days, work_days


def weekday_to_chinese(weekday):
    weekday_mapping = {
        "Monday": "星期一",
        "Tuesday": "星期二",
        "Wednesday": "星期三",
        "Thursday": "星期四",
        "Friday": "星期五",
        "Saturday": "星期六",
        "Sunday": "星期日",
    }
    return weekday_mapping.get(weekday, "")


@app.route("/record_absence", methods=["POST"])
def record_absence():
    today = datetime.now()
    date_str = today.strftime("%Y-%m-%d")
    weekday = today.strftime("%a")

    if weekday not in [
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ]:  # 修改了这一行代码
        return jsonify(
            {
                "success": False,
                "message": " Is Not A Workday!",
            }
        )

    records = get_absence_records()
    if date_str in records:
        return jsonify(
            {
                "success": False,
                "message": f"'s Absence Documented Already!",
            }
        )

    # weekday_chinese = weekday_to_chinese(weekday)
    records[date_str] = {"absences": 1, "weekdays": weekday}
    save_absence_records(records)
    return jsonify({"success": True, "message": f"已记录今天（{date_str}）的缺勤。"})


@app.route("/view_absence_records", methods=["GET"])
def view_absence_records():
    records = get_absence_records()
    return jsonify(records)


@app.route("/view_work_days", methods=["GET"])
def view_work_days():
    records = get_absence_records()
    income_record = income_records_data()
    start_date = datetime(2023, 3, 1)
    end_date = datetime.now()
    total_days, work_days = calculate_work_days(start_date, end_date, records)
    absence_days = len(records)
    salary = work_days * 200
    return jsonify(
        {
            "start_date": start_date.strftime("%Y/%m/%d"),
            "end_date": end_date.strftime("%Y/%m/%d"),
            "total_days": total_days,
            "absence_days": absence_days,
            "work_days": work_days,
            "salary": salary,
        }
    )


@app.route("/absence_clear_records", methods=["POST"])
def absence_clear_records():
    if os.path.exists(absence_file):
        os.remove(absence_file)
        return jsonify({"success": True, "message": "所有记录已清空。"})
    else:
        return jsonify({"success": False, "message": "没有找到缺勤记录文件。"})


if __name__ == "__main__":
    if not os.environ.get("OPEN_BROWSER_ONCE"):
        timer = threading.Timer(1, open_browser)
        timer.start()
        os.environ["OPEN_BROWSER_ONCE"] = "1"
    app.run(debug=True, host="0.0.0.0", use_reloader=False)
