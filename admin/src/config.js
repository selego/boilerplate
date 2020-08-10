const forceProd = false;

let apiURL = "https://api.maakyo.com";
if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) {
  apiURL = "http://localhost:3000";
}

export { apiURL };
