import os, shutil
from flask import current_app

data_file_folder = os.path.join(current_app.root_path, "data_files")
shutil.rmtree(data_file_folder)

try:
    os.mkdir(data_file_folder)
except:
    pass
