let homeLeftMenuInteractiveIcon = document.querySelector("#home-left-menu-interactive-icon");
let homeLeftMenuInteractiveAnchor = document.querySelector("#home-left-menu-interactive-anchor");
let homeLeftMenuStaticIcon = document.querySelector("#home-left-menu-static-icon");
let homeLeftMenuStaticAnchor = document.querySelector("#home-left-menu-static-anchor");
let homeLeftMenuLogoutIcon = document.querySelector("#home-left-menu-logout-icon");
let homeLeftMenuLogoutAnchor = document.querySelector("#home-left-menu-logout-anchor");
let homeTopMenuLogoutIcon = document.querySelector("#home-top-menu-logout-icon");
let homeTopMenuLogoutAnchor = document.querySelector("#home-top-menu-logout-anchor");



homeLeftMenuLogoutAnchor.addEventListener('mouseover', () => {
    homeLeftMenuLogoutIcon.src = "/static/img/login-images/door-closed-fill.svg";
})
homeLeftMenuLogoutAnchor.addEventListener('mouseout', () => {
    homeLeftMenuLogoutIcon.src = "/static/img/login-images/box-arrow-left.svg";
})

homeLeftMenuInteractiveAnchor.addEventListener('mouseover', () => {
    homeLeftMenuInteractiveIcon.src = "/static/img/login-images/diagram-3-fill.svg";
})
homeLeftMenuInteractiveAnchor.addEventListener('mouseout', () => {
    homeLeftMenuInteractiveIcon.src = "/static/img/login-images/diagram-3.svg";
})

homeLeftMenuStaticAnchor.addEventListener('mouseover', () => {
    homeLeftMenuStaticIcon.src = "/static/img/login-images/book-fill.svg";
})
homeLeftMenuStaticAnchor.addEventListener('mouseout', () => {
    homeLeftMenuStaticIcon.src = "/static/img/login-images/book.svg";
})


homeTopMenuLogoutAnchor.addEventListener('mouseover', () => {
    homeTopMenuLogoutIcon.src = "/static/img/login-images/door-closed-fill.svg";
})
homeTopMenuLogoutAnchor.addEventListener('mouseout', () => {
    homeTopMenuLogoutIcon.src = "/static/img/login-images/box-arrow-left.svg";
})