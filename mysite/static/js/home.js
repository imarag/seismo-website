(()=>{

    let imageHover = document.querySelector('#image-hover');
    let trimHoverLi =  document.querySelector('#trim-hover-li');
    let taperHoverLi =  document.querySelector('#taper-hover-li');
    let detrendHoverLi =  document.querySelector('#detrend-hover-li');
    let fourierHoverLi =  document.querySelector('#fourier-hover-li');
    let PickHoverLi =  document.querySelector('#pick-hover-li');

    trimHoverLi.addEventListener('mouseover', () => {
        imageHover.src = "/static/img/trim-gif.gif";
    })
    taperHoverLi.addEventListener('mouseover', () => {
        imageHover.src = "/static/img/taper-gif.gif";
    })
    detrendHoverLi.addEventListener('mouseover', () => {
        imageHover.src = "/static/img/detrend-gif.gif";
    })
    fourierHoverLi.addEventListener('mouseover', () => {
        imageHover.src = "/static/img/fourier-gif.gif";
    })
    PickHoverLi.addEventListener('mouseover', () => {
        imageHover.src = "/static/img/pick-gif.gif";
    })

    
})();
