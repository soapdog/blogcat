import { Feed, FeedItem } from "./feed.js";
import Tag from "./tag.js";

export let db = false;

export async function initialize() {
	db = new Dexie("blogcat"); // Dexie comes from HTML <script> tag.

	db.version(1).stores({
		feeds: "++id, &feedUrl, title, pubDate, lastBuildDate, siteUrl, *tags",
		items: "++id, guid, feedId, read, creator, pubDate, title, *tags",
		tags: "++id, &name",
	});

	try {
		await db.open();
		console.log("db is open");
	} catch(err) {
		console.error("Problem opening blogcat database.", err);
		throw err;
	}

	db.feeds.mapToClass(Feed);
	db.items.mapToClass(FeedItem);
	db.tags.mapToClass(Tag);

	return db;
}

