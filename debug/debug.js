import OPML1 from "../models/opml1.js";
import OPML2 from "../models/opml2.js";
import {Feed} from "../models/feed.js";

let main = async () => {

    // let subs = new OPML1()

    // await subs.loadFromURL("/subs.opml")

    // console.dir(subs)

    let f = new Feed()
    await f.loadFromURL("http://andregarzia.com/feeds/all.rss.xml")
    console.dir(f)

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