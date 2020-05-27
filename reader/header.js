import Utils from "./utils.js";

export default class Header {
	view(vnode) {
		return m("div.content", [
                    m("header.navbar.bg-primary.p-2",[
                        m("section.navbar-section", [
                            m("a.navbar-brand.mr-2.text-light", "Blogcat"),
                            m("a.btn.btn-link.text-secondary",{onclick: () => { Utils.refreshFeeds() }}, m("i.fas.fa-sync-alt", {class: Utils.refreshingFeeds ? "fa-spin" : ""})),
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
                ])
	}
}