
let intervalID;
let counter = 1;
// let imageElastiRebound = document.querySelector('#image-id-elastic-rebound');
// let imageSiteEffect = document.querySelector('#image-id-site-effect');
let imageEarthquakes = document.querySelector('#image-id-earthquakes');
// imageElastiRebound.addEventListener('mouseover', ()=>{startIntervalFunc('elastic-rebound')});
// imageElastiRebound.addEventListener('mouseleave', endIntervalFunc);
// imageSiteEffect.addEventListener('mouseover', ()=>{startIntervalFunc('site-effect')});
// imageSiteEffect.addEventListener('mouseleave', endIntervalFunc);
imageEarthquakes.addEventListener('mouseover', ()=>{startIntervalFunc('earthquakes')});
imageEarthquakes.addEventListener('mouseleave', endIntervalFunc);

function startIntervalFunc(sourceTitle) 
{
    counter = 1;
    if (sourceTitle === 'elastic-rebound')
    {
    imageElastiRebound.src = '/static/img/home-images/elastic-rebound/elastic-reb1.png';
    intervalID = setInterval(()=>{change_picture_func(sourceTitle, 10)}, 150);
    }
    else if (sourceTitle === 'site-effect')
    {
    imageSiteEffect.src = '/static/img/home-images/site-effect/site-effect-anim1.png';
    intervalID = setInterval(()=>{change_picture_func(sourceTitle, 18)}, 150);
    }
    else if (sourceTitle === 'earthquakes')
    {
    imageEarthquakes.src = '/static/img/home-images/earthquakes/earthquakes1.png';
    intervalID = setInterval(()=>{change_picture_func(sourceTitle, 9)}, 200);
    }
    
}

function endIntervalFunc()
{
    clearInterval(intervalID);
}

function change_picture_func(sourceTitle, totalPictures)
{
    if (counter > totalPictures)
    {
    counter = 1;
    }

    if (sourceTitle === 'elastic-rebound')
    {
    let imagePath = `/static/img/home-images/elastic-rebound/elastic-reb${counter}.png`;
    imageElastiRebound.src = imagePath;
    }
    else if (sourceTitle === 'site-effect')
    {
    let imagePath = `/static/img/home-images/site-effect/site-effect-anim${counter}.png`;
    imageSiteEffect.src = imagePath;
    }
    else if (sourceTitle === 'earthquakes')
    {
    let imagePath = `/static/img/home-images/earthquakes/earthquakes${counter}.png`;
    imageEarthquakes.src = imagePath;
    }
    
    counter++;
}





let intervalIDAnim;
let imageFaultAnimation = document.querySelector('#fault-animation');
let imageSiteEffectAnimation = document.querySelector('#site-effect-animation');

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


function reveal() {

    var revealsRight = document.querySelectorAll(".reveal-r");
    var revealsLeft = document.querySelectorAll(".reveal-l");
    var windowHeight = window.innerHeight;
    for (var i = 0; i < revealsLeft.length; i++) {
        
        var elementTop = revealsLeft[i].getBoundingClientRect().top;
        var elementVisible = 500;

        if (elementTop < windowHeight - elementVisible) {
            
        revealsLeft[i].classList.add("active");
        } else {
        
        revealsLeft[i].classList.remove("active");
        }
    }

    for (var i = 0; i < revealsRight.length; i++) {
        
    var elementTop = revealsRight[i].getBoundingClientRect().top;
    var elementVisible = 500;

    if (elementTop < windowHeight - elementVisible) {
        
        revealsRight[i].classList.add("active");
    } else {
        
        revealsRight[i].classList.remove("active");
    }
}
}

window.addEventListener("scroll", reveal);

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



    