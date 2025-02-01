import UploadFileButton from "@/components/ui/UploadFileButton"
import LinkTag from "@/components/ui/LinkTag";
import { fastapiEndpoints } from "@/utils/static";
import AlertMessage from "@/components/ui/AlertMessage"

export default function StartingUploadFile({ setTraces, setBackupTraces }) {
    return (
        <>
            <h2 className="text-center text-3xl">
                <span>Upload a seismic file</span>
            </h2>
            <p className="text-center text-md font-light mt-4 mb-8">
                Don't have a seismic data file ? 
                Click <a className="link link-info" href={fastapiEndpoints['DOWNLOAD-TEST-FILE']}>here</a> to download one, to experiment 
                with the tool. 
            </p>
            <UploadFileButton 
                setTraces={setTraces} 
                setBackupTraces={setBackupTraces}
            />
            <div className="max-w-3xl mx-auto">
                <AlertMessage>
                    Refer to the <LinkTag variance="neutral" href="https://docs.obspy.org/master/packages/autogen/obspy.core.stream.read.html" external={true}>read</LinkTag> function in ObsPy's documentation to see the list of supported file types.
                </AlertMessage>
            </div>
        </>
    )
}