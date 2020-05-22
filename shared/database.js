import { Feed, FeedItem } from "./feed.js";
import Folder from "./folder.js";

export let db = false;

export async function initialize() {
	db = new Dexie("blogcat"); // Dexie comes from HTML <script> tag.

	db.version(1).stores({
		feeds: "++id, &feedUrl, title, pubDate, lastBuildDate, siteUrl, *tags, folderId",
		items: "++id, guid, feedId, creator, pubDate, title, *tags",
		folders: "++id, &name",
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
	db.folders.mapToClass(Folder);

	window._db = db; // for debugging stuff in the browsr console.
	return db;
}

