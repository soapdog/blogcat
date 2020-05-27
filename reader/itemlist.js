import { db } from "../shared/database.js"
import Utils from "./utils.js";

export default class ItemList {
    oninit(vnode) {
        this.items = []

        let route = m.route.get();
        let selectedFeed = false

        Utils.feedFromRoute().then(f => {
            if (f) {
                this.refreshItems(f)
            }
        })
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
        return m(".container", {style: "height: calc(100vh - 52px); overflow-y: scroll; scrollbar-width: none"},[
            this.items.map(i => m("div.tile",{onclick: () => {m.route.set("/item/:id", {id: i.id})}}, [
                m("div.tile-content", [
                    m("div.tile-title.h5", i.title),
                    m("div.title-subtitle", i.pubDate.toLocaleDateString()),
                    m("br")
                    ])
                ]))
            ])
    }
}