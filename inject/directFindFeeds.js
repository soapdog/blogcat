/**
 * This is a script to be executed with `tab.executeScript()` and
 * look for feeds in the running tab directly.
 * 
 * Normally this script wouldn't be needed for the inject script will
 * run on every page and show the subscribe pageAction when suitable.
 * 
 * This is for cases where the user explicitly choose to look for feeds
 * manually.
 * 
 * == WARNING ==
 * Be aware of the code duplication between this file and "findFeeds.js". 
 * Unfortunately, I can't `import` the `findFeeds()` function here because
 * the browser doesn't see this file as a module.
 */

(function main() {
    let rssEl = document.querySelector("link[type='application/rss+xml']")
    let atomEl = document.querySelector("link[type='application/atom+xml']")
    let ret = {
        rss: false,
        atom: false
    }

    if (rssEl) {
        ret.rss = rssEl.getAttribute("href")
    }

    if (atomEl) {
        ret.atom = atomEl.getAttribute("href")
    }

    return ret
})()