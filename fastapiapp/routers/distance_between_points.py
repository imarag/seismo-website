from fastapi import APIRouter, Query, HTTPException
from typing import Annotated
from obspy.geodetics import gps2dist_azimuth

router = APIRouter(
    prefix="/distance-between-points",
    tags=["distance-between-points"],
)


@router.get("/calculate-distance")
def calculate_distance(
    lat1: Annotated[float | int, Query(gt=-90, lt=90)],
    lon1: Annotated[float | int, Query(gt=-180, lt=180)],
    lat2: Annotated[float | int, Query(gt=-90, lt=90)],
    lon2: Annotated[float | int, Query(gt=-180, lt=180)]
    ) -> dict:

    try:
        # calculate the distance
        result = gps2dist_azimuth(lat1, lon1, lat2, lon2)[0] / 1000
        # round the result
        result = round(result, 3)
    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail=error_message)
    
    return {"result": result}
