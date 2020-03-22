import { Feed, FeedItem } from "./feed.js"
import Folder from "./folder.js"

const db = new Dexie("blogcat")

db.version(1).stores({
    feeds: "++id, &feedUrl, title, pubDate, lastBuildDate, siteUrl, *tags, folderId",
    items: "++id, &guid, feedId, creator, pubDate, title, *tags",
    folders: "++id, name, parentId",
})

db.feeds.mapToClass(Feed)
db.items.mapToClass(FeedItem)

db.open()
    .catch((err) => {
        console.error("Problem opening blogcat database.", err)
        throw err
    })

window.db = db
export default db