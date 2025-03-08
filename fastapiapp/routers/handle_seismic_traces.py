from fastapi import APIRouter, Form, UploadFile, HTTPException, File
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
from models import AddTraceParams, TraceParams, TraceStats
import numpy as np
from typing import Annotated
from internals.config import logger
from functions import convert_stream_to_traces_list
from static import SupportedUploadFileTypes

router = APIRouter(
    prefix="/handle-seismic-traces",
    tags=["handle seismic traces"],
)

def check_upload_data_params(df: pd.DataFrame, skip_rows: int, column: int):
    if df.empty:
        error_message = f"The provided file is empty"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)

    if skip_rows >= len(df):
        error_message = f"The 'skip rows' option is greater or equal to the total rows of the file!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)

    if column > len(df.columns):
        error_message = f"Invalid column number {column}. The provided column is greater than the total column of the file. Please select a valid column between 1 and {len(df.columns)}."
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)

def read_file_to_dataframe(file_suffix: str, skip_rows: int, file_bytes):
    if file_suffix == SupportedUploadFileTypes.CSV.value:
        df = pd.read_csv(file_bytes, skiprows=skip_rows)
    elif file_suffix == SupportedUploadFileTypes.TXT.value:
        df = pd.read_csv(file_bytes, sep=r"\s+", skiprows=skip_rows)
    elif file_suffix == SupportedUploadFileTypes.XLSX.value:
        df = pd.read_excel(file_bytes, skiprows=skip_rows)
    else:
        error_message = f"The file format is not supported. Supported formats are: {','.join(SupportedUploadFileTypes.list_supported_extensions())}"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    return df

    
@router.post("/add-trace")
def add_trace(
        skiprows: Annotated[int, Form()],
        column: Annotated[int, Form()],
        station: Annotated[str, Form()],
        component: Annotated[str, Form()],
        startdate: Annotated[str, Form()],
        starttime: Annotated[str, Form()],
        fs: Annotated[float, Form()],
        file: UploadFile = File()
    ):
   
    filename = file.filename
    if filename:
        file_suffix = Path(filename).suffix.lower()
    else:
        error_message = "No file has been uploaded!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    
    data_file = file.file
    
    try:
        df = read_file_to_dataframe(file_suffix, skiprows, data_file)
    except Exception as e:
        error_message = f"Cannot read the uploaded file: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)
    
    check_upload_data_params(df, skiprows, column)
    npts = len(df)
    total_duration_sec = npts / fs
    starttime_dt = datetime.fromisoformat(f"{startdate} {starttime}")
    trace_stats = TraceStats(
        starttime = starttime_dt,
        endtime = starttime_dt + timedelta(npts / fs),
        station = station,
        sampling_rate = fs,
        npts = npts,
        component = component,
    )
    trace_params = TraceParams(
        ydata = df.iloc[:, column].tolist(),
        xdata = list(np.linspace(0, total_duration_sec, npts)),
        stats = trace_stats
    )
    return trace_params