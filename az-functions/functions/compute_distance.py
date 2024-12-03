import azure.functions as func
import logging
from utilities.ComputeDistanceHandler import ComputeDistanceHandler

def compute_distance(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the coordinates')

    lat1 = req.params.get('lat1')
    lon1 = req.params.get('lon1')
    lat2 = req.params.get('lat2')
    lon2 = req.params.get('lon2')

    logging.info(f"lat1: {lat1}, lon1: {lon1}, lat2: {lat2}, lon2: {lon2}")

    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        error_message = "The coordinates passed cannot be empty!"
        logging.error(error_message)
        return func.HttpResponse(error_message, status_code=404)

    distance_handler = ComputeDistanceHandler(lat1, lon1, lat2, lon2)
    response = distance_handler.compute_distance()

    return response