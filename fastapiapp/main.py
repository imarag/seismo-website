from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import signal_processing, handle_seismic_traces, utilities

app = FastAPI()

# include the routers
app.include_router(signal_processing.router)
app.include_router(handle_seismic_traces.router)
app.include_router(utilities.router)


# set the cors
origins = [
    "https://seismo-website.onrender.com",
    "http://seismo-website.onrender.com",
    "https://seismo-website.vercel.app",
    "http://seismo-website.vercel.app"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

