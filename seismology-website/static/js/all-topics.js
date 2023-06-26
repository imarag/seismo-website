let allTopicsContainer = document.querySelector('#all-topics-container');

fetch('/get-all-topics')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Could not get the topics')
        }
    })
    .then(data => {
        console.log('');
    })
    .catch(error => {
        console.error('Error:', error)
    })