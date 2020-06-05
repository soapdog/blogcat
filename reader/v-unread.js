import blogcat from "../shared/blogcat.js"
import mNav from "./m-nav.js"

const vUnread = (initialVnode) => {
    let count = 0

    blogcat.unreadCount()
        .then(c => {
            console.log("unread count", c)
            count = c
            m.redraw()
        })
        .catch(err => {
            throw err
        })

    return {
        view: (vnode) => {
            return m(".container.grid-lg",
                m(".columns",
                    m(".column", [
                        m(mNav),
                        m("h1", `Unread (${count})`)
                    ])
                )
            )
        }
    }
}

export default vUnread