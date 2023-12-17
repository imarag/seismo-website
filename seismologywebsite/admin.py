from flask import Blueprint, redirect, render_template, request, url_for, flash, current_app
from . import Topic, db
import shutil
import os

bp = Blueprint('BP_admin', __name__, url_prefix = '/admin')


@bp.route('/admin-login', methods=["POST", "GET"])
def admin_login():

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if username == current_app.config["ADMIN_USERNAME"] and password == current_app.config["ADMIN_PASSWORD"]:
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

@bp.route('/clear-data-files')
def clear_data_files():
    data_file_folder = current_app.config['DATA_FILES_FOLDER']
    shutil.rmtree(data_file_folder)
    if not os.path.exists(os.path.join(current_app.root_path, 'data_files')):
        os.mkdir(os.path.join(current_app.root_path, 'data_files'))
    flash('You have succesfully cleared the "data_files" folder!', "success")
    return redirect(url_for('BP_admin.admin_index'))


@bp.route('reset-topics')
def reset_topics():

    # Create Topic instances for all topics
    tp1 = Topic(
        title="Python Obspy",
        description="An open-source Python library designed for advanced analysis, processing, and manipulation of seismological data",
        image_name="obspy-icon.png",
        type="static",
        template_name="obspy"
    )

    tp2 = Topic(
        title="Fourier Spectra calculation",
        description="An interactive tool to calculate the Fourier spectra at the signal and/or the noise window on the seismogram. Optionally, compute the Horizontal to Vertical Spectral Ratio (HVSR) using the generated Fourier spectra. Feel free to download the data and the figures at the results.",
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
        description="An interactive tool to transform data files into the seismic MiniSEED format. To begin, upload your file at the specific file format menu, and specify the relevant parameters (e.g., delimiter and skip rows). Afterward, choose the corresponding seismic parameters to complete the conversion process.",
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
        image_name="introduction-to-seismology-icon.png",
        type="static",
        template_name="seismology-intro"
    )

    tp8 = Topic(
        title="Distance between points",
        description='An interactive tool to compute the distance between two geographical points on the WGS84 ellipsoid. Use the "locate" option to open an interactive map and visually inspect the specified points.',
        image_name="distance-between-points-icon.png",
        type="interactive",
        template_name="distance-between-points"
    )

    tp9 = Topic(
        title="Python File Manipulation",
        description="Utilization of various Python libraries to manipulate system files and paths",
        image_name="file-manipulation-icon.png",
        type="static",
        template_name="file-manipulation"
    )

    tp10 = Topic(
        title="Python Matplotlib Plotting",
        description="A basic tutorial to plot seismic data using various Matplotlib functions and methods",
        image_name="matplotlib-icon.png",
        type="static",
        template_name="matplotlib"
    )

    tp11 = Topic(
        title="Edit Seismic File",
        description="A tool to look into the content of a seismic file. Feel free to edit the header of it and download its data",
        image_name="edit-seismic-file-icon.png",
        type="interactive",
        template_name="edit-seismic-file"
    )

    tp12 = Topic(
        title="Compute Fourier Spectra On A Window",
        description="An article that computes the Fourier Spectra between a window on the waveforms",
        image_name="fourier-on-window-icon.png",
        type="static",
        template_name="compute-fourier-on-window"
    )

    Topic.query.delete()
    db.session.commit()

    for tp in [tp1, tp2, tp3, tp4, tp5, tp6, tp7, tp8, tp9, tp10, tp11, tp12]:
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

    topic = Topic.query.filter_by(id=topic_id).first()

    topic.title = topic_title
    topic.description = topic_description
    topic.image_name = topic_image_name
    topic.type = topic_type
    topic.template_name = topic_template_name

    db.session.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/delete-topic/<topic_id>', methods=['GET', 'POST'])
def delete_topic(topic_id):
    topic = Topic.query.filter_by(id=topic_id).first()

    db.session.delete(topic)
    db.session.commit()
    return redirect(url_for('BP_admin.show_all_topics'))


