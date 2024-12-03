from dataclasses import dataclass
import tempfile
import azure.functions as func

@dataclass
class TempFileHandler:
    content: str = ""
    suffix: str = ".txt"
    mode: str = "w+"

    def create_temp_file_response(self):
        # Generate a temporary file
        with tempfile.NamedTemporaryFile(mode=self.mode, delete=False, suffix=self.suffix) as tmp_file:
            # Write some data to the file
            tmp_file.write(self.content)
            tmp_file.seek(0)
            
            # Read the file's content for response
            file_content = tmp_file.read()
            
            response = func.HttpResponse(
                body=file_content,
                status_code=200,
                mimetype="text/plain",
                headers={"Content-Disposition": 'attachment; filename="arrivals.txt"'}
            )

            return response