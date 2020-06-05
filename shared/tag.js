import { db } from "./database.js";

class Tag {
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
			const f = new Tag(name, description);
			await f.save();
			console.log(`created tag ${f.name}`, f.id);
			return f.id;
		}
	}
}

export default Tag;