const root = document.body;
import Reader from "./reader.js";
import { initialize, db } from "../shared/database.js";

initialize().then(_db => {
	m.route(root, "/", {
		"/item/:feed/:item": Reader,
		"/blog/:feed": Reader,
		"/": Reader
	});
})