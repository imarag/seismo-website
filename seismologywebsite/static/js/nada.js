btCopy = document.querySelector("#copy-button");



btCopy.addEventListener('click', () => {
    alert('ok');
    navigator.clipboard.writeText(document.querySelector("#code1").value);
})

