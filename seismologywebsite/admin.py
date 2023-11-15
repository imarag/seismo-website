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
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python Obspy', 'ObsPy is an open-source Python library used for seismic data processing and analysis. It stands for Observatory Python and provides a wide range of functionalities for working with seismological data.', 'obspy-icon.png', 'static', 'obspy')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Fourier spectra calculation', 'An interactive tool to calculate the Fourier spectra on a window of a seismogram. The Fourier transform is commonly used in seismology to analyze the frequency content of seismic signals.', 'fourier-icon.png', 'interactive', 'fourier')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Arrival time picking', 'Arrival time picking refers to the process of extracting the arrival times of specific seismic phases from a seismogram. These arrival times provide valuable information about the timing and characteristics of seismic events.', 'arrival-pick-icon.png', 'interactive', 'pick-arrivals')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('ASCII to MSEED', 'An interactive tool to convert ASCII files to ObsPy MiniSEED (mseed) format. Use this option if you want to transform your data into a binary format to use the available tools.', 'ascii-to-mseed-icon.png', 'interactive', 'ascii-to-mseed')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Signal processing', 'An interactive tool to apply various techniques and algorithms to analyze, filter, enhance, and extract meaningful information from seismic records.', 'signal-processing-icon.png', 'interactive', 'signal-processing')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Site effect', 'Refers to the phenomenon where the characteristics of the local site or subsurface geology affect the propagation and amplification of seismic waves.', 'site-effect-icon.png', 'static', 'site-effect')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Introduction to Seismology', 'A small introduction to various seismological concepts and the propagation of seismic waves through the Earth', 'introduction-to-seismology.png', 'static', 'seismology-intro')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Distance between points', 'Compute the distance between two geographical points on the WGS84 ellipsoid', 'distance-between-points.png', 'interactive', 'distance-between-points')",
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python File Manipulation', 'Use Python libraries to manipulate system files. Simplify tasks like directory traversal, file creation, path handling and pattern matching using libraries like Python os, pathlib, shutil and more.', 'file-manipulation.png', 'static', 'file-manipulation')"
    #     "INSERT INTO topics (title, description, image_name, type, template_name) VALUES ('Python Matplotlib Tutorial', 'Unlock the power of Python and Matplotlib for visually analyzing seismic data. Dive into our comprehensive tutorial, where we guide you through the art of plotting and interpreting seismic data with precision and clarity.', 'matplotlib.png', 'static', 'matplotlib')"
        
    # ]

    # Create Topic instances for all topics
    tp1 = Topic(
        title="Python Obspy",
        description="An open-source Python library used for working with seismological data",
        image_name="obspy-icon.png",
        type="static",
        template_name="obspy"
    )

    tp2 = Topic(
        title="Fourier Spectra calculation",
        description="An interactive tool to calculate the Fourier spectra at the signal and/or at the noise window on the seismogram. Optionally, compute the Horizontal to Vertical Spectral Ratio (HVSR) using the generated Fourier spectra. Feel free to download the data and the figures at the results.",
        image_name="fourier-icon.png",
        type="interactive",
        template_name="fourier"
    )

    tp3 = Topic(
        title="Arrival Time Selection",
        description="An interactive tool to extract the P & S wave arrival times from the records. You can use either the built-in filters or manually set filters to filter the seismograms within a defined frequency range, simplifying the process of selecting the arrivals.",
        image_name="arrival-pick-icon.png",
        type="interactive",
        template_name="pick-arrivals"
    )

    tp4 = Topic(
        title="File to MiniSEED",
        description="An interactive tool to transform data files into the seismic MiniSEED format. To begin, upload your file from the specific file format menu, and specify the relevant parameters (e.g., delimiter and skip rows). Afterward, choose the corresponding seismic parameters to complete the conversion process.",
        image_name="file-to-mseed-icon.png",
        type="interactive",
        template_name="file-to-mseed"
    )

    tp5 = Topic(
        title="Signal Processing",
        description="An interactive tool to process seismic records using various techniques to cut the waveforms between a specific time range, to apply a smoothing function using an appropriate filter and eliminate any pre-existing trend in the waveforms.",
        image_name="signal-processing-icon.png",
        type="interactive",
        template_name="signal-processing"
    )

    tp6 = Topic(
        title="Seismic Site effect",
        description="The phenomenon of the amplification of the seismic ground motion due to the subsurface geological conditions",
        image_name="site-effect-icon.png",
        type="static",
        template_name="site-effect"
    )

    tp7 = Topic(
        title="Introduction to Seismology",
        description="An introduction to various seismological concepts",
        image_name="introduction-to-seismology.png",
        type="static",
        template_name="seismology-intro"
    )

    tp8 = Topic(
        title="Distance between points",
        description='An interactive tool to compute the distance between two geographical points on the WGS84 ellipsoid. Utilize the "locate" option to open an interactive map and check the points visually.',
        image_name="distance-between-points.png",
        type="interactive",
        template_name="distance-between-points"
    )

    tp9 = Topic(
        title="Python File Manipulation",
        description="Utilization of various Python libraries to manipulate system files and paths",
        image_name="file-manipulation.png",
        type="static",
        template_name="file-manipulation"
    )

    tp10 = Topic(
        title="Python Matplotlib Plotting",
        description="A basic tutorial to plot seismic data using various Matplotlib functions and methods",
        image_name="matplotlib.png",
        type="static",
        template_name="matplotlib"
    )

    tp11 = Topic(
        title="Edit Seismic File",
        description="A tool to find out about the content of a seismic file. Feel free to edit the header of it and download its data",
        image_name="edit_seismic_file.png",
        type="interactive",
        template_name="edit_seismic_file"
    )

    Topic.query.delete()
    db.session.commit()

    for tp in [tp1, tp2, tp3, tp4, tp5, tp6, tp7, tp8, tp9, tp10, tp11]:
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

