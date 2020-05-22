import { db } from "../shared/database.js"

export default class ItemContent {
    oninit(vnode) {
        this.item = false 
        this.loading = false

        let itemId = m.route.param("item") || false

        if (itemId) {
            this.refreshItems(itemId)
        }
    }

    refreshItems(itemId) {
        this.loading = true
        m.redraw()
        db.items
            .get(Number(itemId))
            .then(item => {
                this.item = item
                this.loading = false
                console.log("item", item)
                m.redraw()
            })
    }

    view(vnode) {
        if (this.loading) {
            return m(".container", m(".loading"))
        } else if (this.item) {
            return m(".container", m(".content", [
                m("h1", this.item.title),
                m.trust(this.item.content)
            ]))
        }
    }
}