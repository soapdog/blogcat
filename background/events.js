import { Feed } from "../common/feed.js"
import { initialize } from "../common/database.js";


initialize().then(_db => {
    browser.runtime.onMessage.addListener(messageReceived);

    function messageReceived(ev, sender, sendResponse) {
        console.log(`received ${ev.type} message.`)

        switch (ev.type) {
            case "found-feeds":
                if (sender.tab) {
                    browser.pageAction.show(sender.tab.id)
                }
                break
            case "refresh-feeds":
                Feed.refreshAll().then(promises => {
                    console.log("feed promises", promises)
                    sendResponse(Promise.allSettled(promises))
                })
                return true 
                // ^ --- needed for async sendResponse. 
                // cue https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#addListener_syntax
                break
        }
    }
})