import { db } from "../shared/database.js";
import Utils from "./utils.js"

export default class FeedList {

    oninit(vnode) {
        this.feeds =
        this.folders = [];

        // todo: this folder generation is stupid.
        // replace with db folders.
        // db.feeds
        // .toArray()
        // .then(feeds => {
        //     feeds.forEach(f => {
        //         this.feeds[f.folder] = this.feeds[f.folder] || [];
        //         this.feeds[f.folder].push(f);
        //     });
        //     this.folders = Object.keys(this.feeds).sort();

        //     this.folders.forEach(folder => {
        //         this.feeds[folder] = _.sortBy(this.feeds[folder], f => {
        //             try {
        //                 if (f.lastBuildDate instanceof Date) {
        //                     return f.lastBuildDate.getTime();
        //                 } else {
        //                     let d = Date.parse('01 Jan 1970 00:00:00 GMT');
        //                     return d;
        //                 }
        //             } catch (n) {
        //                 console.error(n);
        //             }
        //         }).reverse();
        //     });
        //     m.redraw();
        // });

        db.folders.orderBy("name").toArray().then(folders => {
            this.folders = folders;
            m.redraw();
        });
    }

    view(vnode) {

        return m("div.container",[
            m("ul.nav", this.folders.map(f => m(Folder, { folder: f, active: false})))
            ])
    }
}

class Folder {
    oninit(vnode) {
        this.active = vnode.attrs.active;
        this.items = [];
        this.folder = vnode.attrs.folder;
        this.activeFolder = false;

        Utils.folderFromRoute().then(id => {
            this.folder.feeds().then(feeds => {
                this.items = feeds;                
                this.active = this.folder.id == id;
                m.redraw();
            })
        })
    }
    view(vnode) {
        const makeLink = f => {
            let icon = statusicon(f);
            return m("li.nav-item", m(m.route.Link, {
                href: `/blog/${f.id}`,
                class: ""
            }, [
            m("div", {style: "padding: 5px; display: inline;"}, [icon]),
            m(`span`, f.title)
            ]));
        };

        const statusicon = f => {
            if (f.refreshing) {
                return m("i.fas.fa-spinner.fa-spin");
            }

            if (f.errored) {
                return m("i.fas.fa-exclamation-triangle");
            }

            // TODO: Replace this google access with something less spy-ish.
            return m("img", {src: `https://s2.googleusercontent.com/s2/favicons?domain_url=${encodeURIComponent(f.siteUrl)}`});
        };

        if (this.active) {
            return m("li.nav-item", [
                m("a", {
                    href: "#",
                    onclick: (ev) => {
                        ev.preventDefault();
                        this.active = !this.active;
                        m.redraw();
                    }
                }, [
                m("i.fas.fa-folder-open"),
                m("span",{style: "padding-left: 5px;"}, this.folder.name)
                ]),
                m("ul.nav", this.items.map(makeLink))
                ]);
        } else {
            return m("li.nav-item", m("a", {
                href: "#",
                onclick: (ev) => {
                    ev.preventDefault();
                    this.active = !this.active;
                    this.folder.feeds().then(feeds => {
                        this.items = feeds;
                        m.redraw();
                    });
                    m.redraw();
                }
            }, [
            m("i.fas.fa-folder"),
            m("span",{style: "padding-left: 5px;"}, this.folder.name)
            ]));
        }
    }
}