import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

document
  ?.querySelector("body")
  ?.insertAdjacentHTML(`afterbegin`, `<div id="trade-extension"></div>`);

createApp(App).use(store).use(router).mount("#trade-extension");
