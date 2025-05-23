import axios from "axios";

export async function apiRequest({
    url,
    method = "get",
    requestData = {},
    responseType = "json",
    setShowMessage = () => { },
    setLoading = () => { },
    successMessage = "",
    errorMessage = null
}) {
    try {
        setLoading(true)
        const response = await axios({
            url,
            method,
            data: requestData,
            responseType,
            headers: {
                "Content-Type": requestData instanceof FormData
                    ? "multipart/form-data"
                    : "application/json",
            },
        });

        if (successMessage) {
            setShowMessage({
                type: "success",
                message: successMessage
            })
        }

        return { resData: response.data, error: null };
    } catch (error) {
        let globalErrorMessage;

        if (
            error?.response?.data instanceof Blob
        ) {
            try {
                const errorText = await error.response.data.text();
                const errorJson = JSON.parse(errorText);
                globalErrorMessage =
                    errorJson?.error_message ||
                    errorJson?.detail ||
                    errorMessage ||
                    errorJson?.message ||
                    "An unexpected error occurred. Please try again later.";

            } catch (parseError) {
                console.error("Failed to parse blob error JSON:", parseError);
            }
        } else {
            globalErrorMessage =
                error?.response?.data?.error_message ||
                error?.response?.data?.detail ||
                errorMessage ||
                error?.message ||
                "An unexpected error occurred. Please try again later.";
        }

        setShowMessage({
            type: "error",
            message: globalErrorMessage
        });

        return { resData: null, error: globalErrorMessage };
    }
    finally {
        setLoading(false);
    }
}
