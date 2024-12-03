import azure.functions as func
import logging
import json
from obspy.core import read
from utilities.StreamHandler import StreamHandler
from utilities.UploadFileHandler import UploadFileHandler

def upload_seismic_file(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the uploaded file as binary data')

    try:
        # Check if req.files is None or empty
        if not req.files or "file" not in req.files:
            logging.error("No file found in the request")
            return func.HttpResponse("No file found", status_code=400)

        # get the file
        seismic_file = req.files["file"]
        logging.info(f"Processing file: {seismic_file.filename}")
        
        # Get the file stream
        filestream = seismic_file.stream

        upload_file_handler = UploadFileHandler(filestream)

        return_result = upload_file_handler.convert_spool_file_to_stream()

        if isinstance(return_result, str):
            return func.HttpResponse(
                "Cannot read the seismic file!",
                status_code=404
            )
        
        stream_handler = StreamHandler(return_result)

        return_item = stream_handler.convert_stream_to_traces()

        # Return a success message
        return func.HttpResponse(json.dumps(return_item), status_code=200)

    except Exception as e:
        logging.error(f"Error processing the file: {str(e)}")
        return func.HttpResponse(
            f"Error processing the file: {str(e)}",
            status_code=500
        )
