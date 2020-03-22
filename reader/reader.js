import db from "../shared/database.js"
import FeedList from "./feedlist.js"
import ItemList from "./itemlist.js"
import {FeedItem} from "../shared/feed.js"

export default class Reader {

    oninit() {
       
    }

    view(vnode) {
        return m(".columns", [
            m(".column.bg-gray.col-3", [
                m(".container", m(FeedList))
            ]),
            m(".column.col-3", [
                m(ItemList)
            ]),
            m(".column", [
                m("h1", "item content")
            ])
        ])
    }
}