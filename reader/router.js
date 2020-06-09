import vUnread from "./v-unread.js"
import { initialize } from "../common/database.js";

initialize().then(_db => {
	m.route(document.body, "/", {
		"/unread": vUnread,
		"/": vUnread
	});
})