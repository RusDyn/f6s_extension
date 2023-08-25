import type { PlasmoCSConfig } from "plasmo"
import { handleApplyPage } from "./handlers";


// create mutation oberver to detect new nodes
// add custom button
function createObserver() {

    let callback: () => void = undefined;
    const host = window.location.host;
    const href = window.location.href;

    console.log(`createObserver for ${host}`)
    console.log(window.location.pathname)

    if (host === "www.f6s.com") {

        if (window.location.pathname.endsWith("/apply")) {
            callback = handleApplyPage;
        }

        if (callback) {
            var obs = new MutationObserver(function (mutations, me) {
                callback();
            })
            callback();
            return obs
        }
        else {
            console.log(`No callback for host ${host}`)
        }
    }
}
export const config: PlasmoCSConfig = {
    matches: ["https://www.f6s.com/*"],
}

var observerConfig = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
};


window.addEventListener("load", () => {
    const obs = createObserver();
    if (obs) {
        obs.observe(window.document.body, observerConfig);
    }
})


const CustomContent = () => {
    return <></>


}

export default CustomContent