import sqlite3
import os

os.chdir('C:/Users/Ioannis/Desktop/projects/seismology-website/seismology-website/static/img/templates-icons')

conn = sqlite3.connect('seismo-database.sqlite')
cursor = conn.cursor()

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('Python Obspy', 
     'A Python library for seismological processing', 
     'obspy-icon.png')
     )

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('ASCII to MSEED', 
     'An interactive tool to convert ascii files to mseed', 
     'ascii-to-mseed-icon.png')
     )

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('Seismology introduction', 
     'An introduction to earthquakes', 
     'earthquake-introduction-icon.png')
     )

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('Fourier', 
     'An interactive tool to compute the Fourier Spectra', 
     'fourier-icon.png')
     )

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('Signal processing', 
     'An interactive tool to process seismic records', 
     'signal-processing-icon.png')
     )

cursor.execute("INSERT INTO templates (title, content, image_url) VALUES (?, ?, ?)",
    ('Arrivals selection', 
     'An interactive tool to select the seismic waves arrivals', 
     'wave-pick-icon.png')
     )


conn.commit()
conn.close()
