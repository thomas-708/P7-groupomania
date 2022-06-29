<script setup>
import comment from "../compoment/comment.vue";
import fils from "../compoment/fils.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, reactive, inject, provide } from "vue";
const router = useRouter();
const route = useRoute();
// inject recupere des donner depuis le composant post
const ins = inject("coms");
//constante reactive permet de gerer les informations des utilisateurs dans les commentaire
const data = reactive({
  firstname: "",
  lastname: "",
  picture: "",
  text: "",
  owner: "",
  admin: "",
  postid: "",
  id: "",
});
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
//function de callback qui assigne les valeurs a la constante reactive
const calldata = () => {
  for (let datas of ins) {
    let com = datas.pop();
    data.text = com.text;
    data.postid = com.postid;
    data.id = com._id;

    getUserData(com.owner)
      .then((result) => {
        data.firstname = result.data.firstname;
        data.lastname = result.data.lastname;
        data.avatarsrc = result.data.avatarsrc;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
calldata();
//recupere les donner des utilisateur
async function getUserData(id) {
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
//permet la suppression des des commentaire
async function deleteCom() {
  const reponse = await axios
    .delete("http://localhost:3000/api/com/deleteCom/" + data.id, {
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
</script>

<template>
  <div class="com">
    <section class="global-com-content">
      <div class="userPicture">
        <img :src="data.avatarsrc" alt="photo de l'utilisateur" />
      </div>

      <div class="comment-global">
        <div class="haut">
          <div class="group-name">
            <p class="name">{{ data.firstname }}</p>
            <p class="name">{{ data.lastname }}</p>
          </div>
          <div @click="deleteCom()">
            <i class="delete-icons icons fa-solid fa-trash"></i>
          </div>
        </div>
        <div class="comment-content-text">
          <p class="comment">{{ data.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
</style>

<style scoped lang="scss">
// scoped Scss
@import "../assets/scss/base.scss";
.com {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  // align-items:flex-start;
  gap: 10px;
  background-color: var(--police);
  margin-top: 15px;
  border-radius: 20px;
  margin-bottom: 5px;
  min-height: 90px;
  overflow: hidden;

  .global-com-content {
    @include flex(row, nowrap, flex-start, space-between);

    .userPicture {
      @include flex(row, nowrap, center, center);
      width: 15%;
      height: 90px;
      background-color: var(--light-blue);
      margin-right: 10px;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 2px solid #fff;
        object-fit: cover;
      }
    }

    .comment-global {
      @include flex(column, nowrap, flex-start, center);
      width: 100%;
      max-height: 90px;
      .haut {
        padding: 5px 15px 5px 5px;
        box-shadow: 1px 2px 6px rgba(52, 48, 48, 0.708);
        width: 100%;
        @include flex(row, nowrap, flex-start, space-between);
        .group-name {
          @include flex(row, nowrap, flex-start, space-between);
          .name {
            padding-left: 10px;
          }
        }
        .delete-icons {
          font-size: 18px;
          &:hover {
            cursor: pointer;
            @extend %btnScale;
          }
        }
      }
      .comment-content-text {
        margin: 7px 0px;
        font-size: 12px;
        overflow-y: scroll;
        padding-right: 15px;
        width: 100%;
      }
    }
  }
}
</style>
