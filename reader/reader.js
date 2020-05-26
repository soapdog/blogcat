import FeedList from "./feedlist.js";
import ItemList from "./itemlist.js";
import ItemContent from "./itemcontent.js";

export default class Reader {
    constructor() {
        this.refreshing = false;
    }
    refreshFeeds() {
        this.refreshing = true;
        console.log("hey")
        m.redraw()
    }

    view(vnode) {
        console.log("ref", this.refreshing)
        return [
        m("div.content", [
            m("header.navbar.bg-primary.p-2",[
                m("section.navbar-section", [
                    m("a.navbar-brand.mr-2.text-light", "Blogcat"),
                    m("a.btn.btn-link.text-secondary",{onclick: () => { this.refreshFeeds() }}, m("i.fas.fa-sync-alt", {class: `${this.refreshing ? "fa-spin" : ""}`})),
                    m("a.btn.btn-link.text-light", m("i.fas.fa-folder")),
                    m("a.btn.btn-link.text-secondary", m("i.fas.fa-tag")),
                    m("a.btn.btn-link.text-secondary", m("i.fas.fa-star")),
                    m("a.btn.btn-link.text-secondary", m("i.fas.fa-clock")),
                    ]),
                m("section.navbar-section", [
                    m("div.input-group.input-inline", [
                        m("input.form-input[type=text][placeholder=search]"),
                        m("button.btn.input-group-btn", "Search")
                        ])
                    ])
                ])
            ]),
        m(".columns", [
            m(".column.bg-secondary.col-3", {style: "padding: unset; height: 100vh; overflow-y: scroll;"}, [
                m(FeedList)
                ]),
            m(".column.col-3", [
                m(ItemList)
                ]),
            m(".column", [
                m(ItemContent)
                ])
            ])
        ];
    }
}