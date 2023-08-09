import os
from flask import Flask, render_template, g, redirect, jsonify, url_for, session, flash, get_flashed_messages, request, make_response
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
    

    @app.route('/show-article/<article_name>', methods=['GET'])
    @login_required
    def show_article(article_name):
        return render_template(f'topics/{article_name}')
    

   
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

