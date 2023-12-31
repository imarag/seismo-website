import os, shutil

# Get the directory of the current script
script_directory = os.path.dirname(os.path.abspath(__file__))

# Specify the relative path to the "data_files" folder
data_file_folder = os.path.join(script_directory, "data_files")

# delete the folder
shutil.rmtree(data_file_folder)

# re-make the folder
try:
    os.mkdir(data_file_folder)
except:
    pass
