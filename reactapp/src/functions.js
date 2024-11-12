async function uploadSeismicFile({endpoint}) {

    try {
        const res = await fetch(endpoint, { credentials: "include" });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error_message || errorMessage);
        }

        setInfoMessage(successMessage);
        setTimeout(() => setInfoMessage(null), 5000);

    } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message || errorMessage);
        setTimeout(() => setErrorMessage(null), 5000);
    } finally {
        setLoading(false);
    }
}
