from flask import Blueprint, redirect, render_template, request, url_for, flash
from . import Topic, User, db

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
    topics = Topic.query.all()
    return render_template('admin/show-topics.html', topics=topics)

@bp.route('/add_topic_template')
def add_topic_template():
    return render_template('admin/add-topic-template.html')

@bp.route('/edit-topic-template/<topic_id>', methods=['GET'])
def edit_topic_template(topic_id):
    topic = Topic.query.filter_by(id=topic_id).first()
    return render_template('admin/edit-topic-template.html', topic = topic)

@bp.route('/show_all_users', methods=['GET', 'POST'])
def show_all_users():
    users = User.query.all()
    return render_template('admin/show-users.html', users=users)

@bp.route('reset-topics')
def reset_topics():

    # # Define multiple SQL commands
    # sql_commands = [
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python Obspy', 'ObsPy is an open-source Python library used for seismic data processing and analysis. It stands for Observatory Python and provides a wide range of functionalities for working with seismological data.', 'obspy-icon.png', 'static', 'obspy.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Fourier spectra calculation', 'An interactive tool to calculate the Fourier spectra on a window of a seismogram. The Fourier transform is commonly used in seismology to analyze the frequency content of seismic signals.', 'fourier-icon.png', 'interactive', 'fourier.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Arrival time picking', 'Arrival time picking refers to the process of extracting the arrival times of specific seismic phases from a seismogram. These arrival times provide valuable information about the timing and characteristics of seismic events.', 'arrival-pick-icon.png', 'interactive', 'pick-arrivals.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('ASCII to MSEED', 'An interactive tool to convert ASCII files to ObsPy MiniSEED (mseed) format. Use this option if you want to transform your data into a binary format to use the available tools.', 'ascii-to-mseed-icon.png', 'interactive', 'ascii-to-mseed.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Signal processing', 'An interactive tool to apply various techniques and algorithms to analyze, filter, enhance, and extract meaningful information from seismic records.', 'signal-processing-icon.png', 'interactive', 'signal-processing.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Site effect', 'Refers to the phenomenon where the characteristics of the local site or subsurface geology affect the propagation and amplification of seismic waves.', 'site-effect-icon.png', 'static', 'site-effect.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Introduction to Seismology', 'A small introduction to various seismological concepts and the propagation of seismic waves through the Earth', 'introduction-to-seismology.png', 'static', 'seismology-intro.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Distance between points', 'Compute the distance between two geographical points on the WGS84 ellipsoid', 'distance-between-points.png', 'interactive', 'distance-between-points.html')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python File Manipulation', 'Use Python libraries to manipulate system files. Simplify tasks like directory traversal, file creation, path handling and pattern matching using libraries like Python os, pathlib, shutil and more.', 'file-manipulation.png', 'static', 'file-manipulation.html')"
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python Matplotlib Tutorial', 'Unlock the power of Python and Matplotlib for visually analyzing seismic data. Dive into our comprehensive tutorial, where we guide you through the art of plotting and interpreting seismic data with precision and clarity.', 'matplotlib.png', 'static', 'matplotlib.html')"
        
    # ]

    # Create Topic instances for all topics
    tp1 = Topic(
        title="Python Obspy",
        description="ObsPy is an open-source Python library used for seismic data processing and analysis. It stands for Observatory Python and provides a wide range of functionalities for working with seismological data.",
        image_name="obspy-icon.png",
        type="static",
        template_name="obspy.html"
    )

    tp2 = Topic(
        title="Fourier spectra calculation",
        description="An interactive tool to calculate the Fourier spectra on a window of a seismogram. The Fourier transform is commonly used in seismology to analyze the frequency content of seismic signals.",
        image_name="fourier-icon.png",
        type="interactive",
        template_name="fourier.html"
    )

    tp3 = Topic(
        title="Arrival time picking",
        description="Arrival time picking refers to the process of extracting the arrival times of specific seismic phases from a seismogram. These arrival times provide valuable information about the timing and characteristics of seismic events.",
        image_name="arrival-pick-icon.png",
        type="interactive",
        template_name="pick-arrivals.html"
    )

    tp4 = Topic(
        title="ASCII to MSEED",
        description="An interactive tool to convert ASCII files to ObsPy MiniSEED (mseed) format. Use this option if you want to transform your data into a binary format to use the available tools.",
        image_name="ascii-to-mseed-icon.png",
        type="interactive",
        template_name="ascii-to-mseed.html"
    )

    tp5 = Topic(
        title="Signal processing",
        description="An interactive tool to apply various techniques and algorithms to analyze, filter, enhance, and extract meaningful information from seismic records.",
        image_name="signal-processing-icon.png",
        type="interactive",
        template_name="signal-processing.html"
    )

    tp6 = Topic(
        title="Site effect",
        description="Refers to the phenomenon where the characteristics of the local site or subsurface geology affect the propagation and amplification of seismic waves.",
        image_name="site-effect-icon.png",
        type="static",
        template_name="site-effect.html"
    )

    tp7 = Topic(
        title="Introduction to Seismology",
        description="A small introduction to various seismological concepts and the propagation of seismic waves through the Earth.",
        image_name="introduction-to-seismology.png",
        type="static",
        template_name="seismology-intro.html"
    )

    tp8 = Topic(
        title="Distance between points",
        description="Compute the distance between two geographical points on the WGS84 ellipsoid.",
        image_name="distance-between-points.png",
        type="interactive",
        template_name="distance-between-points.html"
    )

    tp9 = Topic(
        title="Python File Manipulation",
        description="Use Python libraries to manipulate system files. Simplify tasks like directory traversal, file creation, path handling, and pattern matching using libraries like Python os, pathlib, shutil, and more.",
        image_name="file-manipulation.png",
        type="static",
        template_name="file-manipulation.html"
    )

    tp10 = Topic(
        title="Python Matplotlib Tutorial",
        description="Unlock the power of Python and Matplotlib for visually analyzing seismic data. Dive into our comprehensive tutorial, where we guide you through the art of plotting and interpreting seismic data with precision and clarity.",
        image_name="matplotlib.png",
        type="static",
        template_name="matplotlib.html"
    )

    Topic.query.delete()
    db.session.commit()

    for tp in [tp1, tp2, tp3, tp4, tp5, tp6, tp7, tp8, tp9, tp10]:
        db.session.add(tp)
    db.session.commit()

    # redirect to show all topics
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/add-topic', methods=['GET', 'POST'])
def add_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    topic = Topic(
        title = topic_title,
        description = topic_description,
        image_name = topic_image_name,
        type = topic_type,
        template_name = topic_template_name
    )
    db.session.add(topic)
    db.session.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/edit-topic/<topic_id>', methods=['GET', 'POST'])
def edit_topic(topic_id):
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    topic = User.query.filter_by(id=topic_id).first()

    topic.title = topic_title
    topic.description = topic_description
    topic.image_name = topic_image_name
    topic.type = topic_type
    topic.template_name = topic_template_name

    db.session.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/delete-topic/<topic_id>', methods=['GET', 'POST'])
def delete_topic(topic_id):
    topic = User.query.filter_by(id=topic_id).first()

    db.session.delete(topic)
    db.session.commit()
    return redirect(url_for('BP_admin.show_all_topics'))

@bp.route('/delete-user/<user_id>', methods=['GET', 'POST'])
def delete_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('BP_admin.show_all_users'))

