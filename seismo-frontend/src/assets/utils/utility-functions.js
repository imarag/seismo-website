export function capitalizeWords(str) {
    return str.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
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