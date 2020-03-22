import db from "../shared/database.js"

export default class ItemList {
    oninit(vnode) {
        this.items = []

        let selectedFeed = m.route.param("feed") || false

        if (selectedFeed) {
            this.refreshItems(selectedFeed)
        }
    }

    refreshItems(feedId) {
        console.log("ref", feedId)
        db.items
            .where("feedId")
            .equals(Number(feedId))
            .reverse()
            .sortBy("pubDate")
            .then(items => {
                this.items = items
                console.log("items", items)
                m.redraw()
            })
    }

    view(vnode) {

        return m(".container", m("ul.nav", [
            this.items.map(i => m("li.nav-item", [
                m(m.route.Link, {href: `/item/${i.id}`}, i.title)
            ]))
        ]))
    }
}