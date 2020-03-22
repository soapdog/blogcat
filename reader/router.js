const root = document.body
import Reader from "./reader.js"

m.route(root, "/", {
    "/item/:feed/:item": Reader,
    "/blog/:feed": Reader,
    "/": Reader
})