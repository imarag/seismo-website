













# @router.post("/upload-data-file")
# async def upload_data_file(file: UploadFile):

#     # Get the file name with extension
#     filename = file.filename
    
#     if not filename:
#         raise HTTPException(status_code=404, detail="No file found!")
    
#     # Get the file extension (in lowercase)
#     file_extension = filename.split('.')[-1].lower()

#     try:
#         if file_extension == "txt":
#             data_file = await file.read()
#             # Use io.StringIO to read the file content like a file
#             with io.StringIO(data_file.decode('utf-8')) as fr:
                
#                 # Calculate the mode
#                 mode = statistics.mode([len(line.split()) for line in fr])
                
#                 # Reset the file pointer before filtering the lines
#                 fr.seek(0)
                
#                 # Filter lines that match the mean number of columns
#                 filtered_lines = [line.split() for line in fr if len(line.split()) == mode]
            
#             try:
#                 df = pd.DataFrame(filtered_lines)
                
#             except Exception as e:
#                 return HTTPException(status_code=404, detail=str(e))
#         elif file_extension == "csv":
#             data_file = file.file
#             df = pd.read_csv(data_file, on_bad_lines="skip")
#         elif file_extension == "xlsx":
#             data_file = file.file
#             df = pd.read_excel(data_file)

#     except Exception as e:
#         return HTTPException(status_code=404, detail=str(e))
    
   
#     try:
#         # transform all columns to numeric and put nan when it is not possible
#         for c in df.columns:
#             df[c] = pd.to_numeric(df[c], errors="coerce")
            
#         # drop columns that are nan in the whole column
#         df = df.dropna(axis=1, how="all")
#         df = df.dropna(axis=0, how="any")

           
#     except Exception as e:
#         return HTTPException(status_code=404, detail=str(e))

#     return [list(df[c]) for c in df.columns]
   

# @router.get("/download-test-file")
# async def download_test_file():
#     file_name = "20150724_095834_KRL1.mseed"
#     test_file_path = os.path.join(Settings.RESOURCES_PATH.value, file_name)
#     return FileResponse(
#         test_file_path,
#         filename=file_name,
#         media_type='application/octet-stream',
#         headers={"Content-Disposition": f'attachment; filename="{file_name}"'}
#     )
    

# class InputDataParams(BaseModel):
#     data: list


# @router.post("/download-seismic-file")
# async def download_seismic_file(input_data_params: InputDataParams, background_tasks: BackgroundTasks):
    
#     mseed_file_path = os.path.join(Settings.TEMP_DATA_PATH.value, "mseed-file.mseed")

#     stream = convert_traces_to_stream(input_data_params.data)

#     stream.write(mseed_file_path)

#     background_tasks.add_task(delete_file, mseed_file_path)

#     record_name = get_record_name(stream)
  
#     return FileResponse(
#         mseed_file_path,
#         filename=f"{record_name}.mseed",
#         headers={"Content-Disposition": f'attachment; filename="{record_name}.mseed"'}
#     )

# class InputSeismicParams(BaseModel):
#     data: list
#     startDate: str 
#     startTime: str 
#     station: str 
#     samplingRate: float 
#     channelCodes: dict[str, str]

# @router.post("/convert-to-mseed")
# async def convert_to_mseed(input_seismic_params: InputSeismicParams, background_tasks: BackgroundTasks):
    
#     mseed_file_path = os.path.join(Settings.TEMP_DATA_PATH.value, "mseed-file.mseed")

#     traces = []
#     for n, datacol in enumerate(input_seismic_params.data):
#         seismic_data = np.array(datacol)
#         header = {
#             "station": input_seismic_params.station,
#             "sampling_rate": input_seismic_params.samplingRate,
#             "starttime": UTCDateTime(input_seismic_params.startDate + " " + input_seismic_params.startTime),
#             "station": input_seismic_params.channelCodes[f"column-{n+1}"],
#             }
#         tr = Trace(data=seismic_data, header=header)
#         traces.append(tr)

#     stream = Stream(traces=traces)

#     stream.write(mseed_file_path)

#     background_tasks.add_task(delete_file, mseed_file_path)

#     record_name = get_record_name(stream)
  
#     return FileResponse(
#         mseed_file_path,
#         filename=f"{record_name}.mseed",
#         headers={"Content-Disposition": f'attachment; filename="{record_name}.mseed"'}
#     )


