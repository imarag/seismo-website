from fastapi import APIRouter


router = APIRouter(
    prefix="/static-data",
    tags=["static-data"],
)

@router.get("/get-taper-type-options")
def get_taper_type_options():
    return [
        { "value": "cosine", "label": "Cosine taper" },
        { "value": "barthann", "label": "Bartlett-Hann" },
        { "value": "bartlett", "label": "Bartlett" },
        { "value": "blackman", "label": "Blackman" },
        { "value": "blackmanharris", "label": "Blackman-Harris" },
        { "value": "bohman", "label": "Bohman" },
        { "value": "boxcar", "label": "Boxcar" },
        { "value": "chebwin", "label": "Dolph-Chebyshev" },
        { "value": "flattop", "label": "Flat top" },
        { "value": "gaussian", "label": "Gaussian std" },
        { "value": "general_gaussian", "label": "Gen. Gaussian" },
        { "value": "hamming", "label": "Hamming" },
        { "value": "hann", "label": "Hann" },
        { "value": "kaiser", "label": "Kaiser" },
        { "value": "nuttall", "label": "Nuttall" },
        { "value": "parzen", "label": "Parzen" },
        { "value": "slepian", "label": "Slepian" },
        { "value": "triang", "label": "Triangular" },
    ]


@router.get("/get-taper-side-options")
def get_taper_side_options():
    return [
        { "value": "left", "label": "left" },
        { "value": "right", "label": "right" },
        { "value": "both", "label": "both" },
    ]

@router.get("/get-detrend-type-options")
def get_detrend_type_options():
    return [
        { "value": "linear", "label": "linear" },
        { "value": "constant", "label": "constant" },
        { "value": "simple", "label": "simple" },
    ]

@router.get("/get-filter-options")
def get_filter_options():
    return [
        { "label": "initial", "value": "initial" },
        { "label": "1-2", "value": "1-2" },
        { "label": "1-3", "value": "1-3" },
        { "label": "1-5", "value": "1-5" },
        { "label": "1-10", "value": "1-10" },
        { "label": "0.1-10", "value": "0.1-10" }
    ]