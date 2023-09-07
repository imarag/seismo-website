from flask import Blueprint, redirect, render_template, request, url_for, flash
from .db import get_db

bp = Blueprint('BP_admin', __name__, url_prefix = '/admin')


@bp.route('/admin-login', methods=["POST", "GET"])
def admin_login():

    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        if email == "giannis.marar@hotmail.com" and password == "password":
            flash("You have succesfully loged in", "success")
            return redirect(url_for("BP_admin.admin_index"))
        else:
            flash("You don't have the permission to enter this page!", "danger")
    
    return render_template("admin/admin-login-page.html")
    
@bp.route('/admin-index')
def admin_index():
    return render_template("admin/admin-index.html")

@bp.route('/show-all-topics')
def show_all_topics():
    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()
    return render_template('admin/show-topics.html', topics=topics)

@bp.route('/add_topic_template')
def add_topic_template():
    return render_template('admin/add-topic-template.html')

@bp.route('/edit-topic-template/<topic_id>', methods=['GET'])
def edit_topic_template(topic_id):
    database = get_db()
    topic = database.execute("SELECT * FROM topics WHERE id = ?", (topic_id,)).fetchone()
    return render_template('admin/edit-topic-template.html', topic = topic)

@bp.route('/show_all_users', methods=['GET', 'POST'])
def show_all_users():
    database = get_db()
    users = database.execute("SELECT * FROM user").fetchall()
    return render_template('admin/show-users.html', users=users)

@bp.route('reset-topics')
def reset_topics():

    # Connect to the SQLite database
    db = get_db()

    # Define multiple SQL commands
    sql_commands = [
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python Obspy', 'ObsPy is an open-source Python library used for seismic data processing and analysis. It stands for Observatory Python and provides a wide range of functionalities for working with seismological data.', 'obspy-icon.png', 'static', 'obspy.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Fourier spectra calculation', 'An interactive tool to calculate the Fourier spectra on a window of a seismogram. The Fourier transform is commonly used in seismology to analyze the frequency content of seismic signals.', 'fourier-icon.png', 'interactive', 'fourier.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Arrival time picking', 'Arrival time picking refers to the process of extracting the arrival times of specific seismic phases from a seismogram. These arrival times provide valuable information about the timing and characteristics of seismic events.', 'arrival-pick-icon.png', 'interactive', 'pick-arrivals.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('ASCII to MSEED', 'An interactive tool to convert ASCII files to ObsPy MiniSEED (mseed) format. Use this option if you want to transform your data into a binary format to use the available tools.', 'ascii-to-mseed-icon.png', 'interactive', 'ascii-to-mseed.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Signal processing', 'An interactive tool to apply various techniques and algorithms to analyze, filter, enhance, and extract meaningful information from seismic records.', 'signal-processing-icon.png', 'interactive', 'signal-processing.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Site effect', 'Refers to the phenomenon where the characteristics of the local site or subsurface geology affect the propagation and amplification of seismic waves.', 'site-effect-icon.png', 'static', 'site-effect.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Introduction to Seismology', 'A small introduction to various seismological concepts and the propagation of seismic waves through the Earth', 'introduction-to-seismology.png', 'static', 'seismology-intro.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Distance between points', 'Compute the distance between two geographical points on the WGS84 ellipsoid', 'distance-between-points.png', 'interactive', 'distance-between-points.html')",
        "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('File Manipulation', 'Use Python libraries to manipulate system files. Simplify tasks like directory traversal, file creation, path handling and pattern matching using libraries like Python os, pathlib, shutil and more.', 'file-manipulation.png', 'static', 'file-manipulation.html')"
        
    ]


    # delete all the table
    db.execute('DELETE FROM topics;')

    # Execute each SQL command
    for command in sql_commands:
        db.execute(command)

    # Commit the changes and close the connection
    db.commit()

    # redirect to show all topics
    return redirect(url_for('BP_admin.show_all_topics'))








@bp.route('/add-topic', methods=['GET', 'POST'])
def add_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    database = get_db()
    database.execute("INSERT INTO topics (title, description, image_name, type, template_name) VALUES (?, ?, ?, ?, ?)",
        (topic_title, topic_description, topic_image_name, topic_type, topic_template_name)
    )
    database.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/edit-topic/<topic_id>', methods=['GET', 'POST'])
def edit_topic(topic_id):
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    database = get_db()
    database.execute("UPDATE topics SET title=?, description=?, image_name=?, type=?, template_name=? WHERE id=?",
        (topic_title, topic_description, topic_image_name, topic_type, topic_template_name, topic_id)
    )
    database.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/delete-topic/<topic_id>', methods=['GET', 'POST'])
def delete_topic(topic_id):
    database = get_db()
    database.execute("DELETE FROM topics WHERE id = ?",
        (topic_id,)
    )
    database.commit()
    return redirect(url_for('BP_admin.show_all_topics'))

