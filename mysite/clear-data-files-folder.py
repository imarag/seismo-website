import os, shutil

data_file_folder = "data_files"
shutil.rmtree(data_file_folder)

try:
    os.mkdir(data_file_folder)
except:
    pass
