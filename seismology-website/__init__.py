import os
from flask import Flask, render_template, g, redirect, jsonify, url_for, session, flash, get_flashed_messages, request
from . import db
from . import auth
from . import fourier
from . import pick_arrivals
from . import ascii_to_mseed
from . import signal_processing
from . import topics_table
from . import users_table
from .auth import login_required
from .db import get_db
import re

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


    @app.route('/home', methods=['GET'])
    @app.route('/', methods=['GET'])
    def home():
        return render_template('home.html')

   
    @app.route('/all-topics', methods=['GET'])
    @login_required
    def all_topics():
        database = get_db()
        all_topics = database.execute("SELECT * FROM topics").fetchall()
        radioButtonSelectedValue = 'all topics'
        return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton=radioButtonSelectedValue)

    @app.route('/topic-type-filter', methods=['POST'])
    def topic_type_filter():
        radioButtonSelectedValue = request.form.get('topic-type')
        database = get_db()
        if radioButtonSelectedValue == 'all topics':
            all_topics = database.execute("SELECT * FROM topics").fetchall()
        elif radioButtonSelectedValue == 'static topics':
            all_topics = database.execute("SELECT * FROM topics WHERE topic_type = ?", ('static',)).fetchall()
        elif radioButtonSelectedValue == 'interactive topics':
            all_topics = database.execute("SELECT * FROM topics WHERE topic_type = ?", ('interactive', )).fetchall()
   
        return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton=radioButtonSelectedValue)


    @app.route('/home-static-filter', methods=['GET'])
    def home_static_filter():
        database = get_db()
        all_topics = database.execute("SELECT * FROM topics WHERE topic_type = ?", ('static',)).fetchall()
        return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton='static topics')


    @app.route('/home-interactive-filter', methods=['GET'])
    def home_interactive_filter():
        database = get_db()
        all_topics = database.execute("SELECT * FROM topics WHERE topic_type = ?", ('interactive',)).fetchall()
        return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton='interactive topics')

    @app.route('/home-all-filter', methods=['GET'])
    def home_all_filter():
        database = get_db()
        all_topics = database.execute("SELECT * FROM topics").fetchall()
        return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton='all topics')


    @app.route('/search-topic', methods=['POST'])
    def search_topic():
        search_param = request.form.get('search-param')
        database = get_db()
        all_topics = database.execute("SELECT * FROM topics").fetchall()
        if not search_param:
            return render_template('all-topics.html', all_topics=all_topics, selectedradiobutton='all topics')
        else:
            found_topics_list = []
            for tp in all_topics:
                lower_search_param = search_param.lower()
                lower_description = tp['description'].lower()
                if re.search(lower_search_param, lower_description):
                    found_topics_list.append(tp)
            return render_template('all-topics.html', all_topics=found_topics_list, selectedradiobutton='all topics')




    # @app.route('/page/<page>', methods=['GET'])
    # @login_required
    # def topics(page):
    #     template_full_path = os.path.join(app.root_path, 'templates', 'topics', page)
    #     if os.path.exists(template_full_path):
    #         return render_template(f'topics/{page}')
    #     else:
    #         return render_template('page-not-found.html')
    
    db.init_app(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(ascii_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(topics_table.bp)
    app.register_blueprint(users_table.bp)



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

