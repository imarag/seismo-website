import matplotlib.pyplot as plt
# Initialize a matplotlib figure and axes with the total            
# number of plots equal to the number of traces len(st)
fig, ax = plt.subplots(len(st), 1)
# Loop through all the traces in the stream object (st)
for n, tr in enumerate(st):
# get the time information of the current trace           
xdata = tr.times()            
# get the data of the current trace            
ydata = tr.data              
# plot the graph with legend, the trace channel              
ax[n].plot(xdata, ydata, label=tr.stats.channel)     
# add the legend on the plot
ax[n].legend()            
# adjust the subplots so they do not overlap             
plt.tight_layout()     