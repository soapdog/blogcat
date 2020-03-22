import db from "../shared/database.js"

export default class FeedList {

    oninit(vnode) {
        console.log("fetching feeds...")
        this.feeds = {}
        this.folders = []

        db.feeds
            .toArray()
            .then(feeds => {
                feeds.forEach(f => {
                    this.feeds[f.folder] = this.feeds[f.folder] || []
                    this.feeds[f.folder].push(f)
                })
                this.folders = Object.keys(this.feeds).sort()

                this.folders.forEach(folder => {
                    this.feeds[folder] = _.sortBy(this.feeds[folder], f => {
                        try {
                            if (f.lastBuildDate instanceof Date) {
                                return f.lastBuildDate.getTime()
                            } else {
                                let d = Date.parse('01 Jan 1970 00:00:00 GMT')
                                return d
                            }
                        } catch (n) {
                            console.error(n)
                        }
                    }).reverse()
                })
                console.log(this.folders)

                console.log(this.feeds)
                m.redraw()
            })
    }

    refreshFeeds() {
        console.log("refreshing feeds...")
        Promise.all(db.feeds.each(f => f.refresh()))
            .then(console.log("acabou?"))
            .catch(console.log("rejected?"))
    }

    view(vnode) {

        return [
            m("button", { onclick: this.refreshFeeds }, "refresh"),

            m("ul.nav", this.folders.map(f => m(Folder, { title: f, active: false, items: this.feeds[f] })))
        ]
    }
}

class Folder {
    oninit(vnode) {
        this.active = vnode.attrs.active
        let currentFeed = m.route.param("feed")
        if (currentFeed) {
            this.active = vnode.attrs.items.some(i => i.id == Number(currentFeed))
        }
    }
    view(vnode) {
        let currentFeed = m.route.param("feed")

        const makeLink = f => m("li.nav-item", m(m.route.Link, {
            href: `/blog/${f.id}`,
            class: currentFeed == f.id ? "text-bold" : ""
        }, [
            m("img", { src: f.favicon(), style: "padding-right: 5px;" }),
            m(`span`, f.title)
        ]))

        if (this.active) {
            return m("li.nav-item", [
                m("a.text-bold", {
                    href: "#",
                    onclick: (ev) => {
                        ev.preventDefault()
                        this.active = !this.active
                        m.redraw()
                    }
                }, vnode.attrs.title),
                m("ul.nav", vnode.attrs.items.map(makeLink))
            ])
        } else {
            return m("li.nav-item", m("a.text-bold", {
                href: "#",
                onclick: (ev) => {
                    ev.preventDefault()
                    this.active = !this.active
                    m.redraw()
                }
            }, vnode.attrs.title))
        }
    }
}