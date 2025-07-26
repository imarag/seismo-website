export function capitalizeWords(str) {
    return str.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export function getEarthquakeSignature(eq) {
    const lat = eq.geometry?.coordinates?.[1];
    const lon = eq.geometry?.coordinates?.[0];
    const mag = eq.properties?.mag;
    const time = eq.properties?.time;

    if (lat == null || lon == null || mag == null || time == null) return null;

    const roundedLat = Math.round(lat * 100) / 100;     // 2 decimals
    const roundedLon = Math.round(lon * 100) / 100;     // 2 decimals
    const roundedMag = Math.round(mag * 10) / 10;       // 1 decimal
    const timeSec = Math.floor(new Date(time).getTime() / 1000); // epoch seconds
    const timeBin = Math.round(timeSec / 10);           // ±10 sec window

    return `${roundedLat}_${roundedLon}_${roundedMag}_${timeBin}`;
}

export function trimWithDots(text, maxLength = 10) {
    if (typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

export function parseNumber(val, decimals = 3) {
    const num = parseFloat(val);
    return isNaN(num) ? "N/A" : num.toFixed(decimals);
};

export function parseDate(value, returnType = "iso") {
    if (!value) return null;

    let date;

    try {
        if (value instanceof Date) {
            date = value;
        } else if (typeof value === "string" || typeof value === "number") {
            date = new Date(value);
        } else {
            return null;
        }

        if (isNaN(date.getTime())) {
            return null; // Invalid date
        }

        switch (returnType) {
            case "iso":
                return date.toISOString(); // Always in UTC
            case "epoch":
                return date.getTime(); // Milliseconds since 1970-01-01
            default:
                throw new Error(`Unsupported returnType: ${returnType}`);
        }
    } catch {
        return null;
    }
}


export function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}


export function getRandomNumber(num = 6) {
    let randomId = "";
    for (let i = 0; i < num; i++) {
        let randomNumber = Math.round(Math.random() * 10, 1);
        randomId += randomNumber
    }
    return randomId
}

export function getUniqueItems(list) {
    const uniqueList = [...new Set(list)];
    return uniqueList
} 
