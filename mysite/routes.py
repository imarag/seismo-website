
from flask import current_app, request, Response, Blueprint, session, send_file
import os
from obspy.core import read
from .functions import convert_mseed_to_json, validate_seismic_file, generate_random_string

bp = Blueprint('main', __name__, url_prefix="/")

@bp.before_request
def before_request():
    # Check if 'user_id' already exists in the session; if not, generate it
    if "user_id" not in session:
        session["user_id"] = generate_random_string()


@bp.route("/download-static-file/<file>", methods=["GET"])
def download_static_file(file):
    static_file_path = os.path.join(current_app.root_path, "static", "static-files", file)
    return send_file(static_file_path, as_attachment=True, download_name=file)
    

@bp.route("/upload-seismic-file", methods=["POST"])
def upload_seismic_file():
    
    # get the files (in our case just one)
    files = request.files

    # check if file exists
    if "file" not in files or len(files) < 1:
        return Response(
            "No file uploaded",
            status=400,
        )  

    # Get the uploaded file from the request
    seismic_file = files["file"]

    try:
        stream = read(seismic_file)
    except Exception as e:
        return Response(
            "Cannot read the seismic file: " + str(e),
            status=400,
        )   

    stream_validation_message = validate_seismic_file(stream)

    if stream_validation_message:
        return Response(
            stream_validation_message,
            status=400,
        )

    # get the file path to save the uploaded file as miniseed in the server
    mseed_file_save_path = create_path("pick-arrivals-tool-stream.mseed")

    path = os.path.join(current_app.config["DATA_FILES_FOLDER"], str(session.get("user_id", "test")) + "_" + name)
    
    # write the uploaded file
    stream.write(mseed_file_save_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)

    return json_data