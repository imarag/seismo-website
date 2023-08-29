let imageFaultAnimation = document.querySelector('#fault-animation');
let imageSiteEffectAnimation = document.querySelector('#site-effect-animation');
let imageTectPlatesAnimation = document.querySelector('#image-id-earthquakes');

imageFaultAnimation.addEventListener('mouseover', ()=>{
    imageFaultAnimation.src = '/static/img/home-images/fault-animation.gif';
});
imageFaultAnimation.addEventListener('mouseleave', ()=>{
    imageFaultAnimation.src = '/static/img/home-images/fault-animation-start.jpg';
});

imageSiteEffectAnimation.addEventListener('mouseover', ()=>{
    imageSiteEffectAnimation.src = '/static/img/home-images/site-effect-animation.gif';
});
imageSiteEffectAnimation.addEventListener('mouseleave', ()=>{
    imageSiteEffectAnimation.src = '/static/img/home-images/site-effect-animation-start.jpg';
});

imageTectPlatesAnimation.addEventListener('mouseover', ()=>{
    imageTectPlatesAnimation.src = '/static/img/home-images/tectonic-plates-earthquakes.gif';
});
imageTectPlatesAnimation.addEventListener('mouseleave', ()=>{
    imageTectPlatesAnimation.src = '/static/img/home-images/tectonic-plates-earthquakes-start.gif';
});



let imageHover = document.querySelector('#image-hover');
let trimHoverLi =  document.querySelector('#trim-hover-li');
let taperHoverLi =  document.querySelector('#taper-hover-li');
let detrendHoverLi =  document.querySelector('#detrend-hover-li');
let fourierHoverLi =  document.querySelector('#fourier-hover-li');
let PickHoverLi =  document.querySelector('#pick-hover-li');

trimHoverLi.addEventListener('mouseover', () => {
    imageHover.src = "/static/img/home-images/trim-gif.gif";
})
taperHoverLi.addEventListener('mouseover', () => {
    imageHover.src = "/static/img/home-images/taper-gif.gif";
})
detrendHoverLi.addEventListener('mouseover', () => {
    imageHover.src = "/static/img/home-images/detrend-gif.gif";
})
fourierHoverLi.addEventListener('mouseover', () => {
    imageHover.src = "/static/img/home-images/fourier-gif.gif";
})
PickHoverLi.addEventListener('mouseover', () => {
    imageHover.src = "/static/img/home-images/pick-gif.gif";
})





// let intervalID;
// let counter = 1;
// let imageEarthquakes = document.querySelector('#image-id-earthquakes');
// imageEarthquakes.addEventListener('mouseover', ()=>{startIntervalFunc()});
// imageEarthquakes.addEventListener('mouseleave', endIntervalFunc);

// function startIntervalFunc(sourceTitle){
//     counter = 1;
//     imageEarthquakes.src = '/static/img/home-images/earthquakes/earthquakes1.png';
//     intervalID = setInterval(()=>{change_picture_func(9)}, 200);
// }

// function endIntervalFunc()
// {
//     clearInterval(intervalID);
// }

// function change_picture_func(totalPictures)
// {
//     if (counter > totalPictures){
//         counter = 1;
//     }

//     let imagePath = `/static/img/home-images/earthquakes/earthquakes${counter}.png`;
//     imageEarthquakes.src = imagePath;
//     counter++;
// }


