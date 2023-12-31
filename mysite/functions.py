from flask import session, jsonify, abort, current_app, make_response
from obspy.core import read
import os
import pandas as pd
import string
import secrets
import random
import json


def get_topic(topic_info_name, topic_info_value):
    with open(current_app.config["ALL_TOPICS_FILE"]) as fjson:
        topics = json.load(fjson)["topics"]
        for tp in topics:
            if tp[topic_info_name] == topic_info_value:
                topic = tp
                return topic


def generate_random_string():
    return "".join(random.choices(string.ascii_letters + string.digits, k=25))


def raise_error(error_message):
    response = jsonify({"error_message": error_message})
    return make_response(response, 400)


def validate_seismic_file(
    seismic_file,
    check_total_traces=True,
    check_empty_traces=True,
    check_fs_dt=True,
    check_equal_parameters=True,
    check_numbers=True,
    check_total_number_of_npts=True,
):
    if check_total_traces:
        # if the stream has 0, 1 or more than 3 traces abort
        if len(seismic_file) not in [2, 3]:
            error_message = f"The seismic file provided needs to include two or three traces (records), comprising either one or two horizontal components and one vertical component. Your current seismic file contains {len(seismic_file)} traces!"
            return error_message

    if check_empty_traces:
        # if at least one of the traces is empty abort
        for tr in seismic_file:
            if len(tr.data) == 0:
                error_message = (
                    "One or more of your records in the stream object, is empty!"
                )
                return error_message

    if check_numbers:
        # check if the data of the traces are indeed numbers and not any string
        for tr in seismic_file:
            try:
                pd.to_numeric(tr.data, errors="raise")
            except:
                error_message = f"The data in one of your records (channel: {tr.stats.channel}) contain a non-valid input value. Only numbers and NaN values are allowed!"
                return error_message

    if check_fs_dt:
        # if the user hasn't defined nor the fs neither the delta, then error
        for tr in seismic_file:
            if tr.stats["sampling_rate"] == 1 and tr.stats["delta"] == 1:
                error_message = "Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream objects, for the correct x-axis time representation!"
                return error_message

    if check_equal_parameters:
        npts_list = []
        fs_list = []
        dt_list = []
        starttime_list = []
        for tr in seismic_file:
            npts_list.append(tr.stats["npts"])
            fs_list.append(tr.stats["sampling_rate"])
            dt_list.append(tr.stats["delta"])
            starttime_list.append(str(tr.stats["starttime"]))

        if len(set(npts_list)) != 1:
            error_message = "The traces in the stream object, do not have the same number of sampling data points (npts)!"
            return error_message
        if len(set(fs_list)) != 1:
            error_message = "The traces in the stream object, do not have the same sampling frequency (fs)!"
            return error_message
        if len(set(dt_list)) != 1:
            error_message = "The traces in the stream object, do not have the same sampling distance (dt)!"
            return error_message
        if len(set(starttime_list)) != 1:
            error_message = (
                "The traces in the stream object, do not have the same starting time!"
            )
            return error_message

    if check_total_number_of_npts:
        if seismic_file[0].stats.npts > 200000:
            error_message = "The provided file contains an exceptionally high number of sampling points (npts > 200,000). It is advisable to trim the file before using it with this tool. You can conveniently perform this operation on a separate page."
            return error_message

    # if everything ok return 'ok'
    return "ok"


def get_record_name(mseed_path):
    # read it
    mseed = read(mseed_path)
    # create the record name
    first_trace = mseed[0]
    starttime = first_trace.stats["starttime"]
    station = first_trace.stats["station"]
    if not station:
        station = "STATION"
    rec_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    return rec_name


def convert_mseed_to_json(stream):
    traces_data_dict = {}
    first_trace = stream[0]
    starttime = first_trace.stats["starttime"]
    fs = float(first_trace.stats["sampling_rate"])
    station = first_trace.stats["station"]
    if not station:
        station = "STATION"
    rec_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    starttime = starttime.isoformat()

    for n, trace in enumerate(stream):
        ydata = trace.data.tolist()
        xdata = trace.times().tolist()

        trace_data = {
            "record-name": rec_name,
            "ydata": ydata,
            "xdata": xdata,
            "stats": {"channel": trace.stats["channel"]},
        }
        traces_data_dict[f"trace-{n}"] = trace_data
    return jsonify(traces_data_dict)


def generate_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    secure_password = "".join(secrets.choice(characters) for _ in range(length))
    return secure_password
