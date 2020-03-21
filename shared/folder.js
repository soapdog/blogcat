import db from "./database.js"

class Folder {
    constructor(name, description) {
        this.name = name
        this.description = description
    }
    save() {
        return db.folders.put(this)
    }
}

export default Folder