import os
from flask import Flask, render_template,  redirect, jsonify, url_for, session, flash, request, make_response
from .auth import login_required
from . import db
from . import auth
from . import fourier
from . import pick_arrivals
from . import ascii_to_mseed
from . import signal_processing
from . import search_topics
from . import topics_table
from . import users_table
from . import user_account
from .db import get_db
from flask_mail import Mail, Message
from .functions import send_email
from obspy.geodetics import gps2dist_azimuth
from .functions import  raise_error

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
        return render_template('home.html')


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

        return jsonify({'result': result})
    

    @app.errorhandler(403)
    def error_403(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def error_404(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def error_500(error):
        return render_template('errors/500.html'), 500



    app.register_blueprint(auth.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(ascii_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(topics_table.bp)
    app.register_blueprint(users_table.bp)
    app.register_blueprint(search_topics.bp)
    app.register_blueprint(user_account.bp)



    @app.route('/send-email', methods=['POST'])
    def send_reset_password_email():
        # get the email from the password reset when you hit forgot password
        user_email = request.form['email-input']

        # if the user did not provide any email abort
        if not user_email:
            flash('You must fill an email!')
            return redirect(url_for('auth.forgot_password'))
        
        # get the database
        db = get_db()
       
        # search the database for the email that the user provided
        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (user_email, )
        ).fetchone()

        # if it can't find any user with that email then abort
        if not user:
            flash('There is no user with that email!')
            return redirect(url_for('auth.forgot_password'))

        # # create the message to send to the user email
        # msg = Message(
        #     sender = app.config['MAIL_USERNAME'], 
        #     recipients = [user_email])
        
        # i can't user jinja in the msg.html below. So i create the link url that the email message will have, here
        # it will send the user to the reset_password. Pass also the user_email to use it later
        # reset_password_url = url_for('auth.reset_password', user_email=user_email, _external=True)

        # # create the message html
        # msg.html = f"""
        # <h1>Click the link below to reset your email</h1>
        # <div>
        #     <a href="{reset_password_url}">Reset password</a>
        # </div>
        # """

        # # send the email
        # mail.send(msg)
        
        # when you send it, redirect to home page
        return(redirect(url_for('home')))
    

    
    
    
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

