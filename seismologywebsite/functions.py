from flask import session, jsonify, abort, current_app, make_response
from obspy.core import read
import os
from flask_mail import Message


def get_record_name(tool):
    mseed_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_" + tool)
    # read it
    mseed = read(mseed_path)
    # create the record name
    first_trace = mseed[0]
    starttime = first_trace.stats["starttime"]
    station = first_trace.stats["station"]
    if not station:
        station = 'STATION'
    rec_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    return rec_name

def convert_mseed_to_json(stream):
    traces_data_dict = {}
    first_trace = stream[0]
    starttime = first_trace.stats["starttime"]
    fs = float(first_trace.stats["sampling_rate"])
    station = first_trace.stats["station"]
    rec_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    starttime = starttime.isoformat()
    
    for n, trace in enumerate(stream):
        ydata = trace.data.tolist()
        xdata = trace.times().tolist()

        trace_data = {
            'record-name': rec_name,
            'ydata': ydata,
            'xdata': xdata,
            'stats': {
                'channel': trace.stats["channel"]
            },
            }
        traces_data_dict[f'trace-{n}'] = trace_data
    return jsonify(traces_data_dict)


def raise_error(error_message):
    response = jsonify({'error_message': error_message})
    return make_response(response, 400)

def send_email(mail, sender_email, feedback_text):
    msg = Message(
        sender = sender_email, 
        recipients = ['giannis.marar@hotmail.com'],
        subject="Feedback created (seismology website)"
        )
    
    # create the message html
    msg.html = f"""
        <h1>Feedback</h1>
        <h3>From: {sender_email}</h3>
        <div>
            <p>{feedback_text}</p>
        </div>
        """
    
    # send the email
    mail.send(msg)