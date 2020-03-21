import OPML1 from "../shared/opml1.js"
import OPML2 from "../shared/opml2.js"
import { Feed } from "../shared/feed.js"
import db from "../shared/database.js"

let main = async () => {

    let subs = new OPML1()

    await subs.loadFromURL("/subs.opml")

    let feeds = subs.toArray()
    Promise.all(feeds.map(async ({url, folder}) => {
        let f = new Feed(url, folder)
        try {
            await f.refresh()
        } catch (err) {
            console.log(`can't load ${url}`)
        }
        return f
    })).then(arr => {
        console.log("pronto!")
    })


    // let f = new Feed()
    // await f.loadFromURL("https://andregarzia.com/feeds/all.rss.xml")
    // console.dir(f)

    // let opml = new OPML2()

    // await opml.loadFromURL("http://corsify.appspot.com/http://hosting.opml.org/dave/spec/subscriptionList.opml")

    // console.dir(opml)
    // console.log(opml.dateCreated.toISOString())

    // let opml2 = new OPML2()

    // await opml2.loadFromURL("http://corsify.appspot.com/http://hosting.opml.org/dave/spec/simpleScript.opml")

    // console.dir(opml2)


    // let parser = new RSSParser();
    // parser.parseURL('https://www.reddit.com/.rss', function (err, feed) {
    //     if (err) throw err;
    //     console.log(feed.title);
    //     console.dir(feed)
    //     // feed.items.forEach(function (entry) {
    //     //     console.log(entry.title + ':' + entry.link);
    //     // })
    // })

    // let url = "http://andregarzia.com/feeds/all.rss.xml"
    // parser.parseURL(url, function (err, feed) {
    //     if (err) throw err;
    //     console.log(feed.title);
    //     console.dir(feed)
    //     // feed.items.forEach(function (entry) {
    //     //     console.log(entry.title + ':' + entry.link);
    //     // })
    // })

}

main()