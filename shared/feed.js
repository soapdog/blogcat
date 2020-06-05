import { db } from "./database.js";

export class Feed {
    constructor(feedUrl, folderId) {
        this.feedUrl = feedUrl;
        this.enabled = true;
        this.errored = false;
        this.title = feedUrl;
        this.folderId = folderId;
        this.items = [];
    }

    refresh() {
        return new Promise((resolve, reject) => {
            let url = this.feedUrl;
            console.log(`refreshing ${url}`);
            let parser = new RSSParser();
            try {
                parser.parseURL(this.feedUrl, (err, feed) => {
                    if (err) {
                        this.refreshing = false;
                        this.errored = true;
                        this.save().then(() => {
                            reject(err);
                        });
                    } else {
                        this.description = feed.description || "";

                        let lastBuildDate = new Date(feed.lastBuildDate);
                        let pubDate = new Date(feed.pubDate);

                        if (!isNaN(lastBuildDate)) {
                            this.lastBuildDate = lastBuildDate;
                        } else if (!isNaN(pubDate)) {
                        this.lastBuildDate = pubDate;// hack to always have a lastBuildDate
                    } else {
                        // no date, then place it in the past!
                        this.lastBuildDate = new Date('01 Jan 1970 00:00:00 GMT');
                    }

                    if (!isNaN(pubDate)) {
                        this.pubDate = pubDate;
                    }

                    this.siteUrl = feed.link || url; 
                    this.feedUrl = feed.feedUrl || url; 

                    if (this.siteUrl.indexOf("http") == -1) {
                        this.siteUrl = url.split("/").slice(0,2).join("/") + this.siteUrl;
                    }

                    if (this.feedUrl.indexOf("http") == -1) {
                        this.feedUrl = url;
                    }

                    this.title = feed.title || url;
                    this.ttl = feed.ttl || 10;
                    this.errored = false;

                    db.transaction("rw", db.feeds, db.items, () => {
                        this.save().then(key => {
                            feed.items.forEach(i => {
                                let item = new FeedItem(i, key);
                                item.save();
                            });
                            console.log(`${url} -> ${feed.items.length} items`);
                            resolve(this);
                        });
                    });
                }
            });
            } catch(ferr) {
                this.errored = true;
                this.save().then(() => {
                    reject(ferr);
                });
            }
        });
    }

    save() {
        return db.feeds.put(this);
    }

    static async exists(feedUrl) {
        try {
            let f = await db.feeds.where("feedUrl").equals(feedUrl).count();
            return f == 1;
        } catch(n) {
            console.error("n", n)
            return false;
        }
    }

    static getById(id) {
        return db.feeds.get(id);
    }

    static async getByURL(url) {
        try {
            let f = await db.feeds.where("feedUrl").equals(url).first();
            return f;
        } catch(n) {
            console.error("n", n)
            return false;
        }
    }
}

export class FeedItem {
    constructor(pItem, key) {
        this.author = pItem.author || "";
        this.content = pItem.content || "";
        this.contentSnippet = pItem.contentSnippet || "";
        this.creator = pItem.creator || "";
        this.guid = pItem.guid;
        this.read = false;
        let isoDate = new Date(pItem.isoDate) || false;
        if (isoDate && !isNaN(isoDate)) {
            this.isoDate = isoDate;
        }

        let pubDate = new Date(pItem.pubDate) || false;
        if (pubDate && !isNaN(pubDate)) {
            this.pubDate = pubDate;
        }
        this.link = pItem.link || "";
        this.title = pItem.title || "";
        this.tags = [];
        this.feedId = key;
    }

    save() {
        return db.items.put(this);
    }

    static getById(id) {
        return db.items.get(id);
    }
}

export function FeedExistException(feed) {
    this.feed = feed
    this.message = "Already subscribed to feed"
    this.toString = () => {
        return `${this.message}: ${feed.feedUrl}`
    }
}