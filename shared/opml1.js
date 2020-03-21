/**
 * OPML 1.0 implementation
 * 
 * Implementation of version 1.0 as found in:
 * http://dev.opml.org/spec1.html
 */

import {
    XPathAttribute,
    XPathValue,
    evaluateXPath
} from "./xml.js"

export default class OPML1 {
    constructor() {
        this.version = false;
        this.title = false;
        this.dateCreated = false;
        this.dateModified = false;
        this.ownerName = false;
        this.ownerEmail = false;
        this.ownerId = false;
        this.docs = false;
        this.expansionState = false;
        this.vertScrollState = false;
        this.windowTop = false;
        this.windowLeft = false;
        this.windowBottom = false;
        this.windowRight = false;
        this.outlines = [];
    }

    async loadFromURL(pURL) {
        let opmlText = await (await fetch(pURL)).text();

        return this.parse(opmlText);
    }

    toArray() {
        let result = new Set()
        const getFeedsFromOutlines = (outlines, folder) => {
            outlines.forEach(o => {
                if (o.outlines.length > 0) {
                    if (folder === "") {
                        folder = o.title
                    } else {
                        folder = `${folder}/${o.title}`
                    }
                    getFeedsFromOutlines(o.outlines, folder)
                } else if (o.xmlUrl) {
                    result.add({url: o.xmlUrl, folder})
                }
            })
        }

        getFeedsFromOutlines(this.outlines, "")
        return [...result]
    }

    parse(pText) {
        let parser = new DOMParser();
        let xml = parser.parseFromString(pText, "text/xml");

        if (xml.nodeName == "parsererror") {
            throw "parsererror: error parsing opml";
        }

        let opmlRoot = xml.getElementsByTagName("opml")[0];

        if (opmlRoot.getAttribute("version") !== "1.0") {
            throw `parsererror: wrong OPML version. Expected 1.0 and got: ${opmlRoot.getAttribute("version")}.`;
        }

        // loading attributed from head.
        this.version = XPathAttribute(xml, "//opml/@version")
        this.title = XPathValue(opmlRoot, "//head/title")
        this.dateCreated = XPathValue(opmlRoot, "//head/dateCreated", (n) => new Date(n));
        this.dateModified = XPathValue(opmlRoot, "//head/dateModified", (n) => new Date(n));
        this.ownerName = XPathValue(opmlRoot, "//head/ownerName");
        this.ownerEmail = XPathValue(opmlRoot, "//head/ownerEmail");
        this.ownerId = XPathValue(opmlRoot, "//head/ownerId");
        this.docs = XPathValue(opmlRoot, "//head/docs");
        this.expansionState = XPathValue(opmlRoot, "//head/expansionState", (e) => e.split(",").map(n => Number(n)));
        this.vertScrollState = XPathValue(opmlRoot, "//head/vertScrollState", Number);
        this.windowTop = XPathValue(opmlRoot, "//head/windowTop", Number);
        this.windowLeft = XPathValue(opmlRoot, "//head/windowLeft", Number);
        this.windowBottom = XPathValue(opmlRoot, "//head/windowBottom", Number);
        this.windowRight = XPathValue(opmlRoot, "//head/windowRight", Number);

        // load outlines ...
        this.outlines = this.extractOutline(evaluateXPath(opmlRoot, "//body")[0]);

        return this
    }

    extractOutline(node) {
        let outlines = evaluateXPath(node, "outline")
        let ret = []

        for (let o of outlines) {
            let attrs = o.attributes;
            let r = {}
            for (let i = attrs.length - 1; i >= 0; i--) {
                let a = attrs[i];
                r[a.name] = a.value;
            }

            if (o.childElementCount == 0) {
                r.outlines = []
            } else {
                r.outlines = this.extractOutline(o);
            }
            ret.push(r)
        }

        return ret
    }
}