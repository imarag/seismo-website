import os
from flask import Flask, render_template,  redirect, jsonify, url_for, session, flash, request, make_response
from .auth import login_required
from . import db
from . import auth
from . import fourier
from . import pick_arrivals
from . import ascii_to_mseed
from . import signal_processing
from . import topics
from . import topics_table
from . import users_table
from . import user_account
from .db import get_db
from flask_mail import Mail, Message


def create_app(test_config=None):

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    mail = Mail(app)

    @app.route('/send-email', methods=['POST'])
    def send_email():
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

        # create the message to send to the user email
        msg = Message(
            sender = app.config['MAIL_USERNAME'], 
            recipients = [user_email])
        
        # i can't user jinja in the msg.html below. So i create the link url that the email message will have, here
        # it will send the user to the reset_password. Pass also the user_email to use it later
        reset_password_url = url_for('auth.reset_password', user_email=user_email, _external=True)

        # create the message html
        msg.html = f"""
        <h1>Click the link below to reset your email</h1>
        <div>
            <a href="{reset_password_url}">Reset password</a>
        </div>
        """

        # send the email
        mail.send(msg)
        
        # when you send it, redirect to home page
        return(redirect(url_for('home')))
    



    @app.route('/home', methods=['GET'])
    @app.route('/', methods=['GET'])
    def home():
        return render_template('home.html')
    

    @app.route('/show-article/<article_name>', methods=['GET'])
    @login_required
    def show_article(article_name):
        return render_template(f'topics/{article_name}')
    
    @app.route('/resource-file')
    @login_required
    def resource_file():
        return render_template(f'resources.html')
    
    @app.route('/receive-feedback', methods=['POST'])
    def receive_feedback():
        feedback_input_text = request.form['feedback-input']
        
        if feedback_input_text:
            flash('Thank you for your feedback!')

            database = get_db()
            user_id = session["user_id"]
            user = database.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
            sender_email = user['email']
            # create the message to send to the user email
            msg = Message(
                sender = sender_email, 
                recipients = ['giannis.marar@hotmail.com'],
                subject="Feedback acquired (seismology website)"
                )
    
            # create the message html
            msg.html = f"""
                <h1>From: {sender_email}</h1>
                <div>
                    <p>{feedback_input_text}</p>
                </div>
                """
            
            # send the email
            mail.send(msg)

        return redirect(url_for('BP_user_account.help_and_support'))
    
    
   
    @app.errorhandler(400)
    def handle_bad_request(error):
        response = jsonify({'error_message': error.description})
        return make_response(response, 400)
    
    db.init_app(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(ascii_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(topics_table.bp)
    app.register_blueprint(users_table.bp)
    app.register_blueprint(topics.bp)
    app.register_blueprint(user_account.bp)

    return app


