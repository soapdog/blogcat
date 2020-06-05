import { Feed } from "./feed.js";

const blogcat = {
    subscribe: async feedUrl => {
        if (!await Feed.exists(feedUrl)) {
            let feed = new Feed(feedUrl)
            await feed.save()
            return feed
        }
        return false 
    },
    fetchFeed: url => {
        return new Promise((resolve, reject) => {
            let parser = new RSSParser()
            parser.parseURL(url, (err, feed) => {
                if (err) {
                    reject(err)
                }
                if (!feed.feedUrl) {
                    feed.feedUrl = url
                }
                resolve(feed)
            })
        })
    },
}

export default blogcat