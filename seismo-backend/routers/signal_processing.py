from fastapi import APIRouter
from src.functions import (
    trim_trace, taper_trace, detrend_trace, 
    filter_trace, compute_fourier_spectra, compute_hvsr_spectra
    )
from internals.models import (
    TrimParams, TaperParams, DetrendParams, 
    FilterParams, FourierParams, HVSRParams
)

router = APIRouter(
    prefix="/api/signal-processing",
    tags=["signal processing"],
)

@router.post("/trim")
async def trim(trim_params: TrimParams) -> list[dict]:
    """Endpoint to trim seismic data."""
    return trim_trace(trim_params)

@router.post("/taper")
async def taper(taper_params: TaperParams) -> list[dict]:
    """Endpoint to taper seismic data."""
    return taper_trace(taper_params)

@router.post("/detrend")
async def detrend(detrend_params: DetrendParams) -> list[dict]:
    """Endpoint to detrend seismic data."""
    return detrend_trace(detrend_params)

@router.post("/filter")
async def filter(filter_params: FilterParams) -> list[dict]:
    """Endpoint to filter seismic data."""
    return filter_trace(filter_params)

@router.post("/compute-fourier")
async def compute_fourier(fourier_params: FourierParams) -> list[dict]:
    """Endpoint to compute the fourier spectra."""
    return compute_fourier_spectra(fourier_params)

@router.post("/compute-hvsr")
async def compute_hvsr(hvsr_params: HVSRParams) -> list[float]:
    """Endpoint to compute the hvsr."""
    return compute_hvsr_spectra(hvsr_params)