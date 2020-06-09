const mNav = (initialVnode) => {
    let refreshing = false 

    const refresh = (ev) => {
        ev.preventDefault()
        console.time("refresh feeds")
        refreshing = true
        m.redraw()
        let p = browser.runtime.sendMessage({ "type": "refresh-feeds" })

        p.then(()=> {
            console.timeEnd("refresh feeds")
            refreshing = false
            m.redraw()
        })
    } 

    return {
        view: (vnode) => {
            return m("header.navbar",[
                m("section.navbar-section", [
                    m("a.navbar-brand.mr-2", m("img", {src: "../assets/icons/cat_color.svg", style: "height: 20px"})),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "Unread"),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "Bookmarks"),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "Feeds"),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "Tags"),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "History"),
                    m(m.route.Link, {class: "btn btn-link", href: "/unread"}, "Settings"),
                    m("a.btn.btn-link", {href: "/import/index.html"}, "Import"),

                ]),
                m("section.navbar-section",[
                    m(m.route.Link, {class: "btn btn-link", href: "/import", onclick: refresh}, "Refresh"),
                    refreshing ? m(".loading.ml-2") : null
                ])
            ])
        }
    }
}

export default mNav