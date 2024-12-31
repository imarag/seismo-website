import { AlertInfo } from "@/components/Alert"
import UploadFileButton from "@/components/UploadFileButton"

export default function StartingUploadFile({ setTraces, setError, setLoading }) {
    return (
        <>
            <p className="text-center mb-6 text-xl">
                Start by uploading a seismic file
            </p>
            <UploadFileButton 
                setTraces={setTraces} 
                setLoading={setLoading} 
                buttonClass="block mx-auto" 
                setError={setError}
                />
            <AlertInfo>
                <p>
                    There are a number of seismic file formats supported which are defined in the
                    Python Obspy <a href="https://docs.obspy.org/master/packages/autogen/obspy.core.stream.read.html" target="_blank" className="link link-primary"><code>read()</code></a> function
                </p>
            </AlertInfo>
        </>
    )
}