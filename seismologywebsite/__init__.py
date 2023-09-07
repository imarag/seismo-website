import os
from flask import Flask, render_template,  send_file, redirect, jsonify, url_for, session, flash, request, make_response
from .auth import login_required
from .db import get_db
from flask_mail import Mail, Message
from .functions import send_email
from obspy.geodetics import gps2dist_azimuth
from .functions import  raise_error
from . import db


mail = Mail()

def create_app(test_config=None):

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, 'seismo-database.sqlite'),
    )

    # load the instance config, if it exists, when not testing or the test config when testing
    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    app.config['DATA_FILES_FOLDER'] = os.path.join(app.root_path, 'data_files')

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    

    db.init_app(app)
    mail.init_app(app)


    

    @app.route('/')
    @app.route('/home')
    def home():
        return render_template('index.html')


    @app.route('/show-topic/<topic_name>')
    @login_required
    def show_topic(topic_name):
        return render_template(f'topics/{topic_name}')

    @app.route('/resource-file')
    @login_required
    def resource_file():
        return render_template(f'resources.html')

    @app.route('/help-and-support')
    def help_and_support():
        return render_template('help-and-support.html')
    
    @app.route('/download-static-file/<file>')
    def download_static_file(file):
        name = os.path.basename(file)
        static_file_path = os.path.join(app.root_path, 'static', 'static-files', name)
        download_name = os.path.basename(static_file_path)
        return send_file(static_file_path, as_attachment=True, download_name=download_name)
    
    @app.route('/calculate-distance')
    def calculate_distance():
        point1_lat = request.args.get('point1-lat-input')
        point1_lon = request.args.get('point1-lon-input')
        point2_lat = request.args.get('point2-lat-input')
        point2_lon = request.args.get('point2-lon-input')

        if not point1_lat or not point1_lon or not point2_lat or not point2_lon:
            error_message = 'You need to include the coordinates of both points!'
            return raise_error(error_message)
        
        try:
            [float(point1_lat),float(point1_lon),float(point2_lat),float(point2_lon)]
        except:
            error_message = 'You need to provide numbers as the points coordinates!'
            return raise_error(error_message)

        if float(point1_lon) > 180 or float(point1_lon) < -180 or float(point2_lon) > 180 or float(point2_lon) < -180:
            error_message = 'The longitude value can be between -180 and 180 degrees!'
            return raise_error(error_message)
        
        if float(point1_lat) > 90 or float(point1_lat) < -90 or float(point2_lat) > 90 or float(point2_lat) < -90:
            error_message = 'The latitude value can be between -90 and 90 degrees!'
            return raise_error(error_message)
        
        try:
            result = gps2dist_azimuth(
                float(point1_lat),
                float(point1_lon),
                float(point2_lat),
                float(point2_lon)
            )[0]/1000
            result = round(result, 3)
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)
        
        point_label = f'Point({float(point1_lat):.3f},{float(point1_lon):.3f})-Point({float(point2_lat):.3f},{float(point2_lon):.3f})' 
        
        return jsonify({'result': result, 'points': point_label})
    

    @app.errorhandler(403)
    def error_403(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def error_404(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def error_500(error):
        return render_template('errors/500.html'), 500


    from . import forgot_password
    from . import auth
    from . import fourier
    from . import pick_arrivals
    from . import ascii_to_mseed
    from . import signal_processing
    from . import search_topics
    from . import admin
    from . import user_account
    

    app.register_blueprint(auth.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(ascii_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(search_topics.bp)
    app.register_blueprint(user_account.bp)
    app.register_blueprint(forgot_password.bp)



    
    

    
    
    
    @app.route('/receive-feedback', methods=['POST'])
    @login_required
    def receive_feedback():
        feedback_input_text = request.form['feedback-input']

        if feedback_input_text:
            flash('Thank you for your feedback!')

            database = get_db()
            user_id = session["user_id"]
            user = database.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()

            # send the email
            send_email(mail, user['email'], feedback_input_text)

        flash("You haven't provided any feedback", "danger")

        return redirect(url_for('help_and_support'))
    
    
 
    


    

    return app

