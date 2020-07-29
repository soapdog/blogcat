document.getElementById('import').addEventListener("click", () => {
    browser.tabs.create({
        url: "/import/index.html"
      });
      window.close();
})

document.getElementById('reader').addEventListener("click", () => {
  browser.tabs.create({
      url: "/reader/index.html"
    });
    window.close();
})