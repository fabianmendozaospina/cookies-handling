'use strict';

import { select, getElement, listen } from "./utils.js";

const TOTAL_SECONDS = 15;
const modal = select('.modal');
const agreements = select('.agreements');
const accept = select('.accept');

function openModal(modalName) {
    modal.style.display = 'block';
    agreements.style.display = 'block';
    document.body.classList.add(modalName);
}

function acceptCookie() {
    const browser = getBrowserName();
    const system = navigator.platform;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    setCookie('Browser', browser);
    setCookie('System', system);
    setCookie('Screen Width', screenWidth);
    setCookie('Screen Height', screenHeight);

    console.log('Cookies saved sucessfully');
}

function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edg")) return "Microsoft Edge";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";

    return "Browser name not found";
}

function setCookie(key, value) {
    const expiration = `max-age=${TOTAL_SECONDS}`;
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; ${expiration}; path=/; SameSite=Lax`;
}

function getCookie() {
    const { cookie } = document;
    let arrayCookie = cookie.split(';');
    
    for(let data of arrayCookie) {
        let arrayData = data.split('=');
        console.log(`${decodeURIComponent(arrayData[0]).trim()}: ${decodeURIComponent(arrayData[1])}`);
    }
}

listen('load', window, () => {
    const hasCookie = document.cookie.length > 0;

    if (hasCookie) {
        getCookie();
        return;
    }

    openModal('open-agreements');
});

listen('click', accept, () => {
    acceptCookie();
});
