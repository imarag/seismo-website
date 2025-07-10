import re
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, Request, UploadFile

from internals.config import Settings
from internals.models import TraceParams
from internals.static import SupportedUploadFileTypes
from src.functions import convert_dict_to_trace, convert_trace_to_dict
from src.utils import RequestHandler

router = APIRouter()

settings = Settings()
logger = settings.logger


def validate_seismic_parameters(component: str):
    if not re.fullmatch(r"^[a-zA-Z0-9]{1}$", component):
        RequestHandler.send_error(
            "Invalid component value. It must be a single alphanumeric character.",
            status_code=404,
        )


def validate_input_file_params(df: pd.DataFrame, skip_rows: int, column_index: int):
    if df.empty:
        error_message = "The provided file is empty or you have skipped too many rows!"
        RequestHandler.send_error(error_message, status_code=404)

    if skip_rows >= len(df):
        error_message = (
            "The 'skip rows' option is greater or equal to the total rows of the file!"
        )
        RequestHandler.send_error(error_message, status_code=404)

    if column_index > len(df.columns) or column_index == 0:
        error_message = f"Invalid column number {column_index}. Please select a valid column between 1 and {len(df.columns)}."
        RequestHandler.send_error(error_message, status_code=404)


def file_to_pandas_dataframe(upload_file, skip_rows: int) -> pd.DataFrame:
    spooled_file = upload_file.file
    file_name = upload_file.filename
    file_suffix = Path(file_name).suffix.lower().strip(".")

    if file_suffix == SupportedUploadFileTypes.CSV.value:
        df = pd.read_csv(spooled_file, skiprows=skip_rows)
    elif file_suffix == SupportedUploadFileTypes.TXT.value:
        df = pd.read_csv(spooled_file, sep=r"\s+", skiprows=skip_rows)
    elif file_suffix == SupportedUploadFileTypes.XLSX.value:
        df = pd.read_excel(spooled_file, skiprows=skip_rows)
    else:
        RequestHandler.send_error("Unsupported file format", 400)

    return df


# @router.post("/add-trace")
# def add_trace(
#     skip_rows: Annotated[int, Form()],
#     column_index: Annotated[int, Form()],
#     station: Annotated[str, Form()],
#     component: Annotated[str, Form()],
#     start_date: Annotated[datetime.date, Form()],
#     start_time: Annotated[datetime.time, Form()],
#     sampling_rate: Annotated[float, Form()],
#     file: UploadFile,
# ):

#     logger.info("Reading input file into pandas dataframe")
#     try:
#         df = file_to_pandas_dataframe(file, skip_rows)
#     except Exception as e:
#         RequestHandler.send_error(f"Cannot read the file: {str(e)}", 500)

#     logger.info("Validating input file params")
#     validate_input_file_params(df, skip_rows, column_index)

#     logger.info("Validating input file params")
#     validate_seismic_parameters(component)

#     logger.info("Getting the index column of the dataframe")
#     ser = df.iloc[:, column_index - 1].replace(np.nan, None)
#     ser_list = ser.tolist()

#     logger.info("Transforming into a trace params model")
#     npts = len(df)
#     total_duration_sec = npts / sampling_rate

#     trace_stats = TraceStats(
#         start_date=start_date,
#         start_time=start_time,
#         station=station,
#         sampling_rate=sampling_rate,
#         npts=npts,
#         component=component,
#     )
#     trace_params = TraceParams(
#         ydata=ser_list,
#         xdata=list(np.linspace(0, total_duration_sec, npts)),
#         stats=trace_stats,
#     )

#     logger.info("Create a stream object with a single trace to validate the input data")
#     # Convert the data to a stream object with a single trace to validate the data
#     # if this runs ok then the trace data are ok
#     try:
#         Stream(traces=[Trace(data=ser.to_numpy(), header=trace_stats.model_dump())])
#     except Exception as e:
#         RequestHandler.send_error(f"Cannot read the file: {str(e)}", 500)

#     return trace_params


@router.post("/update-trace")
async def update_trace(request: Request):
    trace_dict = await request.json()
    trace_object = convert_dict_to_trace(trace_dict)
    return convert_trace_to_dict(trace_object)


@router.get("/get-default-trace")
async def get_default_trace():
    return TraceParams()


@router.post("/upload-trace-data-samples")
async def upload_trace_data_samples(file: UploadFile):
    """Uploads a csv/excel file and returns a list of data samples numbers."""
    logger.info("Reading the input csv or excel file")

    spooled_file = file.file
    if file.filename:
        file_name = Path(file.filename)
        file_suffix = file_name.suffix.lower()
    else:
        RequestHandler.send_error("Cannot upload the file", 500)

    try:
        if file_suffix == SupportedUploadFileTypes.CSV.value:
            df = pd.read_csv(spooled_file)
        elif file_suffix == SupportedUploadFileTypes.XLSX.value:
            df = pd.read_excel(spooled_file)
        else:
            RequestHandler.send_error("Unsupported file format", 400)
    except Exception as e:
        RequestHandler.send_error(f"Cannot read the file: {str(e)}", 500)

    if df.empty or len(df.columns) < 1:
        RequestHandler.send_error("The input file is empty or invalid.", 400)

    if df.iloc[:, 0].dropna().empty:
        RequestHandler.send_error(
            "No valid numeric data found in the first column.", 400
        )

    first_column = df.iloc[:, 0]
    first_column_edited = (
        pd.to_numeric(first_column, errors="coerce").fillna(0).to_list()
    )

    return first_column_edited
