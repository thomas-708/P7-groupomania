// fichier quui permet la gestion des routes
import fils from "./compoment/fils.vue";
import home from "./compoment/homePage.vue";
import profils from "./compoment/profilspage.vue";
import err from "./compoment/erreurPage.vue";

// fonction qui gere la verification du token
function parseJwt(token) {
  try {
    const base64HeaderUrl = token.split(".")[0];
    const base64Header = base64HeaderUrl.replace("-", "+").replace("_", "/");
    const headerData = JSON.parse(window.atob(base64Header));

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const dataJWT = JSON.parse(window.atob(base64));
    dataJWT.header = headerData;
    return dataJWT;
  } catch (err) {
    return false;
  }
}

export const routes = [
  {
    path: "/",
    component: home,
    name: "home",
    meta: { title: "Groupomania", requiresAuth: false },
  },
  {
    path: "/erreur/:id?",
    component: err,
    name: "Erreur",
    meta: { title: "Error", requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: "Erreur",
      params: {
        id: 404,
      },
    },
    component: err,
  },
  {
    path: "/fils/:userId",
    component: fils,
    name: "fils",
    meta: { title: "fils d'actualité ", requiresAuth: true },
    beforeEnter: (to, from) => {
      if (localStorage.getItem("token")) {
        const jwtDecoded = parseJwt(localStorage.getItem("token"));
        if (jwtDecoded.exp < Date.now() / 1000) {
          return "/erreur/498";
        }
        return true;
      } else {
        return "/erreur/401";
      }
    },
  },
  {
    path: "/profils/:userId",
    component: profils,
    name: "profils",
    meta: { title: "page de profils", requiresAuth: true },
    beforeEnter: (to, from) => {
      if (localStorage.getItem("token")) {
        const jwtDecoded = parseJwt(localStorage.getItem("token"));
        if (jwtDecoded.exp < Date.now() / 1000) {
          return "/erreur/498";
        }
        return true;
      } else {
        return "/erreur/401";
      }
    },
  },
];
