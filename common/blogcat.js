import { Feed, FeedExistException } from "./feed.js";
import { db } from "./database.js"
import OPML1 from "./opml1.js";


const blogcat = {
    alreadySubscribed: feedUrl => {
        return Feed.exists(feedUrl)
    },
    subscribe: async feedUrl => {
        if (!await Feed.exists(feedUrl)) {
            let feed = new Feed(feedUrl)
            await feed.save()
            await feed.refresh()
            return feed
        } else {
            throw new FeedExistException(await Feed.getByURL(feedUrl))
        }
    },
    refresh: () => {
        db.feeds.each(feed => {
            feed.refresh()
        })
    },
    fetchFeed: url => {
        return new Promise((resolve, reject) => {
            let parser = new RSSParser()
            parser.parseURL(url, (err, feed) => {
                if (err) {
                    reject({ error: err, feed })
                    return false
                }
                if (feed && !feed.feedUrl) {
                    feed.feedUrl = url
                }
                feed.originalUrl = url

                // todo: this url check needs to be part of the Feed class.
                try {
                    let u1 = new URL(feed.feedUrl)
                } catch (n) {
                    // feed.feedUrl is not a valid url.
                    let u1 = new URL(url)
                    let u2 = new URL(feed.feedUrl, u1)
                    feed.feedUrl = u2.href
                }

                try {
                    let u1 = new URL(feed.link)
                } catch (n) {
                    // feed.feedUrl is not a valid url.
                    let u1 = new URL(url)
                    let u2 = new URL(feed.link, u1)
                    feed.link = u2.href
                }

                resolve(feed)
            })
        })
    },
    unreadCount: () => {
        return new Promise((resolve, reject) => {
            db.items.where("read").equals(0).count()
                .then(count => resolve(count))
                .catch(err => reject(err))
        })
    }
}

export default blogcat