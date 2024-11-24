from flask import Flask, send_file, session
import os
from .functions import generate_random_string
from flask_cors import CORS

def create_app():

    app = Flask(__name__, instance_relative_config=True)
    CORS(app, supports_credentials=True)
    app.config['SESSION_PERMANENT'] = True
    app.config["SECRET_KEY"] = "asdf12345po45i34OI"
     

    from . import routes
    from . import fourier
    from . import pick_arrivals
    from . import file_to_mseed
    from . import signal_processing
    from . import distance_between_points
    from . import edit_seismic_file

    app.register_blueprint(routes.bp)
    app.register_blueprint(fourier.bp)
    app.register_blueprint(pick_arrivals.bp)
    app.register_blueprint(file_to_mseed.bp)
    app.register_blueprint(signal_processing.bp)
    app.register_blueprint(distance_between_points.bp)
    app.register_blueprint(edit_seismic_file.bp)

    return app
