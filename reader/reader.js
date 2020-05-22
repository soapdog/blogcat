import FeedList from "./feedlist.js";
import ItemList from "./itemlist.js";
import ItemContent from "./itemcontent.js";

export default class Reader {
    view(vnode) {
        return m(".columns", [
            m(".column.bg-gray.col-3", [
                m(".container", m(FeedList))
            ]),
            m(".column.col-3", [
                m(ItemList)
            ]),
            m(".column", [
                m(ItemContent)
            ])
        ]);
    }
}