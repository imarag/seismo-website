(()=>{

    // let imageFaultAnimation = document.querySelector('#fault-animation');
    // let imageSiteEffectAnimation = document.querySelector('#site-effect-animation');
    // let imageTectPlatesAnimation = document.querySelector('#image-id-earthquakes');

    // imageFaultAnimation.addEventListener('mouseover', ()=>{
    //     imageFaultAnimation.src = '/static/img/home-images/fault-animation.gif';
    // });
    // imageFaultAnimation.addEventListener('mouseleave', ()=>{
    //     imageFaultAnimation.src = '/static/img/home-images/fault-animation-start.jpg';
    // });

    // imageSiteEffectAnimation.addEventListener('mouseover', ()=>{
    //     imageSiteEffectAnimation.src = '/static/img/home-images/site-effect-animation.gif';
    // });
    // imageSiteEffectAnimation.addEventListener('mouseleave', ()=>{
    //     imageSiteEffectAnimation.src = '/static/img/home-images/site-effect-animation-start.jpg';
    // });

    // imageTectPlatesAnimation.addEventListener('mouseover', ()=>{
    //     imageTectPlatesAnimation.src = '/static/img/home-images/tectonic-plates-earthquakes.gif';
    // });
    // imageTectPlatesAnimation.addEventListener('mouseleave', ()=>{
    //     imageTectPlatesAnimation.src = '/static/img/home-images/tectonic-plates-earthquakes-start.gif';
    // });



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
