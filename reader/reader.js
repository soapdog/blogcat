import db from "../shared/database.js"
import FeedList from "./feedlist.js"
 
export default class Reader {
    
    view(vnode) {
        return m(".off-canvas.off-canvas-sidebar-show", [
            m(".off-canvas-sidebar", [
                m(FeedList)
            ]),
            m(".off-canvas-content", [
                m("h1", "content")
            ])
        ])
    }
}