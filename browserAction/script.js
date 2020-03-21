document.getElementById('debug').addEventListener("click", () => {
    browser.tabs.create({
        url: "/debug/index.html"
      });
      window.close();
})

document.getElementById('reader').addEventListener("click", () => {
  browser.tabs.create({
      url: "/reader/index.html"
    });
    window.close();
})