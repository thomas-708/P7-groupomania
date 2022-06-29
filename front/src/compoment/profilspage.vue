<script setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useField, useForm } from "vee-validate";
import { z } from "zod";
import { toFieldValidator, toFormValidator } from "@vee-validate/zod";
import axios from "axios";

const router = useRouter();
const route = useRoute();
document.title = route.meta.title; //affiche le titre de la page
let selectedFile = "";

const data = reactive({
  //constante reactive permet de gerer les importation de donnée
  email: "",
  firstname: "",
  lastname: "",
  bio: "",
  avatarsrc: "",
});
//verifie si l'id dans l'url est conforme au localstorge
if (
  route.params.userId != localStorage.getItem("userId") &&
  localStorage.getItem("token")
)
  router.push("/erreur/401");
// redirection vers la page fils
function toFilsPage() {
  const id = route.params.userId;
  router.push(`/fils/${id}`);
}
//Gere l'impotation des fichier dans les balise input
function onFileSelected(event) {
  selectedFile = event.target.files[0];
}
//recupere les infos des utilisateurs
async function apiGetUser() {
  const getUser = await axios.get(
    "http://localhost:3000/api/user/getId/" + localStorage.getItem("userId"),
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  return await getUser;
}

//function qui permet la desactivation du compte
async function terminateAcount() {
  let isactive = { active: false };
  const reponse = await axios
    .put(
      "http://localhost:3000/api/user/turnOff/" +
        localStorage.getItem("userId"),
      isactive,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {
      if (result.status === 200) {
        localStorage.clear();
        router.push("/erreur/1007");
      }
    })
    .catch((err) => {
      if (err.response.status === 403) alert(err.response.data.error);
      console.log(err);
    });
}
// permet la modification du compte
async function modifyAcount() {
  let image = selectedFile
    ? selectedFile
    : document.querySelector("#upload").files[0];
  const user = {
    lastname: document.querySelector("#lastnameValue").value,
    firstname: document.querySelector("#firstnameValue").value,
    email: document.querySelector("#emailValue").value,
    bio: document.querySelector("#bioarea").value,
  };
  data.avatarsrc =
    "http://localhost:3000/images/profils/" +
    document.querySelector("#upload").files[0].name;

  const formData = new FormData();
  formData.append("user", JSON.stringify(user));
  formData.append("image", image);

  const reponse = await axios
    .put(
      "http://localhost:3000/api/user/modifyAccount/" +
        localStorage.getItem("userId"),
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {
      if (result.status === 200) {
        alert(result.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//recupere les information est traites les infos
apiGetUser().then(async (result) => {
  const doc = document.querySelector("#upload");
  data.email = result.data.email;
  data.firstname = result.data.firstname;
  data.lastname = result.data.lastname;
  data.bio = result.data.bio;

  const file = new File([result.data], result.data.avatarsrc, {
    type: "image/" + result.data.avatarsrc.split(".").pop(),
  });
  let list = new DataTransfer();
  list.items.add(file);

  let myFileList = list.files;
  doc.files = myFileList;
  data.avatarsrc = result.data.avatarsrc;
});
</script>

<template>
  <section class="profils">
    <header class="header">
      <div @click="toFilsPage()">
        <i class="arrow-icons icons fa-solid fa-circle-arrow-left"></i>
      </div>

      <img src="../assets/imgs/icon-left-font.svg" alt="logo" />
    </header>
    <form id="form" class="main" @submit="modifyAcount()">
      <h1 class="profils-title background-text">Votre Profile</h1>
      <div class="form">
        <div class="inputname lastname">
          <h2 class="background-text">Nom</h2>
          <input
            type="text"
            id="lastnameValue"
            name="nom"
            :value="data.lastname"
          />
        </div>
        <div class="inputname firstname">
          <h2 class="background-text">Prenom</h2>
          <input
            type="text"
            id="firstnameValue"
            name="prenom"
            :value="data.firstname"
          />
        </div>
        <div class="inputname email">
          <h2 class="background-text">email</h2>
          <input type="text" id="emailValue" name="email" :value="data.email" />
        </div>
        <div class="inputname photo">
          <h2 class="background-text">photo</h2>
          <p class="title-4" id="file_info">{{ data.avatarsrc }}</p>
          <img class="" :src="data.avatarsrc" />
          <input
            @change="onFileSelected"
            type="file"
            id="upload"
            name="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label id="label-photo" class="title-4" for="upload"
            >Parcourrir ...</label
          >
        </div>
        <div class="inputname bio">
          <h2 class="background-text">bio</h2>
          <textarea name="bio" id="bioarea" :value="data.bio"></textarea>
        </div>
      </div>
      <div class="profils-btn">
        <button @click="terminateAcount" type="button" id="disactive-acount">
          <i class="delete-acount fa-solid fa-user-large-slash"></i>
          <p>Désactivé le compte</p>
        </button>
        <button @click="modifyAcount" type="button" id="modify-acount">
          <i class="edit-acount fa-solid fa-pen-to-square"></i>
          <p>modifier</p>
        </button>
      </div>
    </form>
    <div class="AdminGestion"></div>
  </section>
</template>

<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
</style>

<style scoped lang="scss">
@import "../assets/scss/base.scss";
.profils {
  background-color: var(--primary-color);
  height: 100vh;
  min-width: 448px;
  @include flex(column, nowrap, center, flex-start);
  .header {
    @include flex(row, wrap, flex-start, center);
    background-color: var(--police);
    width: 100%;
    height: 70px;
    box-shadow: var(--text-shadow);
    border-radius: 0px 0px 30px 30px;
    overflow: hidden;
    .arrow-icons {
      @include flex(row, wrap, flex-start, flex-start);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
        inset 0px 4px 4px rgba(255, 255, 255, 0.516);
      border-radius: 50%;
      --arrow-size: 40px;
      width: var(--arrow-size);
      height: var(--arrow-size);
      margin-top: 20px;
      // transform: translateX(-290px);
      &:hover {
        cursor: pointer;
      }
    }
    img {
      position: relative;
      top: -135px;
      // right: 100px;
      width: 350px;
    }
  }

  .main {
    @include flex(column, nowrap, center, space-between);
    background-color: var(--police);
    margin-top: 70px;
    width: 70%;
    min-width: 448px;
    border-radius: 40px;
    @media screen and (max-height: 800px) {
      width: 98%;
    }
    .profils-title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      font-weight: 500;
      font-family: "Noto Sans", sans-serif;
    }

    .form {
      @include flex(column, wrap, center, space-between);
      width: 90%;

      .inputname {
        @include flex(row, wrap, flex-end, space-between);
        width: 100%;
        h2 {
          font-family: "Noto Music";
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          text-shadow: var(--text-shadow);
          margin-top: 20px;
        }
      }

      @include flex(column, wrap, center, space-between);
      input,
      textarea,
      label {
        resize: vertical;
        padding-left: 20px;
        height: 45px;
        width: 80%;
        background: rgba(149, 146, 146, 0.69);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 30px 5px;
        border: none;
        margin-top: 20px;
        font-size: 20px;
      }
      img {
        width: 12%;
        padding: 5px;
        margin-top: 10px;
        border: 1px solid black;
        border-radius: 20px;
        box-shadow: var(--text-shadow);
      }
      #bio-area {
        padding: 10px;
        height: 94px;
        font-size: 15px;
      }

      #label-photo {
        text-align: center;
        width: 150px;
        height: 35px;
        padding-top: 7px;
        background-color: var(--primary-color);
        font-size: 15px;
        font-weight: bold;
        font-style: italic;
        &:hover {
          cursor: pointer;
          transition: all 600ms;
          transform: scale(1.01);
          background-color: darken($color: #ef5c5c, $amount: 4);
        }
      }
    }
    .profils-btn {
      @include flex(row, wrap, center, center);

      #disactive-acount,
      #modify-acount {
        display: flex;
        margin: 10px;
        padding: 10px;
        text-transform: uppercase;
        border: 0.3px solid #000000;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
          inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 30px;
        .delete-acount {
          font-size: 17px;
          color: #cb3535;
          padding-right: 5px;
        }
        .edit-acount {
          font-size: 17px;
          color: #075e71;
          padding-right: 5px;
        }
        &:hover {
          cursor: pointer;
          transition: all 600ms;
          transform: scale(1.01);
          background-color: darken($color: #c1bfbf, $amount: 4);
        }
      }
    }
  }
}
</style>
