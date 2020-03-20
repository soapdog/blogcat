document.getElementById('debug').addEventListener("click", () => {
    browser.tabs.create({
        url: "/debug/index.html"
      });
      window.close();
})