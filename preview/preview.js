import { initialize } from "../shared/database.js"
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
                feed.items = feed.items.slice(0, 10) // preview only the first 10 items.
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
        ev.stopPropagation()
        ev.preventDefault()

        blogcat.subscribe(url)
            .then(f => {
                console.log("saved feed", f)
                window.close()
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
                            m("a", { href: item.link, target: "_blank" }, m("h3", item.title)),
                            m("span.label", date.toLocaleString()),
                            m("p.text-justify", item.contentSnippet.slice(0, 500) + "...")
                        ]
                    }
                    return m(".container",
                        m(".columns",
                            m(".column.col-6.col-mx-auto",
                                m(".panel", {style: "height: 90vh; margin-top: 5vh"}, [
                                    m(".panel-header", [
                                        m("h4.panel-title", `Preview of '${feed.title}' feed`),
                                        m("p", [m.trust(`Showing the first ten posts from <code>${url}</code>.`)]),
                                        feed.description ? m("blockquote.blockquote", feed.description) : "",
                                    ]),
                                    m(".panel-body", [
                                        feed.items.map(i => FeedItem(i)),
                                    ]),
                                    m(".panel-footer", [
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
                                ])
                            )
                        ),
                    )
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

initialize().then(_db => {
    m.mount(document.body, previewView)
})