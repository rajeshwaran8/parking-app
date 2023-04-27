from flask import Flask, redirect, url_for, session, request, jsonify, json
import sqlite3
from flask_cors import CORS, cross_origin
import stripe
import threading, datetime, time
import pytz
from flask_mail import Mail, Message

stripe.api_key = "sk_test_51MyueoSHD5TcZoiKrglTbCafbJp166PiAxhZnUYxNK3T348dbaz1kNGVq7vxxjJBlmQBLKFu0wZFKCikwJO314ul00qkqQapxh"

# user_info = {}

app = Flask(__name__)
CORS(app, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.secret_key = "123"
# stripe.api_key = "sk_test_51MySPpSFo6l1v9xCzWyETwpzouWmn1T9Tkj1EuCkeJl97Wa6XALn2e2h28Gl4DsuL6zMbUhEPt0CiURbAiT0as7700jMMjC0Rt"
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "mohanap2805999@gmail.com"
app.config["MAIL_PASSWORD"] = "eiuljynyypucvwcg"
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_DEFAULT_SENDER"] = "mohanap2805999@gmail.com"

mail = Mail(app)


def create_table_users():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    cur.execute(
        """CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY, name TEXT,
                 email TEXT UNIQUE)"""
    )
    conn.commit()
    conn.close()


def create_table_admin():
    con = sqlite3.connect("database.db")
    con.execute(
        "create table if not exists admin(aid integer primary key,aname text unique,apass text)"
    )
    aname = "admin"
    apass = "admin"
    con.execute("insert or ignore into admin(aname,apass) values(?,?)", (aname, apass))
    con.commit()
    con.close()


def create_table_location():
    con = sqlite3.connect("database.db")
    con.execute(
        "create table if not exists location(lid integer primary key,location_name text unique,slots integer)"
    )
    con.close()


def create_table_locations():
    con = sqlite3.connect("database.db")
    con.execute(
        "create table if not exists locations(sid integer primary key,location_name text,slot_number integer,availability boolean default True,start_date DATETIME,end_date DATETIME)"
    )
    con.commit()
    con.close()


def create_table_vehicle():
    con = sqlite3.connect("database.db")
    con.execute(
        "create table if not exists vehicle(vid integer primary key,vehicle_number text,name text,email text,slot_number integer,location text,start_date DATETIME,end_date DATETIME,price REAL)"
    )
    con.commit()
    con.close()


create_table_location()
create_table_locations()
create_table_admin()
create_table_vehicle()
create_table_users()


@app.route("/admin/add_location", methods=["POST"])
def add_location():
    try:
        location_name = request.json["location_name"]
        slots = request.json["slots"]
        con = sqlite3.connect("database.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        slot = int(slots)
        cur.execute(
            "insert or ignore into location (location_name,slots) values (?,?)",
            (location_name, slots),
        )
        for i in range(1, slot + 1):
            cur.execute(
                "insert or ignore into locations(location_name,slot_number) values(?,?)",
                (location_name, i),
            )
        con.commit()
        return jsonify({"success": "Location added successfully"})

    except Exception as e:
        return jsonify({"error": str(e)})

    finally:
        # con.close()
        pass


@app.route("/user/select_location", methods=["POST"])
def select_location():
    try:
        location = request.json["location"]
        con = sqlite3.connect("database.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute("select * from locations where location_name=?", (location,))
        data = cur.fetchall()
        con.commit()
        result = []
        for row in data:
            result.append(
                {
                    "location_name": row[1],
                    "slots": row[2],
                    "availability": row[3],
                    "start_date": row[4],
                    "end_date": row[5],
                }
            )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        con.close()


@app.route("/park/signin", methods=["POST"])
def login():
    try:
        name = request.json["name"]
        email = request.json["email"]
        session["email"] = email
        con = sqlite3.connect("database.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute(
            "insert or ignore into users (name,email) values (?,?)", (name, email)
        )
        con.commit()
        return jsonify({"name": name, "email": email})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        pass


@app.route("/user/slot_choosing/<string:slot_number>", methods=["GET"])
def slot_choosing(slot_number):
    return jsonify({"message": "please login to book the slot {}".format(slot_number)})
    # return redirect(url_for('login.html',slot_number))


@app.route("/user/select_all", methods=["GET"])
def show_location():
    try:
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select * from location")
        data = cur.fetchall()
        count = cur.rowcount
        con.commit()
        if count == 0:
            return jsonify({"message": "no locations found"})
        else:
            return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)})

    finally:
        con.close()


@app.route("/payment", methods=["POST"])
def payment():
    email = request.json["email"]
    amount = request.json["price"]

    if not email:
        return "you need to send an email", 400
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency="INR",
        receipt_email=email,
        description="Exported goods or services description goes here",
    )

    response = jsonify({"client_secret": intent["client_secret"]})
    return response


def run_at_date_time(date_time_str, slot_number, location):
    try:
        schedule_time = datetime.datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
        while True:
            current_time = datetime.datetime.now()
            if current_time >= schedule_time:
                my_scheduled_function(slot_number, location)
                break
            else:
                time.sleep(1)
    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500


def my_scheduled_function(slot_number, location):
    try:
        con = sqlite3.connect("database.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        change = True
        start_date = None
        end_date = None
        cur.execute(
            "UPDATE locations set availability=?,start_date=?, end_date=? WHERE location_name=? AND  slot_number=?",
            (change, start_date, end_date, location, slot_number),
        )
        cur.execute("SELECT slots FROM location WHERE location_name=?", (location,))
        count_of_slots = cur.fetchone()
        count = int(count_of_slots[0]) + 1
        cur.execute(
            "UPDATE location set slots=? WHERE location_name=?", (count, location)
        )
        con.commit()
        # return jsonify({"message":"booking end time reached"})
    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500
    finally:
        con.close()


@app.route("/booked", methods=["POST"])
def slot_booking():
    try:
        vehicle_number = request.json["vehicleNo"]
        name = request.json["name"]
        email = request.json["email"]
        slot_number = request.json["slotNumber"]
        location = request.json["location"]
        start_date = request.json["startTime"]
        end_date = request.json["endTime"]
        price = request.json["price"]

        input_datetime = datetime.datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%S.%fZ")
        utc_tz = pytz.utc
        ist_tz = pytz.timezone("Asia/Kolkata")
        utc_datetime = utc_tz.localize(input_datetime)
        ist_datetime = utc_datetime.astimezone(ist_tz)
        start_date = ist_datetime.strftime("%Y-%m-%d %H:%M:%S")

        input_datetime = datetime.datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%S.%fZ")
        utc_tz = pytz.utc
        ist_tz = pytz.timezone("Asia/Kolkata")
        utc_datetime = utc_tz.localize(input_datetime)
        ist_datetime = utc_datetime.astimezone(ist_tz)
        end_date = ist_datetime.strftime("%Y-%m-%d %H:%M:%S")

        con = sqlite3.connect("database.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute(
            "SELECT availability FROM locations WHERE location_name=? AND  slot_number=?",
            (location, slot_number),
        )
        check = cur.fetchone()
        con.commit()
        if check[0] == False:
            return jsonify(
                {
                    "message": "Slot:{} in {} location is already booked choose other slots".format(
                        slot_number, location
                    )
                }
            )
        else:
            change = False
            cur.execute(
                "insert into vehicle(vehicle_number,name,email,slot_number,location,start_date,end_date,price) values (?,?,?,?,?,?,?,?)",
                (
                    vehicle_number,
                    name,
                    email,
                    slot_number,
                    location,
                    start_date,
                    end_date,
                    price,
                ),
            )
            cur.execute(
                "UPDATE locations set availability=?, start_date=?, end_date=? WHERE location_name=? AND  slot_number=?",
                (change, start_date, end_date, location, slot_number),
            )
            cur.execute("SELECT slots FROM location WHERE location_name=?", (location,))
            count_of_slots = cur.fetchone()
            count = int(count_of_slots[0]) - 1
            cur.execute(
                "UPDATE location set slots=? WHERE location_name=?", (count, location)
            )
            con.commit()
            threading.Thread(
                target=run_at_date_time, args=(end_date, slot_number, location)
            ).start()
            # run_at_date_time(end_date,slot_number,location)
            msg = Message("Payment Successful", recipients=[email])
            msg.body = """Your payment was successful. Thank you for booking!
                              name:{} 
                              vehicle number:{}
                              Location:{}
                              slot number:{}
                              start time:{}
                              end time:{}
                              price:{}""".format(
                name, vehicle_number, location, slot_number, start_date, end_date, price
            )
            mail.send(msg)
            return jsonify({"message": "slot booked and mail sent successfully"})

    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500
    finally:
        # con.close()
        pass


@app.route("/user/histroy", methods=["GET"])
def user_histroy():
    try:
        email = request.args.get("email")
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select * from vehicle where email=?", (email,))
        data = cur.fetchall()
        count = cur.rowcount
        con.commit()
        if count == 0:
            return jsonify({"message": "no histroy found"})
        else:
            response = jsonify(data)
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response

    except Exception as e:
        return jsonify({"error": str(e)})

    finally:
        con.close()


@app.route("/admin/show_slots", methods=["GET"])
def show_slots():
    try:
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select * from locations")
        data = cur.fetchall()
        count = cur.rowcount
        con.commit()
        if count == 0:
            return jsonify({"message": "no slots found"})
        else:
            return jsonify(data)

    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500

    finally:
        con.close()


@app.route("/admin/delete_slots/<string:sid>", methods=["DELETE"])
def delete_slots(sid):
    try:
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select location_name from locations where sid=?", (sid,))
        data = cur.fetchone()
        cur.execute("DELETE FROM locations WHERE sid=?", (sid,))
        check = True
        cur.execute(
            "SELECT COUNT(*) from locations WHERE location_name=? and availability=?",
            (data[0], check),
        )
        count = cur.fetchone()
        count = int(count[0])
        cur.execute(
            "update location set slots=? where location_name=?", (count, data[0])
        )
        con.commit()
        return jsonify({"message": "Slot deleted successfully"}), 200

    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500

    finally:
        con.close()


@app.route("/admin/histroy", methods=["GET"])
def admin_histroy():
    try:
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select * from vehicle")
        data = cur.fetchall()
        count = cur.rowcount
        con.commit()
        if count == 0:
            return jsonify({"message": "no histroy found"})
        else:
            return jsonify(data)

    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500

    finally:
        con.close()


@app.route("/admin/show_slots", methods=["GET"])
def show_slots_location():
    try:
        location = request.args.get("location")
        con = sqlite3.connect("database.db")
        cur = con.cursor()
        cur.execute("select * from locations WHERE location_name=?", (location,))
        data = cur.fetchall()
        count = cur.rowcount
        con.commit()
        if count == 0:
            return jsonify({"message": "no slots found"})
        else:
            return jsonify(data)

    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500

    finally:
        con.close()


@app.route("/admin/update_slots", methods=["PUT"])
def update_slots():
    try:
        location_name = request.json["location"]
        slot_number = request.json["slotNumber"]
        availability = request.json["availability"]
        start_date = request.json["startDate"]
        end_date = request.json["endDate"]

        # input_datetime = datetime.datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%S.%fZ")
        # utc_tz = pytz.utc
        # ist_tz = pytz.timezone('Asia/Kolkata')
        # utc_datetime = utc_tz.localize(input_datetime)
        # ist_datetime = utc_datetime.astimezone(ist_tz)
        # start_date = ist_datetime.strftime("%Y-%m-%d %H:%M:%S")

        # input_datetime = datetime.datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%S.%fZ")
        # utc_tz = pytz.utc
        # ist_tz = pytz.timezone('Asia/Kolkata')
        # utc_datetime = utc_tz.localize(input_datetime)
        # ist_datetime = utc_datetime.astimezone(ist_tz)
        # end_date = ist_datetime.strftime("%Y-%m-%d %H:%M:%S")
        availability = int(availability[0])
        if availability:
            con = sqlite3.connect("database.db")
            cur = con.cursor()
            start_time = None
            end_time = None
            cur.execute(
                "UPDATE locations SET availability=?,start_date=?,end_date=? where location_name=? and slot_number=?",
                (availability, start_time, end_time, location_name, slot_number),
            )
            check = True
            cur.execute(
                "SELECT COUNT(*) from locations WHERE location_name=? and availability=?",
                (location_name, check),
            )
            count = cur.fetchone()
            count = int(count[0])
            cur.execute(
                "update location set slots=? where location_name=?",
                (count, location_name),
            )
            con.commit()
        # else:
        #     con=sqlite3.connect("database.db")
        #     cur=con.cursor()
        #     cur.execute("UPDATE locations SET availability=?,start_date=?,end_date=? where location_name=? and slot_number=?",(availability,start_time,end_time,location_name,slot_number))
        #     check=True
        #     cur.execute("SELECT COUNT(*) from locations WHERE location_name=? and availability=?",(location_name,check))
        #     count=cur.fetchone()
        #     count=int(count[0])
        #     cur.execute("update location set slots=? where location_name=?",(count,location_name))
        #     con.commit()
        #     threading.Thread(target=run_at_date_time, args=(end_date,slot_number,location_name)).start()
        return jsonify({"message": "Slot updated successfully"})
    except Exception as e:
        if isinstance(e, TypeError):
            return jsonify({"error": "Invalid input"}), 400
        else:
            return jsonify({"error": "Internal server error"}), 500
    finally:
        con.close()


if __name__ == "__main__":
    app.run(debug=True, port=8080)
