import db from "../shared/database.js"

export default class FeedList {

    oninit(vnode) {
        console.log("fetching feeds...")
        this.feeds = []

        db.feeds
            .toArray()
            .then(feeds => {
                this.feeds = _.sortBy(feeds, f => {
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
        const makeLink = f => m("li.nav-item", m("a", { href: f.siteUrl }, [
            m("span", f.title)
        ]))
        return [
            m("button", { onclick: this.refreshFeeds }, "refresh"),

            m("ul.nav", this.feeds.map(makeLink))
        ]
    }
}