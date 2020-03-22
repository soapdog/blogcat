const root = document.body
import Reader from "./reader.js"

m.route(root, "/", {
    "/item/:item": Reader,
    "/blog/:feed": Reader,
    "/": Reader
})