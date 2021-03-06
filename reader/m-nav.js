const mNav = (initialVnode) => {
    let refreshing = false

    const refresh = (ev) => {
        ev.preventDefault()
        console.time("refresh feeds")
        refreshing = true
        m.redraw()
        var p = browser.runtime.sendMessage({ "type": "refresh-feeds" })

        p.then(() => {
            console.timeEnd("refresh feeds")
            refreshing = false
            m.redraw()
        })
    }

    return {
        view: (vnode) => {
            return m("header.navbar", {style: "margin-top: 10px"}, [
                m("section.navbar-section", [
                    m("a.navbar-brand.mr-2", m("img", { src: "../assets/icons/cat_color.svg", style: "height: 20px" })),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "Unread"),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "Bookmarks"),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "Feeds"),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "Tags"),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "History"),
                    m(m.route.Link, { class: "btn btn-link", href: "/unread" }, "Settings"),
                    m("a.btn.btn-link", { href: "/import/index.html" }, "Import"),

                ]),
                m("section.navbar-section", [
                    refreshing ? m(".loading.ml-2.pr-2") : null,
                    m(m.route.Link, { class: "btn btn-link", href: "/import", onclick: refresh }, "Refresh")
                ])
            ])
        }
    }
}

export default mNav