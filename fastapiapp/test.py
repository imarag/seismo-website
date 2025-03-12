from internals.config import Settings
from obspy.core import Trace, Stream
import numpy as np

settings = Settings()
mseed_path = settings.sample_mseed_file_path

tr = Trace(
    data=np.random.randint(1, 100, 1000), 
    header={"sampling_rate": -0.34534}
    )

print(tr.stats)