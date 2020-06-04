import blogcat from "../shared/blogcat.js"

const subscribeView = () => {
    let rss = false
    let atom = false
    let selectedFeed = false
    let title = ""

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

                m.redraw()

            })
            .catch(err => console.error(err))

    });

    const logme = ev => {
        let url = ev.target.value
        blogcat.fetchFeed(url)
            .then(feed => {
                console.log("feed", feed)
                title = feed.title
                selectedFeed = feed.feedUrl
                m.redraw()
            })
            .catch(err => console.error(err))
    }

    const subscribe = ev => {
        blogcat.subscribe(selectedFeed)
            .then(feed => {
                console.log("saved feed", feed)
            })
            .catch(error => console.error("err", error))
    }
    return {
        view: vnode => {
            if (rss || atom) {
                return m(".container", [
                    m(".columns", [
                        m(".column", [
                            m("form.m-2", [
                                m(".form-group", [
                                    m("label.form-label[for=title-input]", "Title"),
                                    m("input.form-input[type=text][id=title-input]", { value: title })
                                ]),
                                m(".form-group", { onchange: logme }, [
                                    m("label.form-label", "Feed"),
                                    rss ? m("label.form-radio", [m("input[type=radio]", { name: "feed", value: rss }), m("i.form-icon"), m("span", rss)]) : "",
                                    atom ? m("label.form-radio", [m("input[type=radio]", { name: "feed", value: atom }), m("i.form-icon"), m("span", atom)]) : ""
                                ]),
                                m("button.btn.btn-primary", { disabled: !selectedFeed, onclick: subscribe }, "Subscribe")
                            ])
                        ])
                    ])
                ])
            } else {
                return m(".container", [
                    m(".empty", [
                        m("p.empty-title.h5", "No feed found on page.")
                    ])
                ])
            }
        }
    }
}

m.mount(document.body, subscribeView)