import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import "font-awesome/scss/font-awesome.scss";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { routes } from "./routes";

// gere la creations des routes
const router = createRouter({
  history: createWebHistory(),
  routes,
});

library.add(fas, far, fab);
dom.watch();

//permet la creation de l'app utiliser le router permet l'utilisation de font awesome etmonte l'app
const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
