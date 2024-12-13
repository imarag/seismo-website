from PIL import Image
import glob 
import os

def resize_image(image_path, output_path, width, height):
    with Image.open(image_path) as img:
        resized_image = img.resize((width, height))
        resized_image.save(output_path)
        print(f"Resized image saved to: {output_path}")

for img in glob.glob("C:/Users/giann/Desktop/seismo-website/reactapp/src/img/template-images/*.png"):
    output_image_name = os.path.basename(img)
    output_image_folder = os.path.join(os.path.dirname(img), "resized")
    output_path = os.path.join(output_image_folder, output_image_name)
    print(output_path)
    resize_image(img, output_path, width=400, height=400)

