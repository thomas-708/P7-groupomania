<script setup>
import comment from "../compoment/comment.vue";
import fils from "../compoment/fils.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, reactive, inject, provide } from "vue";

const router = useRouter();
const route = useRoute();
const ins = inject("datas"); // inject permet de recuper les donner depuis fils

const data = reactive({
  // constante reactive permet de gere la redifusion des donner dans le composant
  allpost: {},
  like: 0,
  isliked: false,
  isOwner: false,
  admin: false,
  firstname: "",
  lastname: "",
  bio: "",
  avatarsrc: "",
  editmode: false,
  allcom: 0,
  comdata: [],
  openprofils: false,
});
//function de callback qui assigne les valeurs a la constante reactive
const calldata = () => {
  for (let datas of ins) {
    data.allpost = datas.pop();
    data.like = data.allpost.likes;
    data.isliked = data.allpost.usersLiked.includes(
      localStorage.getItem("userId")
    )
      ? true
      : false;
    data.isOwner =
      data.allpost.owner == localStorage.getItem("userId") ? true : false;
    //fonction qui recupere les donner de l'utilisateur qui a realiser un post
    getUserData(data.allpost.owner)
      .then((result) => {
        data.firstname = result.data.firstname;
        data.lastname = result.data.lastname;
        data.bio = result.data.bio;
        data.avatarsrc = result.data.avatarsrc;
      })
      .catch((err) => {
        console.log(err);
      });
    //function qui verifie si l'utilisateur etait admin
    getUserData(localStorage.getItem("userId"))
      .then((result) => {
        if (result.data.isAdmin) data.admin = true;
        else data.admin = false;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
calldata();
apiGetAllcom();

provide("coms", data.comdata); // provinde permet d'envoyer les infos pour les commentaire

let selectedFile = "";

function onFileSelected(event) {
  selectedFile = event.target.files[0]; // gere l'importation des fichiers depuis les inputs
}

function dataformat() {
  //function qui gere la creation des dates
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  let hours = " " + today.getHours() + "h " + today.getMinutes();
  let date = today.toLocaleDateString();
  return date + hours;
}

function forceRerender() {
  //permet de faire un rendu des page quand la function est appler
  toProfilsPage();
  const int = setTimeout(() => {
    tofilsPage();
    clearTimeout(int);
  }, 1);
}

function toProfilsPage() {
  const id = route.params.userId;
  router.push(`/profils/${id}`);
}

function tofilsPage() {
  const id = route.params.userId;
  router.push(`/fils/${id}`);
}

function Effect(Elms) {
  const enrModal = document.querySelector(`${Elms}`); //permet l'animation des likes
  enrModal?.classList.toggle("selected");
}

function imgscaling(id) {
  const img = document.querySelector(`.fils-post-img${id}`); //permet de faire le scaling sur les images
  img?.classList.toggle("scalling");
}
function Commentappar(id) {
  const globalCom = document.querySelector(`#global-com${id}`); // permet de gere l'appartion des images
  globalCom.classList.toggle("displayNone");
}

async function like() {
  //function permetant de like ou unlike un post
  Effect(`#like-button-${data.allpost._id}`);
  if (
    document
      .querySelector(`#like-button-${data.allpost._id}`)
      .classList.contains("selected")
  ) {
    data.isliked = true;
    data.like = data.like + 1;
  } else {
    data.isliked = false;
    data.like = data.like - 1;
  }

  const likesdata = {
    like: data.like,
    usersLiked: localStorage.getItem("userId"),
  };

  if (data.like < 0) data.like = 0;
  const reponse = await axios
    .post(
      "http://localhost:3000/api/post/" + data.allpost._id + "/like/",
      likesdata,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {})
    .catch((err) => {
      console.log(err);
    });
}

async function getUserData(id) {
  //function qui permet la gestions des donner des utilisateur quand elle est appler avec un ID
  const reponse = await axios
    .get("http://localhost:3000/api/user/getId/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      return await result;
    })
    .catch((err) => {
      console.log(err);
    });
  return await reponse;
}

async function deletePost() {
  // permet de supprimer un poste
  const reponse = await axios
    .delete("http://localhost:3000/api/post/delpost/" + data.allpost._id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      if (result.status === 200) {
        alert(result.data.message);
        forceRerender();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function modifyPost() {
  //permet de modifier un poste
  const modifyPost = {
    text: document.querySelector("#user-textarea").value,
    lastupdate: dataformat(),
  };

  let image = selectedFile;
  const formData = new FormData();
  formData.append("post", JSON.stringify(modifyPost));
  formData.append("image", image);

  const reponse = await axios
    .put(
      "http://localhost:3000/api/post/modifyPost/" + data.allpost._id,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {
      if (result.status === 200) {
        data.editmode = false;
        alert(result.data.message);
        forceRerender();
      }
      if (result.status === 400) {
        alert(result.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function apiGetAllcom() {
  // recupere les commentaire lié a un poste
  const getInfo = await axios
    .get("http://localhost:3000/api/com/getAllComPost/" + data.allpost._id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      data.allcom = result.data.length;
      data.comdata.push(result.data);
    });
}

async function createcom() {
  // permet la creation d'un commentaire

  const comObj = {
    owner: localStorage.getItem("userId"),
    postid: data.allpost._id,
    text: document.querySelector(`#user-comment-input${data.allpost._id}`)
      .value,
    CreatedAt: dataformat(Date.now()),
  };

  const reponse = await axios
    .post("http://localhost:3000/api/com/create", comObj, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(async (result) => {
      if (result.status === 200) {
        alert(result.data.message);
        forceRerender();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function terminateAcount() {
  //permet de bannir un utilisateur si on ai admin
  let isactive = { active: false };
  const reponse = await axios
    .put(
      "http://localhost:3000/api/user/turnOff/" + data.allpost.owner,
      isactive,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then(async (result) => {
      if (result.status === 200) {
        alert("l'utilisateur a etait Banni");
      }
    })
    .catch((err) => {
      if (err.response.status === 403) alert(err.response.data.error);
      console.log(err);
    });
}
</script>
<template>
  <div class="fils-post" :id="data.allpost._id">
    <div class="fils-post-content">
      <section class="fils-rows">
        <div class="fils-post-header">
          <p class="title" id="PostDate">
            {{
              data.allpost.lastupdate
                ? data.allpost.lastupdate + " (Modifier)"
                : data.allpost.CreatedAt
            }}
          </p>
          <div class="fils-post-user-infos">
            <div @click="data.openprofils = true">
              <i class="cart_icons icons fa-solid fa-id-card"></i>
            </div>
            <p class="fils-post-user-firstname title-4">{{ data.firstname }}</p>
            <p class="fils-post-user-lastname title-4">{{ data.lastname }}</p>
          </div>
          <div class="fils-post-i">
            <div
              @click="data.editmode = true"
              :class="{ disActive: !data.isOwner }"
            >
              <i class="edit-icons icons fa-solid fa-pen-to-square"></i>
            </div>
            <div
              @click="deletePost()"
              :class="{ disActive: !data.isOwner && !data.admin }"
            >
              <i class="delete-icons icons fa-solid fa-trash"></i>
            </div>
          </div>
        </div>
        <section
          class="modale-profiles"
          id="modal-profiles"
          :class="{ disActive: data.openprofils == false }"
        >
          <div class="modal-profiles-content">
            <div class="modal-left">
              <div class="modal-user-up">
                <img :src="data.avatarsrc" alt="user picture" />
              </div>
              <div
                @click="terminateAcount()"
                class="modal-user-back"
                :class="{ disActive: !data.admin }"
              >
                <i class="fa-solid fa-ban"></i>
                <p>Bannir</p>
              </div>
            </div>
            <div class="modal-right">
              <div class="namesAndQuit">
                <p class="names">{{ data.firstname }} {{ data.lastname }}</p>
                <div @click="data.openprofils = false" class="close" id="close">
                  X
                </div>
              </div>
              <p class="bio">
                {{ data.bio }}
              </p>
            </div>
          </div>
        </section>
        <div class="fils-post-main">
          <img
            @click="imgscaling(data.allpost._id)"
            :class="`fils-post-img${data.allpost._id}`"
            :src="data.allpost.picture"
            alt="Userimage"
            :hidden="data.editmode"
          />
          <input
            @change="onFileSelected"
            type="file"
            id="modifyupload"
            name="modifyupload"
            accept="image/png, image/jpeg"
            hidden
          />
          <label
            class="btn-3 title-4"
            for="modifyupload"
            :hidden="!data.editmode"
            >Partager une photo</label
          >

          <textarea
            @keydown.enter.exact.prevent="modifyPost()"
            id="user-textarea"
            class="title-4 user-text"
            placeholder="  Exprimez vous ici...  -Appuyez sur Entrée pour publier"
            :hidden="!data.editmode"
          ></textarea>
          <p id="user-text" class="user-text" :hidden="data.editmode">
            {{ data.allpost.text }}
          </p>
        </div>
      </section>

      <div class="fils-user-interact">
        <div class="fils-post-like">
          <button
            @click="like()"
            class="like-button"
            :class="{ selected: data.isliked }"
            type="button"
            :id="`like-button-${data.allpost._id}`"
          >
            <svg
              class="heart-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <path
                d="M91.6 13A28.7 28.7 0 0 0 51 13l-1 1-1-1A28.7 28.7 0 0 0 8.4 53.8l1 1L50 95.3l40.5-40.6 1-1a28.6 28.6 0 0 0 0-40.6z"
              />
            </svg>
            <p>Like</p>
            <p class="like-counter">{{ data.like }}</p>
          </button>
        </div>
        <div class="fils-post-comment">
          <button
            @click="Commentappar(data.allpost._id)"
            class="com-button"
            type="button"
          >
            <i class="fa-solid fa-comment"></i>
            <p>Commentaire</p>
          </button>
        </div>
      </div>
    </div>
    <div :id="`global-com${data.allpost._id}`" class="displayNone global-com">
      <div class="fils-com">
        <div class="comment-content">
          <!-- <comment/> -->
          <comment v-for="com of data.allcom">{{ com }}</comment>
        </div>
      </div>
      <div class="user-comment-content">
        <input
          @keydown.enter.exact.prevent="createcom(), forceRerender()"
          class="user-comment-input"
          type="text"
          name="user-comment-input"
          :id="`user-comment-input${data.allpost._id}`"
          placeholder="Ecrire un commentaire..."
        />
        <p class="info-post">
          Appuyez sur Entrée pour publier votre commentaire.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
@import "../assets/scss/fils.scss";
.displayNone {
  display: none !important;
}
</style>

<style scoped lang="scss">
// scoped Scss
@import "../assets/scss/base.scss";
@import "../assets/scss/fils.scss";
#modal-profiles {
  @include flex(column, nowrap, center, center);
  background-color: var(--primary-color);
  width: 25%;
  height: 200px;
  min-height: 180px;
  min-width: 340px;
  padding: 10px 1px;
  border-radius: 20px;
  position: absolute;
  left: 20%;
  .modal-profiles-content {
    @include flex(row, wrap, flex-start, flex-start);
    background-color: var(--police);
    width: 95%;
    height: 100%;
    border-radius: 20px;
    .modal-left {
      @include flex(column, nowrap, flex-start, flex-start);
      margin: 5px 10px 0 7px;
      .modal-user-up {
        @include flex(column, wrap, center, center);
        background-color: var(--light-blue);
        height: 90px;
        width: 70px;
        border-radius: 20px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
          inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        img {
          background-color: var(--police);
          height: 50px;
          width: 50px;
          margin-left: 2px;
          border: 1px solid #000000;
          border-radius: 50%;
        }
      }
      .modal-user-back {
        background-color: var(--primary-color);
        color: var(--police);
        padding: 10px;
        margin-top: 5px;
        text-align: center;
        border-radius: 15px;
        &:hover {
          cursor: pointer;
          @extend %btnScale;
        }
      }
    }
    .modal-right {
      @include flex(column, nowrap, center, center);
      gap: 10px;
      margin: 5px 0px 5px 0px;
      height: 92%;
      //  padding:10px;
      width: 70%;
      .namesAndQuit {
        @include flex(column, nowrap, center, center);
        width: 100%;
        .names {
          @include flex(column, nowrap, flex-start, flex-start);
          width: 100%;
          height: 20px;

          background-color: rgba(149, 146, 146, 0.69);
          border-radius: 10px;
          color: black;
          padding: 0px 0px 0px 5px;
          overflow-wrap: break-word;
        }
      }
      .bio {
        margin-top: 5px;
        width: 100%;
        height: 100px;
        background-color: rgba(149, 146, 146, 0.69);
        border-radius: 10px;
        color: black;
        overflow-wrap: break-word;
        overflow-y: scroll;
        padding: 5px;
      }
    }
  }
}
</style>
