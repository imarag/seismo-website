from obspy.core import read 


st = read(r"C:\Users\giann\Downloads\5c795995-e6ad-482c-a7e5-78558af740a5.mseed")
tr = st[0]
tr.stats.station = ""
print(tr.stats)
print(tr.get_id())