(function main() {
    let rssEl = document.querySelector("link[type='application/rss+xml']")
    let atomEl = document.querySelector("link[type='application/atom+xml']")
    let ret = {
        rss: false,
        atom: false
    }

    console.log(rssEl)
    console.log(atomEl)
    if (rssEl) {
        ret.rss = rssEl.getAttribute("href")
    }

    if (atomEl) {
        ret.atom = atomEl.getAttribute("href")
    }

    return ret
})()