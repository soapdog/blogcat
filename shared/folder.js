import { db } from "./database.js";

class Folder {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}

	save() {
		return db.folders.put(this);
	}

	static async byName(name = "Uncategorized", description = "") {
		if (name === "") {
			name = "Uncategorized";
		}

		try {
			const f = await db.folders.get({name});
			if (f) {
				return f.id;
			} else {
				throw "f is undefined"
			}
		} catch(n) {
			console.log("no folder", name);
			const f = new Folder(name, description);
			await f.save();
			console.log(`created folder ${f.name}`, f.id);
			return f.id;
		}
	}
 
	feeds() {
		return db.feeds.where("folderId").equals(this.id).toArray();
	}
}

export default Folder;