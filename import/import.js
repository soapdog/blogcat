import { initialize } from "../shared/database.js"
import blogcat from "../shared/blogcat.js"
import OPML from "../shared/opml1.js";
import { Feed } from "../shared/feed.js";



const vImport = () => {
    let feeds = []
    let stage = "selectsource" // loadopml, showfeeds, error
    let error = false


    const subscribe = ev => {
        ev.stopPropagation()
        ev.preventDefault()

        blogcat.subscribe(url)
            .then(f => {
                console.log("saved feed", f)
                stage = "subscribed"
                feed = f
                error = false
                m.redraw()
            })
            .catch(err => {
                console.log(err)
                if (err.feed) {
                    feed = err.feed
                    stage = "subscribed"
                    error = false
                } else {
                    stage = "error"
                    error = err.message
                    console.error(err)
                }
                m.redraw()
            })
    }

    const openFeed = id => {
        location = `/reader/index.html#!/feed/${id}`
    }

    const fileChanged = ev => {
        const opmlFile = ev.target.files[0]

        if (opmlFile) {
            stage = "loading"
            m.redraw()
            var reader = new FileReader()
            reader.onload = function (event) {
                let opml = new OPML()
                opml.parse(event.target.result)
                let promises = opml.toArray().map(f => blogcat.fetchFeed(f.url))

                Promise.allSettled(promises)
                    .then(rs => {
                        stage = "showfeeds"
                        feeds = rs.filter(f => f.status == "fulfilled").map(f => {
                            f.value.checked = false
                            return f
                        })
                        m.redraw()
                    })
            };
            reader.readAsText(opmlFile)
        }
    }

    const selectAll = (ev) => {
        ev.preventDefault()
        feeds.forEach(f => f.value.checked = true)
        m.redraw()
    }

    const deselectAll = (ev) => {
        ev.preventDefault()
        feeds.forEach(f => f.value.checked = false)
        m.redraw()
    }

    return {
        view: vnode => {
            switch (stage) {
                case "selectsource":
                    return m(".container.grid-lg",
                        m(".columns",
                            m(".column.m-2.text-center", [
                                m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:96px" }),
                                m("h2.text-center", "Import OPML"),
                                m("input.form-input[type=file]", { onchange: fileChanged }),
                                m("p", "Selecting an OPML file will list the feeds in another screen, giving you a chance to select which of those feeds you want to import.")
                            ])
                        ))
                case "showfeeds":
                    const Feed = (fp) => {
                        if (fp.status == "fulfilled") {
                            let feed = fp.value
                            return m("tr", [
                                m("td", m("span", feed.title)),
                                feed.description ? m("td", [m("span",feed.description) , m("a.btn.btn-link.ml-2", {href: feed.link}, "link")]) : m("td", m("a.btn.btn-link.ml-2", {href: feed.link}, "link")),
                                m("td", [
                                    m(".form-group",
                                        m("label.form-switch", [
                                            m("input[type=checkbox]", {checked: feed.checked}),
                                            m("i.form-icon"),
                                            "Subscribe"
                                        ]))

                                ])
                            ])
                        }
                    }
                    return m(".container.grid-lg",
                        m(".columns",
                            m(".column",
                                m(".panel", { style: "height: 90vh; margin-top: 5vh" }, [
                                    m(".panel-header", [
                                        m("h4.panel-title", `Feeds`),

                                    ]),
                                    m(".panel-body", m("table.table.table-striped.table-hover", m("tbody", [
                                        feeds.map(i => Feed(i)),
                                    ]))),
                                    m(".panel-footer", [
                                        m(".divider.text-center[data-content='IMPORT']"),
                                        m("form.m-2", [
                                            m("button.btn.btn-primary", { onclick: subscribe }, "Import Selected"),
                                            m(".float-right", [
                                                m("button.btn", { onclick: selectAll }, "Select All"),
                                                m("button.btn.ml-2", { onclick: deselectAll }, "Deselect All"),
                                            ])
                                        ])
                                    ])
                                ])
                            )
                        ),
                    )
                case "error":
                    return m(".empty", { style: "height: 100vh" }, [
                        m(".empty-icon", [
                            m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:96px" })
                        ]),
                        m("p.empty-title.h5.text-centered", `Error: ${error}`)
                    ])
                case "loading":
                    return m(".empty", { style: "height: 100vh" }, [
                        m(".empty-icon", [
                            m(".loading.loading-lg")
                        ]),
                        m("p.empty-title.h5.text-center", "Fetchings feeds..."),
                        m("p.empty-title.text-center", "🕕 This will take a while... 😿")
                    ])
                case "subscribed":
                    return m(".empty", { style: "height: 100vh" }, [
                        m(".empty-icon", [
                            m("img.p-centered", { src: "/assets/icons/cat_color.svg", style: "width:96px" })
                        ]),
                        m("p.empty-title.h5.text-center", `You have subscribed to '${feed.title}'.`),
                        m("button.btn.btn-primary", { onclick: () => openFeed(feed.id) }, "View feed")
                    ])

            }
        }
    }
}

initialize().then(_db => {
    m.mount(document.body, vImport)
})