("use strict");

var global_m3u8_link = "";

function is_m3u8_link(url) {
  if (url.indexOf(".m3u8") > 5) {
    return true;
  } else {
    return false;
  }
}

function print_info(tab) {
  copy(global_m3u8_link);
}

function pass_to_server(url, title) {
  var payload = {
    url: url,
    title: title,
  };

  fetch("http://localhost:5000/save_m3u8_link", {
    method: "POST",
    headers: {
      Accept: "application/json, application/xml, text/plain, text/html, *.*",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    body: new URLSearchParams(payload),
  }).then((resp) => console.log(resp));
}

chrome.webRequest.onBeforeRequest.addListener(
  function (info) {
    if (is_m3u8_link(info.url)) {
      global_m3u8_link = info.url;
    }
    // return {requestHeaders: details.requestHeaders};
  },
  // filters
  { urls: ["https://*/*", "http://*/*"] },
  // extraInfoSpec
  []
);

chrome.browserAction.onClicked.addListener(function (tab) {
  print_info(tab);
  pass_to_server(global_m3u8_link, tab.title);
});

function copy(text) {
  if (text == "") {
    alert("Niente da copiare\n Prova a premere play o a ricaricare la pagina");
  }
  const ta = document.createElement("textarea");
  ta.style.cssText = "opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;";
  ta.value = text;
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  ta.remove();
}
