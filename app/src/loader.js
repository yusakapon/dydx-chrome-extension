var targets = ["js/chunk-vendors.js", "js/app.js"];

targets.forEach(function (js) {
  var scriptElement = document.createElement("script");
  scriptElement.setAttribute("src", chrome.runtime.getURL(js));
  document.documentElement.appendChild(scriptElement);
});
