import os
from flask import Flask, render_template, g, redirect, url_for
from . import db
from . import auth
from . import fourier
from . import pick_arrivals
from . import ascii_to_mseed
from . import signal_processing
from .auth import login_required

def create_app(test_config=None):

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'seismo-database.sqlite'),
    )

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

    @app.route('/index', methods=['GET'])
    def index():
        return render_template('index.html')

    @app.route('/home', methods=['GET'])
    def home():
        return render_template('home.html')
    
    
    
    # @login_required
    @app.route('/topics/<page>', methods=['GET'])
    def topics(page):
        if g.user:
            return 'Welcome to the protected page!'
        else:
            return redirect(url_for('auth.login'))
        
        template_full_path = os.path.join(app.root_path, 'templates', 'topics', page)
        if os.path.exists(template_full_path):
            return render_template(f'topics/{page}')
        else:
            return render_template('page-not-found.html')
    
    db.init_app(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(ascii_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)


    return app


# @app.route("/load-test-mseed-file", methods=["GET"])
# def load_test_mseed_file():

#     # read the test file in the server and
#     # assign the path of the loaded file to the raw_mseed_file_path variable
#     test_mseed_path = os.path.join(app.root_path, "static-data", f"test.mseed")

#     view_page = request.form['view-page']

#     # Read the MSeed file using obspy
#     try:
#         stream = read(test_mseed_path)
#     except Exception as e:
#         generate_error_response(str(e))
    
#     unique_session_id = uuid.uuid4()

#     session['user-unique-id'] = unique_session_id
    
#     # define the path of the written uploaded file
#     raw_mseed_file_path = os.path.join(app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
#     # write the uploaded file
#     stream.write(raw_mseed_file_path)

#     if view_page == 'signal-processing':
#         processed_mseed_file_path = os.path.join(app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
#         stream.write(processed_mseed_file_path)


#     # convert the uploaded mseed file to json
#     json_data = convert_mseed_to_json(stream)
#     return json_data

