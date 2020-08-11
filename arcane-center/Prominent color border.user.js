// ==UserScript==
// @name         Prominent color border
// @version      1.0
// @description  This script changes the card border with the prominent one from the bot image.
// @author       Cosmo
// @include      https://arcane-center.xyz*
// ==/UserScript==

const logger = {
    info: (message) => console.log(`%c${message}`, "background:#5445FF;padding:1rem;font-size:1rem;color:white;font-weight:bold;"),
    error: (message) => console.log(`%c${message}`, "background:#FF5445;padding:1rem;font-size:1rem;color:white;font-weight:bold;"),
    warn: (message) => console.log(`%c${message}`, "background:#FFFF45;padding:1rem;font-size:1rem;color:black;font-weight:bold;")
}

function injectVibrant() {
    const vibrantScript = document.createElement("script");
    vibrantScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/node-vibrant@3.2.0-alpha/dist/vibrant.min.js");
    document.head.append(vibrantScript);
    return new Promise((res, rej) => {
        vibrantScript.addEventListener("load", () => {
            logger.info("[PCB] Vibrant has been injected !");
            res();
        });
        vibrantScript.addEventListener("error", () => {
            logger.error("[PCB] Couldn't inject Vibrant !")
            rej();
        });
    });
}


function getContrast(color) {
    const [r,g,b] = color.rgb;
    return (r*0.299 + g*0.587 + b*0.114) >= 128 ? "black" : "white";
}

(async () => {
    const isInjected = await injectVibrant().then(() => true).catch(() => false);
    if (!isInjected) return logger.warn("[PCB] Cards will have the default border !");
    const cards = document.getElementsByClassName("card");
    for (const card of cards) {
        const avatar = card.querySelector(".card__image-container img");
        avatar.crossOrigin = "anonymous";
        avatar.addEventListener("load", () => {
            const vibrant = new Vibrant(avatar, {
                quality: 1
            });
            const name = card.querySelector(".card__title").textContent;
            // console.log(`Avatar from ${card.querySelector(".card__title").textContent} has been loaded !`);
            vibrant.getPalette().then(p => {
                const vibrant = p["Vibrant"];
                card.setAttribute("style", `--accent: ${vibrant.hex};--dark-accent: ${getContrast(vibrant)};`);
            });
        });
    }
})();