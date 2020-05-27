import {Feed, FeedItem} from "../shared/feed.js";
import { db } from "../shared/database.js";


export default class Utils {
	static async feedFromRoute() {
		let route = m.route.get();

		if (route.indexOf("/blog/") !== -1) {
			return Number(m.route.param("key"));
		}

		if (route.indexOf("/item/") !== -1) {
			let id = Number(m.route.param("key"));
			let item = await FeedItem.getById(id);
			return item.feedId || false;
		}

		return false;
	}

	static async folderFromRoute() {
		let route = m.route.get();

		if (route.indexOf("/blog/") !== -1) {
			let feedId = Number(m.route.param("key"));
			let feed = await Feed.getById(feedId);
			return feed.folderId || false;
		}

		if (route.indexOf("/item/") !== -1) {
			let id = Number(m.route.param("key"));
			let item = await FeedItem.getById(id);
			let feedId = item.feedId;
			let feed = await Feed.getById(feedId);
			return feed.folderId;
		}

		return false;
	}

	static async refreshFeeds() {
		console.log("refreshing all feeds...");
		Utils.refreshingFeeds = true;
		m.redraw();

		let feeds = await db.feeds.toArray()
		const promises = feeds.map(f => {
			console.log(`refresh ${f.siteUrl}`);
			return f.refresh();
        });

        Promise.allSettled(promises, s => {
        	Utils.refreshingFeeds = false;
        	m.redraw();
        })
	}

}