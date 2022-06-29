<template>
  <div class="global-content-err">
    <img src="../assets/imgs/icon-left-font-monochrome-white.svg" alt="logo" />
    <section class="error-panel">
      <h1 class="title">Code Erreur: {{ Id }}</h1>
      <p class="title-2">{{ msgErr }}</p>
      <button @click="back()" type="button" class="title-4 back-btn">
        <i class="arrow-icons fa-solid fa-circle-arrow-left"></i> Retour
      </button>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const routes = useRoute();
document.title = routes.meta.title;
const Id = routes.params.id;
let msgErr = " ";
//permet de faire un retour en arriere
function back() {
  location.href = "/";
  localStorage.clear();
}
//switch permet de gerer les redirection de façon dynamique
switch (Id) {
  case "404":
    msgErr = "Page Not Found!";
    break;
  case "401":
    msgErr = "vous n'êtes pas autorisé à consulter cette page";
    break;
  case "403":
    msgErr =
      "Votre compte est a etait desactiver, veuillez contacter un administrateur";
    break;
  case "498":
    msgErr =
      "Le token d'authentification est invalide veuillez vous reconnecter svp!";
    break;
  case "1007":
    msgErr = "Votre compte a etait deconnecter puis desactivée!";
    break;
}
</script>
<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
</style>

<style scoped lang="scss">
// scoped Scss
@import "../assets/scss/base.scss";
.global-content-err {
  background-color: var(--primary-color);
  height: 100vh;
  max-height: 100vh;
  @include flex(column, nowrap, center, flex-start);
  gap: 50px;
  img {
    margin: 20px;
    width: 50%;
  }
  .error-panel {
    @include flex(column, nowrap, center, center);
    background-color: var(--police);
    width: 50%;
    height: 50vh;
    border-radius: 30px;
    gap: 30px;
    h1 {
      font-size: 50px;
    }
    p {
      font-size: 12px;
      text-align: center;
    }
    .back-btn {
      @include flex(row, nowrap, center, center);
      gap: 12px;
      background-color: var(--light-blue);
      width: 120px;
      height: 40px;
      border-radius: 20px;
      border: none;
      font-size: 15px;
      &:hover {
        cursor: pointer;
        @extend %btnScale;
      }
      .arrow-icons {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
          inset 0px 4px 4px rgba(255, 255, 255, 0.516);
        border-radius: 50%;
        --arrow-size: 25px;
        width: var(--arrow-size);
        height: var(--arrow-size);
      }
    }
  }
}
</style>
