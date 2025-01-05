from nbconvert import MarkdownExporter
from nbconvert.preprocessors import ExecutePreprocessor
import os
import nbformat
from traitlets.config import Config
from PIL import Image
import io
import glob
import shutil

# in this function i replace whatever i want before it creates the markdown
def replace_markdown_data(mark_data, markdown_name):
    return mark_data.replace("[png](", f"[png](/{markdown_name}/")

# set the folder path that contains all the ipynb notebooks to be converted
notebooks_path = "notebooks"

converted_markdowns_folder_name = "converted_markdowns"
converted_figures_folder_name = "converted_figures"

# create two folders to save th converted markdowns and the converted figures
if os.path.exists(converted_markdowns_folder_name):
    shutil.rmtree(converted_markdowns_folder_name)

if os.path.exists(converted_figures_folder_name):
    shutil.rmtree(converted_figures_folder_name)
    
os.mkdir(converted_figures_folder_name)
os.mkdir(converted_markdowns_folder_name)


if not os.path.exists(notebooks_path):
    print("The notebooks path does not exist!")
    raise 

all_notebooks = list(glob.glob(f"{notebooks_path}/*.ipynb"))

if not all_notebooks:
    print(f"There are no notebooks in the notebooks path: {notebooks_path}")
    raise 

# create a configuration object that changes the preprocessors
c = Config()
c.MarkdownExporter.preprocessors = ["nbconvert.preprocessors.ConvertFiguresPreprocessor"]

for notebook_path in all_notebooks:
    print(f"processing notebook: {notebook_path}")

    # get the notebook file name and the output markdown file name
    notebook_filename = os.path.basename(notebook_path)
    output_filename = notebook_filename.replace(".ipynb", ".md")
    images_folder_path = notebook_filename.split(".")[0]

    if not os.path.exists(os.path.join(converted_figures_folder_name, images_folder_path)):
        os.mkdir(os.path.join(converted_figures_folder_name, images_folder_path))

    # Read the notebook
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook_content = nbformat.read(f, as_version=4)

    # Create a Markdown exporter using the custom config
    markdown_exporter = MarkdownExporter(config=c)

    # Now export to Markdown
    markdown_data, resources_with_fig = markdown_exporter.from_notebook_node(notebook_content)

    # get a list of the names of the images used
    images_list_labels = resources_with_fig["outputs"].keys()

    print("Contained images:")
    # loop at the figs list and save the images
    for img_label in images_list_labels:
        print(img_label)
        image_binary = io.BytesIO(resources_with_fig["outputs"][img_label])
        img = Image.open(image_binary)
        img.save(os.path.join(converted_figures_folder_name, images_folder_path, img_label))

    # Save the Markdown output to a file
    with open(os.path.join(converted_markdowns_folder_name, output_filename), 'w', encoding='utf-8') as f:
        converted_markdown_data = replace_markdown_data(markdown_data, images_folder_path)
        f.write(converted_markdown_data)

    print(f'Notebook converted')
    print()
