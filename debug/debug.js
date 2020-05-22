import OPML1 from "../shared/opml1.js";
import OPML2 from "../shared/opml2.js";
import { Feed } from "../shared/feed.js";
import Folder from "../shared/folder.js";
import { initialize, db } from "../shared/database.js";

let main = async () => {

    await initialize();

    let subs = new OPML1();

    await subs.loadFromURL("/subs.opml");

    let feeds = subs.toArray();
    Promise.allSettled(feeds.map(async ({url, folder}) => {
        try {
            let folderId = await Folder.byName(folder);
            if (!await Feed.exists(url)) {
                let feed = new Feed(url, folderId);
                await feed.save();
                console.log("loading", url);
                return feed.refresh();
            } else {
                console.log(`feed ${url} already exists`)
            }
        }catch(n){
            console.log("error", feed);
            console.log("error", folderId);
            console.error(" err", n);
            throw n;
        }
    })).then(arr => {
        console.log("pronto!");
    }).catch(err => console.log("erro", err));


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