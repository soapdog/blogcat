import { Feed } from "../common/feed.js"
import { initialize } from "../common/database.js";


initialize().then(_db => {
    browser.runtime.onMessage.addListener(messageReceived);

    function messageReceived(ev, sender, sendResponse) {
        switch (ev.type) {
            case "found-feeds":
                if (sender.tab) {
                    browser.pageAction.show(sender.tab.id)
                }
                break
            case "refresh-feeds":
                Feed.refreshAll().then(promises => {
                    console.log("events", promises)
                    sendResponse(Promise.allSettled(promises))
                })
                return true
                break
        }
    }
})