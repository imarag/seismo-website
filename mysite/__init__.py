from flask import Flask, render_template, send_file, request, flash, session, redirect, url_for, abort
from flask_mail import Mail, Message
import os
from .functions import generate_random_string
import json
from markupsafe import escape


mail = Mail()

def create_app():
   
    app = Flask(__name__, instance_relative_config=True)

    app.config['DATA_FILES_FOLDER'] = os.path.join(app.root_path, 'data_files')
    app.config["ALL_TOPICS_FILE"] = os.path.join(app.instance_path, "all-topics.json")

    app.config["ADMIN_USERNAME"] = "ioannis95"
    app.config["ADMIN_PASSWORD"] = "Seismologia95@"

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'seismoweb95@gmail.com'
    app.config['MAIL_PASSWORD'] = 'qppnzstyxltfjcnz'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    app.config['SECRET_KEY'] = 'asdf12345po45i34OI'

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
    @app.route('/index')
    def home():
        return render_template('index.html')

    @app.route('/show-topic/<topic_tmp_name>')
    def show_topic(topic_tmp_name):

        if not os.path.exists(os.path.join(app.root_path, "templates", "topics", f"{topic_tmp_name}.html")):
            abort(404)

        if 'user_id' not in session:
            user_id = generate_random_string()
            session['user_id'] = user_id
        
        with open(app.config["ALL_TOPICS_FILE"]) as fjson:
            topics = json.load(fjson)["topics"]
            for tp in topics:
                if tp["template_name"] == topic_tmp_name:
                    topic = tp
                    break

        return render_template(f'topics/{topic_tmp_name}.html', topic_object = topic)
    
    @app.route('/get-page/<page_name>')
    def get_page(page_name):
        if not os.path.exists(os.path.join(app.root_path, "templates", f"{page_name}.html")):
            abort(404)
        return render_template(f'{page_name}.html')
    
    @app.route('/download-static-file/<file>')
    def download_static_file(file):
        static_file_path = os.path.join(app.root_path, 'static', 'static-files', file)
        return send_file(static_file_path, as_attachment=True, download_name=file)
    
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

    # 400 Bad Request, The server could not understand the request due to invalid syntax or missing parameters.
    @app.errorhandler(400)
    def error_400(error):
        return render_template('errors/400.html', e=error), 400

    # 401 Unauthorized, the client needs to provide valid credentials (authenticate) to access the resource.
    @app.errorhandler(401)
    def error_401(error):
        return render_template('errors/401.html', e=error), 401
    
    # 403 Forbidden, the server understands the request, but the client, even with valid credentials, is not permitted to access the resource
    @app.errorhandler(403)
    def error_403(error):
        return render_template('errors/403.html', e=error), 403

    # 404 Not Found: The server could not find the requested resource
    @app.errorhandler(404)
    def error_404(error):
        return render_template('errors/404.html', e=error), 404
    
    # 503 Service Unavailable: The server is not ready to handle the request. Commonly used when a server is temporarily down for maintenance.
    @app.errorhandler(503)
    def error_503(error):
        return render_template('errors/503.html', e=error), 503
    
    # 500 Internal Server Error: A generic error message returned when an unexpected condition was encountered by the server.
    # @app.errorhandler(Exception)
    # def handle_exception(error):
    #     return render_template("errors/generic_error.html", e=error), 500


    from . import fourier
    from . import pick_arrivals
    from . import file_to_mseed
    from . import signal_processing
    from . import search_topics
    from . import admin
    from . import distance_between_points
    from . import edit_seismic_file
    from . import raypath

    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(file_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(search_topics.bp)
    app.register_blueprint(distance_between_points.bp)
    app.register_blueprint(edit_seismic_file.bp)
    app.register_blueprint(raypath.bp)

    return app