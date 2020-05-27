import FeedList from "./feedlist.js";
import ItemList from "./itemlist.js";
import ItemContent from "./itemcontent.js";
import Empty from "./empty.js";
import Header from "./header.js";

export default class Reader {
    constructor() {
        this.refreshing = false;
    }
    refreshFeeds() {
        this.refreshing = true;
        m.redraw()
    }

    view(vnode) {
        let route = m.route.get();
        if (route == "") {
            route = "/"
        }

        let extra = []

        if (route == "/") {
            extra = [
            m(".columns", [
                m(".column.bg-secondary.col-3", {style: "padding: unset; height: calc(100vh - 52px); overflow-y: scroll; scrollbar-width: none"}, [
                    m(FeedList)
                    ]),
                m(".column", [
                    m(Empty, {title: "No Blog Selected", text: "Please select a blog on the left."})
                    ])
                ])
            ];           
        }

        if (route.indexOf("/blog/") !== -1) {
            extra = [
                m(".columns", [
                    m(".column.bg-secondary.col-3", {style: "padding: unset; height: calc(100vh - 52px); overflow-y: scroll; scrollbar-width: none"}, [
                        m(FeedList)
                    ]),
                    m(".column.col-3", [
                        m(ItemList)
                    ]),
                    m(".column", [
                        m(Empty, {title: "No Post Selected", text: "Please select a post on the left."})
                    ])
                ])
            ];           
        }

        return [m(Header), ...extra]
    }
}