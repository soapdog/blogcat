import { Feed, FeedExistException } from "./feed.js";

const blogcat = {
    alreadySubscribed: feedUrl => {
        return Feed.exists(feedUrl)
    },
    subscribe: async feedUrl => {
        if (!await Feed.exists(feedUrl)) {
            let feed = new Feed(feedUrl)
            await feed.save()
            return feed
        } else {
            throw new FeedExistException(await Feed.getByURL(feedUrl))
        }
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