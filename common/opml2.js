/**
 * OPML 2.0 implementation
 * 
 * Implementation of version 2.0 as found in:
 * http://dev.opml.org/spec2.html
 */


import {
    XPathAttribute,
    XPathValue,
    evaluateXPath
} from "./xml.js"

export default class OPML2 {
    constructor() {
        this.version = undefined;
        this.title = undefined;
        this.dateCreated = undefined;
        this.dateModified = undefined;
        this.ownerName = undefined;
        this.ownerEmail = undefined;
        this.ownerId = undefined;
        this.docs = undefined;
        this.expansionState = undefined;
        this.vertScrollState = undefined;
        this.windowTop = undefined;
        this.windowLeft = undefined;
        this.windowBottom = undefined;
        this.windowRight = undefined;
        this.outlines = [];
    }

    async loadFromURL(pURL) {
        let opmlText = await (await fetch(pURL)).text();

        return this.parse(opmlText);
    }

    toArray() {
        let result = new Set()
        const getFeedsFromOutlines = (outlines) => {
            outlines.forEach(o => {
                if (o.outlines.length > 0) {
                    getFeedsFromOutlines(o.outlines)
                } else if (o.xmlUrl) {
                    result.add(o.xmlUrl)
                }
            })
        }

        getFeedsFromOutlines(this.outlines)
        return [...result]
    }

    parse(pText) {
        let parser = new DOMParser();
        let xml = parser.parseFromString(pText, "text/xml");

        if (xml.nodeName == "parsererror") {
            throw "parsererror: error parsing opml";
        }

        let opmlRoot = xml.getElementsByTagName("opml")[0];

        if (opmlRoot.getAttribute("version") !== "2.0") {
            throw `parsererror: wrong OPML version. Expected 2.0 and got: ${opmlRoot.getAttribute("version")}.`;
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