from fastapi import APIRouter, Depends, HTTPException, Response, Query, BackgroundTasks
from fastapi.responses import RedirectResponse, FileResponse
from obspy.core import read
from ..functions import extract_mseed_data, get_record_name, convert_data_to_stream, delete_file
from ..internals.config import Settings
from pydantic import Field, BaseModel

router = APIRouter(
    prefix="/arrivals",
    tags=["arrivals"],
)


class FilterParams(BaseModel):
    seismic_data: list
    freqmin: float | None = Field(default=None, gt=0.01, lt=100)
    freqmax: float | None = Field(default=None, gt=0.01, lt=100)

@router.post("/apply-filter")
def apply_filter(filter_params: FilterParams) -> list:
   
    freqmin = filter_params.freqmin
    freqmax = filter_params.freqmax
    seismic_data = filter_params.seismic_data
   
    mseed_data = convert_data_to_stream(seismic_data)
 
    if freqmin is not None and freqmax is not None and freqmax <= freqmin:
        error_message = (
            "The left filter value cannot be greater or equal to the right filter value!"
        )
        raise HTTPException(status_code=404, detail=error_message)

    try:
        # if freqmin exists and not freqmax
        if freqmin is not None and freqmax is None:
            mseed_data.filter("highpass", freq=freqmin)

        # elif freqmin does not exist but freqmax exists
        elif freqmin is None and freqmax is not None:
            mseed_data.filter("lowpass", freq=freqmax)

        # if neither freqmin nor freqmax exists, do nothing (return the initial unfiltered values)
        elif freqmin is None and freqmax is None:
            pass

        # if both are defined (freqmin and freqmax)
        else:
            mseed_data.filter("bandpass", freqmin=freqmin, freqmax=freqmax)

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=404, detail=error_message)
 
    json_data = extract_mseed_data(mseed_data)

    return json_data

@router.get("/save-arrivals")
def save_arrivals(background_tasks: BackgroundTasks, Parr: float | None = None, Sarr: float | None = None, record: str = "") -> Response:
    # check if the Parr and Sarr exist and create a dict_arrivals dict accordingly
    if Parr is None and Sarr is None:
        error_message = "You need to select at least one wave arrival to use this option!"
        raise HTTPException(status_code=404, detail=error_message)
    
    if (Parr is not None and Sarr is not None) and (Sarr <= Parr):
        error_message = "The S wave arrival cannot be less or equal to the P wave arrival!"
        raise HTTPException(status_code=404, detail=error_message)
    
    # create the dictionary to save the arrivals
    dict_arrivals = {"P": Parr, "S": Sarr}
 
    # set the arrivals and mseed file names and paths
    arrivals_file_name = Settings.ARRIVALS_FILE_NAME.value
    arrivals_file_path = Settings.TEMP_DATA_PATH.value / arrivals_file_name
  
    # write the file to the parent
    with open(arrivals_file_path, "w") as fw:
        fw.write(f"Arrivals \n")
        fw.write(f"{record} \n")
        fw.write(f"P: {dict_arrivals['P']} \n")
        fw.write(f"S: {dict_arrivals['S']} \n")

    background_tasks.add_task(delete_file, str(arrivals_file_path))

    return FileResponse(
        str(arrivals_file_path),
        media_type="text/plain",
        filename=f"arrivals.txt",
    )
