'use strict';

import { select, listen } from "./utils.js";

const TOTAL_SECONDS_REGULAR_COOKIES = 15;
const TOTAL_SECONDS_REJECTED_COOKIE = 20;
const REJECTED_COOKIE_NAME = 'rejectedCookies';
const REJECTED_VALUE = 'rejected';
const message = select('.message');
const modal = select('.modal');
const agreements = select('.agreements');
const settings = select('.settings');
const accept = select('.accept');
const setSettings = select('.set-settings');
const saveSettings = select('.save-settings');
const browserSwitch = select('.browser-switch');
const osSwitch = select('.os-switch');
const screenWidthSwitch = select('.screen-width-switch');
const screenHeigthSwitch = select('.screen-heigth-switch');

message.classList.remove('cookie-def');
message.classList.add('cookie-def-blur');  

listen('load', window, () => {
    const hasCookie = document.cookie.length > 0;

    if (hasCookie) { 
        message.classList.remove('cookie-def-blur');
        message.classList.add('cookie-def');           
        getCookie();
        return;
    }   

    if (!areCookiesRejected()) {   
        setTimeout(() => {     
            openModal('agreements');
        }, 800);
    }
});

listen('click', accept, () => {
    acceptCookies();
});

listen('click', setSettings, () => {
    openModal('settings');
});

listen('click', saveSettings, () => {
    savePreferences();
});

function openModal(modalName) {
    modal.style.display = 'block';

    if (modalName === 'agreements') {
        settings.style.display = 'none';
        agreements.style.display = 'block';
    }

    if (modalName === 'settings') {
        agreements.style.display = 'none';
        settings.style.display = 'block';
    }

    document.body.classList.add('open');
}

function closeModal() {
    modal.style.display = 'none';

    document.body.classList.remove('open');
}

function acceptCookies() {
    const browser = getBrowserName();
    const system = getOperativeSystem();
    const screenWidth = getScreenWidth();
    const screenHeight = getScreenHeigth();
    const rejectedCookies = browser === REJECTED_VALUE && system === REJECTED_VALUE && 
                            screenWidth === REJECTED_VALUE && screenHeight === REJECTED_VALUE;

    setCookie('Browser', browser);
    setCookie('System', system);
    setCookie('Screen Width', screenWidth);
    setCookie('Screen Height', screenHeight);
    
    console.log('Cookies saved sucessfully');
    message.classList.remove('cookie-def-blur');
    message.classList.add('cookie-def');   
    closeModal();

    return !rejectedCookies;
}

function getBrowserName() {
    if (!browserSwitch.checked) {
        return "rejected";
    }

    const userAgent = navigator.userAgent;

    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edg")) return "Microsoft Edge";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";

    return "Browser name not found";
}

function getOperativeSystem() {
    if (!osSwitch.checked) {
        return "rejected";
    }

    return navigator.platform;
}

function getScreenWidth() {
    if (!screenWidthSwitch.checked) {
        return "rejected";
    }

    return window.innerWidth;
}

function getScreenHeigth() {
    if (!screenHeigthSwitch.checked) {
        return "rejected";
    }

    return window.innerHeight;
}

function setCookie(key, value, maxAge = TOTAL_SECONDS_REGULAR_COOKIES) {
    const expiration = `max-age=${maxAge}`;
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

function savePreferences() {
    if (!acceptCookies()) {
        setCookie(REJECTED_COOKIE_NAME, 'true', TOTAL_SECONDS_REJECTED_COOKIE);
    }
}

function areCookiesRejected() {
    const { cookie } = document;
    const arrayCookie = cookie.split(";")

    if (arrayCookie.includes(`${REJECTED_COOKIE_NAME}=true`)) {
        return true;
    }

    return false;
}