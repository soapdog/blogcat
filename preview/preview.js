import blogcat from "../shared/blogcat.js"

const previewView = () => {
    let feed = false
    let stage = "loading" // error, showfeed
    let error = false
    let url = location.hash.slice(1)

    if (url) {
        blogcat.fetchFeed(url)
            .then(f => {
                console.log("feed", f)
                feed = f
                stage = "showfeed"
                m.redraw()
            })
            .catch(err => {
                stage = "error"
                error = err.message
                console.error(err)
                m.redraw()
            })
    } else {
        error = `not a valid url`
        stage = "error"
        m.redraw()
    }

    const subscribe = ev => {
        blogcat.subscribe(url)
            .then(f => {
                console.log("saved feed", f)
            })
            .catch(error => console.error("err", error))
    }

    return {
        view: vnode => {
            switch (stage) {
                case "showfeed":
                    const FeedItem = (item) => {
                        let date = new Date(item.pubDate)
                        return [
                            m("a", {href: item.link, target: "_blank"}, m("h3", item.title)),
                            m("span.label", date.toLocaleString()),
                            m("p.text-justify", item.contentSnippet.slice(0, 300) + "...")
                        ]
                    }
                    return m(".container", {style: "width: 60%; margin: auto;"}, [
                        m("h1", `Preview of '${feed.title}' feed`),
                        m("p", `Showing the first five posts from ${url}.`),
                        feed.description ? m("blockquote.blockquote", feed.description) : "",
                        feed.items.slice(0, 5).map(i => FeedItem(i)),
                        m(".divider.text-center[data-content='SUBSCRIBE']"),
                        m("form.m-2", [
                            m(".form-group", [
                                m("label.form-label[for=title-input]", "Title"),
                                m("input.form-input[type=text][id=title-input]", { value: feed.title })
                            ]),
                            m(".form-group", [
                                m("label.form-label", "Feed"),
                                m("label.form-radio", [m("input[type=radio]", { name: "feed", value: url, checked: true }), m("i.form-icon"), m("span", url)]),
                            ]),
                            m("button.btn.btn-primary", { onclick: subscribe }, "Subscribe")
                        ])
                    ])
                case "error":
                    return m(".empty", { style: "height: 100vh" }, [
                        m(".empty-icon", [
                            m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:36px" })
                        ]),
                        m("p.empty-title.h5.text-centered", `Error: ${error}`)
                    ])
                case "loading":
                    return m(".empty", { style: "height: 100vh" }, [
                        m(".empty-icon", [
                            m(".loading.loading-lg")
                        ]),
                        m("p.empty-title.h5.text-center", "Loading feed...")
                    ])

            }
        }
    }
}

m.mount(document.body, previewView)