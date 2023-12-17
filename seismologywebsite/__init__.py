from flask import Flask, render_template, send_file, request, flash, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_mail import Mail, Message
import os
from markupsafe import escape
import random 
import string 
import re


db = SQLAlchemy()
mail = Mail()


class Topic(db.Model, UserMixin):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    template_name = db.Column(db.String(255), nullable=False)


def create_app(test_config=None):
   
    app = Flask(__name__, instance_relative_config=True)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///seismo-database.db"
    app.config['DATA_FILES_FOLDER'] = os.path.join(app.root_path, 'data_files')

    # Set admin credentials in the configuration
    app.config["ADMIN_USERNAME"] = "ioannis95"
    app.config["ADMIN_PASSWORD"] = "Seismologia95@"

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'seismoweb95@gmail.com'
    app.config['MAIL_PASSWORD'] = 'qppnzstyxltfjcnz'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    app.config.from_mapping(
        SECRET_KEY = 'asdf12345po45i34OI'
    )

    db.init_app(app)
    mail.init_app(app)
   
    try:
        os.makedirs(app.instance_path)
    except:
        pass

    try:
        os.mkdir(os.path.join(app.root_path, 'data_files'))
    except:
        pass
    
    
    @app.route('/')
    @app.route('/home')
    @app.route('/index')
    def home():
        return render_template('index.html')

    @app.route('/show-topic/<topic_tmp_name>')
    def show_topic(topic_tmp_name):
        if 'user_id' not in session:
            user_id = ''.join(random.choices(string.ascii_letters + string.digits, k=25))
            session['user_id'] = user_id
        topic = Topic.query.filter_by(template_name=topic_tmp_name).first()
        return render_template(f'topics/{topic_tmp_name}.html', topic_object = topic)
    
    @app.route('/nada')
    def nada():
        return render_template(f'test.html')
    
    @app.route('/get-page/<page_name>')
    def get_page(page_name):
        return render_template(f'{page_name}.html')
    
    
    @app.route('/download-static-file/<file>')
    def download_static_file(file):
        name = os.path.basename(file)
        static_file_path = os.path.join(app.root_path, 'static', 'static-files', name)
        download_name = os.path.basename(static_file_path)
        return send_file(static_file_path, as_attachment=True, download_name=download_name)
    
    @app.route('/receive-feedback', methods=['POST'])
    def receive_feedback():
        feedback_input_text = request.form['feedback-input']

        if feedback_input_text:

            msg = Message(
                subject=f"Feedback",
                sender="seismoweb95@gmail.com",
                recipients = ["seismoweb95@gmail.com"],
                body=escape(feedback_input_text)
            )        
            mail.send(msg)
            flash('Thank you for your feedback!', 'info')
        
        return redirect(url_for('get_page', page_name='help-and-support'))

    @app.errorhandler(403)
    def error_403(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def error_404(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def error_500(error):
        return render_template('errors/500.html'), 500


    from . import fourier
    from . import pick_arrivals
    from . import file_to_mseed
    from . import signal_processing
    from . import search_topics
    from . import admin
    from . import distance_between_points
    from . import edit_seismic_file

    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(file_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(search_topics.bp)
    app.register_blueprint(distance_between_points.bp)
    app.register_blueprint(edit_seismic_file.bp)

    return app
   

with create_app().app_context():
    db.create_all()
    db.session.commit()
