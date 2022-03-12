import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./index.css";

library.add(fas);
document
  ?.querySelector("body")
  ?.insertAdjacentHTML(
    `afterbegin`,
    `<div id="trade-extension" style="position: absolute; z-index:9999; width: 300px; height: 800px;"></div>`
  );

createApp(App)
  .use(store)
  .component("fa", FontAwesomeIcon)
  .mount("#trade-extension");
