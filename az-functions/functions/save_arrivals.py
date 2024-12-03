import azure.functions as func
import logging
import tempfile 
from utilities.TempFileHandler import TempFileHandler

def save_arrivals(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Saving the body wave arrivals')

    p_arrival = req.params.get("Parr")
    s_arrival = req.params.get("Sarr")

    if p_arrival is None and s_arrival is None:
        error_message = "You need to select at least one wave arrival to use this option!"
        return func.HttpResponse(error_message, status_code=404)
    
    if (p_arrival is not None and s_arrival is not None) and (float(s_arrival) <= float(p_arrival)):
        error_message = "The S wave arrival cannot be less or equal to the P wave arrival!"
        return func.HttpResponse(error_message, status_code=404)
    
    # create the dictionary to save the arrivals
    dict_arrivals = {"P": p_arrival, "S": s_arrival}
    
    content = f"Arrivals \n P: {dict_arrivals['P']} \n S: {dict_arrivals['S']} \n"
    temp_file_handler = TempFileHandler(content)
    response = temp_file_handler.create_temp_file_response()

    return response