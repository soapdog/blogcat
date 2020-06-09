let rssEl = document.querySelector("link[type='application/rss+xml']")
let atomEl = document.querySelector("link[type='application/atom+xml']")

let feeds = {
    rss: false,
    atom: false
}

if (rssEl) {
    feeds.rss = rssEl.getAttribute("href")
}

if (atomEl) {
    feeds.atom = atomEl.getAttribute("href")
}

if (feeds.rss || feeds.atom) {
    browser.runtime.sendMessage({ "type": "found-feeds", feeds })
}
