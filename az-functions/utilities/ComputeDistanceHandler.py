from dataclasses import dataclass
import azure.functions as func
import logging
import json
from obspy.geodetics.base import gps2dist_azimuth

@dataclass
class ComputeDistanceHandler:
    lat1: str 
    lon1: str 
    lat2: str 
    lon2: str 

    def compute_distance(self):
        logging.info("validating coordinates...")
        val_coords_error = self.validate_coordinates()
        
        if val_coords_error is not None:
            return func.HttpResponse(
                val_coords_error,
                status_code=404
            )
        logging.info("Calculating the distance...")
        dist = gps2dist_azimuth(
            float(self.lat1), 
            float(self.lon1), 
            float(self.lat2), 
            float(self.lon2)
        )[0] / 1000

        return func.HttpResponse(
            json.dumps({"distance": dist}),
            status_code=200,
            mimetype="application/json"
        )
    
    def validate_coordinates(self):
        try:
            lat1, lon1, lat2, lon2 = map(float, (self.lat1, self.lon1, self.lat2, self.lon2))
        except ValueError:
            error_message = "All coordinates must be valid numbers."
            return error_message

        if lat1 >= 90 or lat1 <= -90 or lat2 >= 90 or lat2 <= -90:
            error_message = "Latitude values can be between -90 and 90 degrees!"
            logging.error(error_message)
            return error_message 
    
        if lon1 >= 180 or lon1 <= -180 or lon2 >= 180 or lon2 <= -180:
            error_message = "Longitude values can be between -180 and 180 degrees!"
            logging.error(error_message)
            return error_message 
    
    
