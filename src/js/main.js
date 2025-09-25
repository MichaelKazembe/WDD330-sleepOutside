import { loadHeaderFooter, initSearch } from "./utils.mjs";

loadHeaderFooter().then(() => {
  initSearch(); // enable search after header is loaded
});
