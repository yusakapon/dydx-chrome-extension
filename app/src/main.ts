import { createApp } from "vue";
import App from "./App.vue";
import { store, key } from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./index.css";

library.add(fas);
document
  ?.querySelector("body")
  ?.insertAdjacentHTML(
    `afterbegin`,
    `<div id="trade-extension" class="z-40 absolute w-auto h-auto"></div>`
  );

createApp(App)
  .use(store, key)
  .component("fa", FontAwesomeIcon)
  .mount("#trade-extension");
