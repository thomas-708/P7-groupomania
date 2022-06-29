<script setup>
import post from "../compoment/post.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, reactive, provide, computed, isProxy, toRaw } from "vue";
//appel des function
apiGetInfo();
getUserData();
apiGetAllPost();
//variable reactive
let gestion = reactive({
  admin: false,
  editmode: false,
  info: "",
});
//permet de gerer le nombre de posts dans la Db
let count = reactive({ t: 0 });
//crer un tableau qui gere l'utilsation des donner dans les posts
const data = reactive({
  postdata: [],
});
//provide qui envois des donner au composant post
provide("datas", data.postdata);

const route = useRoute();
const router = useRouter();
document.title = route.meta.title;
let selectedFile = ""; //permet de gere l'importation des files

function forceRerender() {
  //permet de faire un rendu des page quand la function est appler
  toProfilsPage();
  const int = setTimeout(() => {
    tofilsPage();
    clearTimeout(int);
  }, 1);
}

function logout() {
  //permet de deconnecter l'utilisateur
  localStorage.clear();
  router.push(`/`);
}
function toProfilsPage() {
  //redirige vers la page de profils
  const id = route.params.userId;
  router.push(`/profils/${id}`);
}
function tofilsPage() {
  const id = route.params.userId;
  router.push(`/fils/${id}`);
}

function onFileSelected(event) {
  selectedFile = event.target.files[0];
}
function dataformat(dates) {
  //function qui gere la creation des dates
  //Date.now()
  const timeElapsed = dates;
  const today = new Date(timeElapsed);
  let hours = " " + today.getHours() + "h " + today.getMinutes();
  let date = today.toLocaleDateString();
  return date + hours;
}
//verifie si l'id dans l'url est conforme au localstorge
if (
  route.params.userId !== localStorage.getItem("userId") &&
  localStorage.getItem("token")
) {
  localStorage.clear();
  router.push("/erreur/401");
}

// appel d'api pour recuperer les donner des posts
async function apiGetAllPost() {
  const getInfo = await axios
    .get("http://localhost:3000/api/post/getAllPost/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      data.postdata.push(result.data);
      count.t = result.data.length;
    });
}
//recupere les donner des Utilisateurs
async function getUserData() {
  const reponse = await axios
    .get(
      "http://localhost:3000/api/user/getId/" + localStorage.getItem("userId"),
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {
      if (result.data.isAdmin) gestion.admin = true;
      else gestion.admin = false;
    })
    .catch((err) => {
      console.log(err);
    });
}
// permet d'ajouter une note
async function setinfo() {
  const infoObj = {
    owner: localStorage.getItem("userId"),
    info: document.querySelector("#infosAdmin").value,
  };
  const reponse = await axios
    .post("http://localhost:3000/api/info/set/", infoObj, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      if (result.status === 200) {
        alert(result.data.message);
        gestion.editmode = false;
        forceRerender();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
//permet de donner la derniere information enregister
async function apiGetInfo() {
  const getInfo = await axios
    .get("http://localhost:3000/api/info/getInfo/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      if (result.status === 200) {
        let data = result.data.pop();
        gestion.info = data.info;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//permet la creation d'un posts
async function createpost() {
  const postObj = {
    owner: localStorage.getItem("userId"),
    text: document.querySelector("#relaseArea").value,
    CreatedAt: dataformat(Date.now()),
  };
  let image = selectedFile;
  const formData = new FormData();
  formData.append("post", JSON.stringify(postObj));
  formData.append("image", image);

  const reponse = await axios
    .post("http://localhost:3000/api/post/createPost/", formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      if (result.status === 200) {
        alert(result.data.message);
        postObj.text = "";
        forceRerender();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <section class="global-content">
    <header class="header">
      <img src="../assets/imgs/icon-left-font.svg" alt="logo" />
      <h1 class="adminmode" :class="{ disActive: !gestion.admin }">ADMIN</h1>
      <div class="box">
        <div @click="logout()" class="logout-box" id="test1">
          <i class="logout-icons fa-solid fa-user-large-slash"></i>
          <p class="title-2">Deconnexion</p>
        </div>

        <div @click="toProfilsPage()" class="profils-box">
          <i class="profils-icons fa-solid fa-user"></i>
          <p class="title-2">Profile</p>
        </div>
      </div>
    </header>
    <main class="main-content">
      <div class="info">
        <i class="info-icons fa-solid fa-circle-info"></i>
        <div class="editbox">
          <div
            @click="gestion.editmode = true"
            :hidden="!gestion.admin || gestion.editmode"
          >
            <i
              class="icons edit-icons fa-solid fa-pen-to-square"
              :hidden="!gestion.admin"
            ></i>
          </div>
          <textarea
            @keydown.enter.exact.prevent="setinfo"
            :hidden="!gestion.admin || !gestion.editmode"
            id="infosAdmin"
            class="edittextarea infos_admin"
            name="infos-box"
            placeholder="Appuyez sur Entrée pour publier votre note."
          ></textarea>
          <p
            class="edittextarea"
            id="infos_user"
            :hidden="gestion.editmode && gestion.admin"
          >
            {{ gestion.info }}
          </p>
        </div>
      </div>

      <div class="release-box">
        <div class="release-box-left">
          <input
            @change="onFileSelected"
            type="file"
            id="upload"
            name="upload"
            accept="image/png, image/jpeg"
            hidden
          />
          <label class="btn-3 title-4" for="upload">Partager une photo</label>
          <div @click="createpost()">
            <div class="sending">
              <i class="send-icons fa-solid fa-paper-plane"></i>
            </div>
            <p class="send">Publier</p>
          </div>
        </div>
        <textarea
          class="title-4 release-text-area"
          name="release-text-area"
          id="relaseArea"
          placeholder="  Exprimez vous ici..."
        ></textarea>
      </div>
      <section class="fils">
        <!-- <Suspence> -->

        <post v-for="info of count.t">{{ info }}</post>
        <!-- </Suspence> -->
      </section>
    </main>

    <footer class="footer">
      <img src="../assets/imgs/icon-left-font.svg" alt="logo" />
      <p class="title">Bienvenue sur le reseau social d’entreprise</p>
    </footer>
  </section>
</template>

<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
@import "../assets/scss/fils.scss";
</style>

<style scoped lang="scss">
// scoped Scss
@import "../assets/scss/base.scss";
@import "../assets/scss/fils.scss";
.global-content {
  @include flex(column, wrap, none, space-between);
  background: var(--dark-blue);
  min-height: 100vh;
  min-width: 580px;
  // max-width: 2400px;
  .header {
    z-index: 3;
    position: fixed;
    @include flex(row, wrap, none, space-between);
    background: #ffffff;
    box-shadow: var(--text-shadow);
    border-radius: 0px 0px 30px 30px;
    overflow: hidden;
    width: 100%;
    height: 90px;
    padding-right: 50px;

    img {
      margin-left: 10px;
      position: relative;
      bottom: 130px;
      --logo-size: 350px;
      height: var(--logo-size);
      width: var(--logo-size);
    }
    .box {
      @include flex(row, nowrap, flex-start, center);
      height: 100px;
      width: 190px;
      margin: 25px 0px 0px 60px;
      text-transform: uppercase;
      text-align: center;
      font-size: 20px;

      .logout-box {
        width: 100%;
        .logout-icons {
          color: #b10b0b;
        }
        &:hover {
          cursor: pointer;
          @extend %btnScale;
        }
      }
      .profils-box {
        transform: translateY(-8px);
        padding: 7px;
        background: #e4e3e3;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
          inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 50%;
        &:hover {
          cursor: pointer;
          transform: scale(1.1) translateY(-8px);
          transition: transform 1s;
        }
      }
    }
    @media screen and (min-width: 560px) and (max-width: 660px) {
      @include flex(row, wrap, center, space-between);
      .box {
        margin: 25px 0px 0px 1px;
        position: fixed;
        right: 50px;
        top: 5px;
      }
    }
  }
  @media screen and (min-width: 0px) and (max-width: 560px) {
    .header img {
      --logo-size: 150px;
      bottom: 30px;
    }
    .header .box {
      margin: 25px 0px 0px 1px;
      position: fixed;
      right: 10px;
      top: 5px;
      font-size: 15px;
    }
  }

  .main-content {
    overflow-y: scroll;
    margin-top: 110px;
    height: 100%;
    @include flex(column, wrap, none, none);
    .info {
      @include flex(row, wrap, center, none);
      background: rgba(214, 50, 50, 0.75);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
        inset 0px 4px 4px rgba(240, 84, 84, 0.68);
      border-radius: 20px 5px;
      height: 110px;
      width: 98%;
      margin: 0 0px 15px 5px;
      .info-icons {
        color: #ffffff;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        font-size: 55px;
        margin: 10px;
      }

      .editbox {
        width: 85%;
        margin-left: 20px;
        textarea,
        p {
          padding: 10px 0 0 10px;
          height: 80px;
          width: calc(111% - 50px);
          border-radius: 20px;
          border: none;
        }
        p {
          background-color: #ffffff;
        }
        .edit-icons {
          position: absolute;
          left: 77px;
          color: black;
          &:hover {
            cursor: pointer;
            @extend %btnScale;
          }
        }
      }
    }

    .release-box {
      position: relative;
      @include flex(row, wrap, none, none);
      background: #ffffff;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      width: 98%;
      height: 150px;
      margin-left: 5px;
      .release-box-left {
        @include flex(column, nowrap, center, center);
        label {
          font-size: 15px;
          text-transform: capitalize;
        }
        .sending {
          background: rgba(97, 94, 94, 0.87);
          padding: 8px;
          border-radius: 50%;
          margin-top: 10px;
          .send-icons {
            transform: translateX(-2px);
            color: white;
            text-align: center;
            font-size: 25px;
          }
          &:hover {
            cursor: pointer;
            @extend %btnScale;
          }
        }
      }
      .release-text-area {
        background: #3380c7;
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        height: 130px;
        left: 125px;

        width: calc(98% - 123px);
        max-width: 100%;
        padding: 10px 5px;
        margin: 10px 5px;
        border: none;
        &::placeholder {
          font-size: 25px;
        }
      }
    }
    @media screen and (max-width: 630px) {
      .main-content {
        .editbox {
          width: 80%;
          margin-left: 20px;
        }
      }
    }
  }
  .footer {
    @include flex(row, wrap, space-between, center);
    background-color: var(--police);
    height: 30px;
    width: 100%;
    text-decoration: wavy;
    overflow: hidden;
    margin-top: 70px;
    img {
      position: relative;
      right: 70px;
      bottom: 60px;
      width: 150px;
    }
    p {
      max-height: 30px;
    }
  }
}
</style>
