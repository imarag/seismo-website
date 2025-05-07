

    
   






# @router.post("/compute-fourier")
# def compute_fourier2(fourier_params_body: FourierParams) -> dict[str, dict]:

#     mseed_data = convert_traces_to_stream(fourier_params_body.traces)
#     # initialize the output data dict
#     data_dict_output = {}
   

#     # get the first trace
#     first_trace = mseed_data.traces[0]

#     # get some information of the stream object
#     starttime = first_trace.stats.starttime

#     # i will save here the traces
#     fourier_data_dict = {}
   
#     # loop through the uploaded traces
#     for i in range(len(mseed_data)):
#         # get the trace name and add it to the fourier_data_dict
#         trace_label = f"trace-{i}"
#         fourier_data_dict[trace_label] = {"signal": None, "noise": None}

#         # get a copy of the trace for the singal
#         trace_signal = mseed_data.traces[i].copy()

#         # get the current trace channel
#         channel = trace_signal.stats.channel

#         try:
#             # trim the waveform between the user selectd window
#             signal_trace_trimmed = trim_trace(
#                 trace_signal, 
#                 starttime + fourier_params_body.signal_window_left_side,
#                 starttime + fourier_params_body.signal_window_left_side + fourier_params_body.window_length
#             )
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         try:
#             # compute the fourier
#             fft_freq, fft_signal_data = compute_fourier_spectra(signal_trace_trimmed)
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         # create a dictionary for the signal
#         fourier_data_dict[trace_label]["signal"] = {
#             "xdata": fft_freq.tolist(),
#             "ydata": fft_signal_data.tolist(),
#             "channel": channel,
#         }

#         # if the user also added the noise
#         if fourier_params_body.noise_window_right_side is not None:
#             # get a copy of the trace for the noise
#             noise_signal = mseed_data.traces[i].copy()

#             try:
#                 # trim the waveform between the user selectd window
#                 noise_trace_trimmed = trim_trace(
#                     noise_signal, 
#                     starttime + fourier_params_body.noise_window_right_side - fourier_params_body.window_length,
#                     starttime + fourier_params_body.noise_window_right_side
#                 )
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)

#             try:
#                 # compute the fourier
#                 fft_freq, fft_noise_data = compute_fourier_spectra(noise_trace_trimmed)
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)
    
#             fourier_data_dict[trace_label]["noise"] = {
#                 "xdata": fft_freq.tolist(),
#                 "ydata": fft_noise_data.tolist(),
#                 "channel": channel,
#             }

#     data_dict_output["fourier"] = fourier_data_dict

    
#     # just initialize the horizontal and vertical parameters
#     horizontal_traces = []
#     vertical_traces = None

#     # loop through the mseed data
#     for trace_label in fourier_data_dict:
#         # get the channel
#         channel = fourier_data_dict[trace_label]["signal"]["channel"]

#         # get the signal and noise dict
#         signal_dict = fourier_data_dict[trace_label]["signal"]
#         noise_dict = fourier_data_dict[trace_label]["noise"]

#         # if you find the vertical component (the one that the user specified) then set the data to the vertical_traces parameter
#         if channel == fourier_params_body.vertical_component:
#             vertical_traces = np.array(noise_dict["ydata"])
#         else:
#             horizontal_traces.append(np.array(signal_dict["ydata"]))

#         hvsr_freq = signal_dict["xdata"]
#     # calculate the average horizontal fourier and the hvsr depending on if we have one or two horizontals
#     if len(horizontal_traces) == 1:
#         horizontal_fourier = horizontal_traces[0]
#         hvsr = horizontal_fourier / vertical_traces
#     else:
#         mean_horizontal_fourier = np.sqrt(
#             (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
#         )
#         hvsr = mean_horizontal_fourier / vertical_traces

#     # create a dictionary to save the hvsr data
#     hvsr_data_dict = {"xdata": list(hvsr_freq), "ydata": list(hvsr)}

#     data_dict_output["hvsr"] = hvsr_data_dict

#     return data_dict_output

















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


