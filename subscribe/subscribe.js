import { initialize } from "../shared/database.js";

import blogcat from "../shared/blogcat.js"

const subscribeView = () => {
    let rss = false
    let atom = false
    let selectedFeed = false
    let loadingFeed = false
    let title = ""
    let error = false
    let stage = "findfeeds" // findfeeds, checksubscribed, showchoice, error

    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0]
        browser.tabs.executeScript(tab.id, {
            file: "/subscribe/findFeeds.js"
        })
            .then(data => {
                const feeds = data[0]
                const baseUrl = new URL(tab.url)
                title = tab.title

                if (feeds.rss) {
                    let rssUrl = new URL(feeds.rss, baseUrl)
                    rss = rssUrl.href
                }
                if (feeds.atom) {
                    let atomUrl = new URL(feeds.atom, baseUrl)
                    atom = atomUrl.href
                }

                if (rss || atom) {
                    stage = "showchoice"
                } else {
                    stage = "nofeeds"
                }

                m.redraw()

            })
            .catch(err => console.error(err))

    });

    const feedChange = ev => {
        let url = ev.target.value
        console.log("attempting to fetch", url)
        selectedFeed = false
        loadingFeed = true
        m.redraw()

        blogcat.fetchFeed(url)
            .then(feed => {
                console.log("feed", feed)
                title = feed.title
                selectedFeed = feed.feedUrl || url
                loadingFeed = false

                m.redraw()
            })
            .catch(err => {
                stage = "error"
                error = err.message
                console.error(err)
                m.redraw()
            })
    }

    const subscribe = ev => {
        blogcat.subscribe(selectedFeed)
            .then(feed => {
                console.log("saved feed", feed)
                window.close()
            })
            .catch(error => console.error("err", error))
    }

    const preview = () => {
        browser.tabs.create({
            url: `/preview/index.html#${selectedFeed}`
        });
        window.close();
    }

    return {
        view: vnode => {
            switch (stage) {
                case "showchoice":
                    return m(".container", [
                        m(".columns", [
                            m(".column", [
                                m("form.m-2", [
                                    m(".form-group", [
                                        m("label.form-label[for=title-input]", "Title"),
                                        m("input.form-input[type=text][id=title-input]", { value: title })
                                    ]),
                                    m(".form-group", { onchange: feedChange }, [
                                        m("label.form-label", "Feed"),
                                        rss ? m("label.form-radio", [m("input[type=radio]", { name: "feed", value: rss }), m("i.form-icon"), m("span", rss)]) : null,
                                        atom ? m("label.form-radio", [m("input[type=radio]", { name: "feed", value: atom }), m("i.form-icon"), m("span", atom)]) : null
                                    ]),
                                    m("button.btn.btn-primary", { disabled: !selectedFeed, onclick: subscribe }, "Subscribe"),
                                    m("button.btn.ml-2", { disabled: !selectedFeed, onclick: preview }, "Preview"),
                                    loadingFeed ? m(".loading.float-right.m-2") : null
                                ])
                            ])
                        ])
                    ])
                case "nofeeds":
                    return m(".empty", [
                        m(".empty-icon", [
                            m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:36px" })
                        ]),
                        m("p.empty-title.h5", "No feeds found on the page.")
                    ])
                case "error":
                    return m(".empty", [
                        m(".empty-icon", [
                            m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:36px" })
                        ]),
                        m("p.empty-title.h5", `Error: ${error}`)
                    ])
                // TODO: already subscribed.
                case "findfeeds":
                    return m(".empty", [
                        m(".empty-icon", [
                            m(".loading.loading-lg")
                        ]),
                        m("p.empty-title.h5.text-center", "Looking for feeds.")
                    ])

            }
        }
    }
}

initialize().then(_db => {
    m.mount(document.body, subscribeView)
})