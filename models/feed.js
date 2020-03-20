export class Feed {
    constructor() {
        this.description = false;
        this.lastBuildDate = false;
        this.siteUrl = false;
        this.feedUrl = false;
        this.feedFormat = false;
        this.pubDate = false;
        this.title = false;
        this.ttl = false;
        this.folder = false;
        this.favicon = false;
        this.items = [];
    }

    loadFromURL(pURL) {
        let that = this;
        return new Promise((resolve, reject) => {
            let parser = new RSSParser();
            parser.parseURL(pURL, function (err, feed) {
                if (err) {
                    reject(err)
                } else {
                    that.description = feed.description || false;
                    that.lastBuildDate = new Date(feed.lastBuildDate) || false;
                    that.siteUrl = feed.link || false;
                    that.feedUrl = feed.feedUrl || pURL || false;
                    that.feedFormat = false;
                    that.pubDate = new Date(feed.pubDate) || false;
                    that.title = feed.title || false;
                    that.ttl = feed.ttl || false;
                    that.folder = false;
                    that.favicon = false;
                    that.items = feed.items.map(i => new FeedItem(i))

                    resolve(that)
                }
            })
        })
    }
}

export class FeedItem {
    constructor(pItem) {
        this.author = pItem.author || false;
        this.content = pItem.content ||false;
        this.contentSnippet = pItem.contentSnippet ||false;
        this.creator = pItem.creator ||false;
        this.guid = pItem.guid ||false;
        this.isoDate = new Date(pItem.isoDate) ||false;
        this.link = pItem.link ||false;
        this.pubDate = new Date(pItem.pubDate) ||false;
        this.title = pItem.title ||false;
    }
}