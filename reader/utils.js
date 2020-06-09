import {Feed, FeedItem} from "../common/feed.js";
import { db } from "../common/database.js";


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

	

	static async itemFromRoute() {
		let route = m.route.get();

		if (route.indexOf("/item/") !== -1) {
			let id = Number(m.route.param("key"));
			return id || false;
		}

		return false;
	}

	static unreadCount() {
        return new Promise((resolve, reject) => {
            db.items.where("read").equals(0).count()
                .then(count => resolve(count))
                .catch(err => reject(err))
        })
    }

}