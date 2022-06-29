<script setup>
import { useField, useForm } from "vee-validate";
import { z } from "zod";
import { toFieldValidator, toFormValidator } from "@vee-validate/zod";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import axios from "axios";
import { reactive, ref } from "vue";

const router = useRouter();
const route = useRoute();
//variable reactive permet d'afficher un message d'erreur
let enrError = reactive({
  message: "",
});
// constante regex verifie la conformiter du password
const passwordRegexp = z
  .string({ required_error: "Veuillez renseigner ce champ" })
  .regex(new RegExp(".*[A-Z].*"), "une majuscule")
  .regex(new RegExp(".*[a-z].*"), "une majuscule")
  .regex(new RegExp(".*\\d.*"), "un chiffre")
  .regex(
    new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
    "un caractere special"
  )
  .nonempty(" ce champs de peut être vide")
  .min(8, "le mots de passe doit contenir 8 caractere ");

//permet d'afficher les modal
function openSignModal(Elms) {
  const Lc = document.querySelector(".login-content");
  const enrModal = document.querySelector(`#${Elms}`);
  enrModal?.classList.toggle("disActive");
  enrModal?.classList.toggle("active");
  Lc?.classList.toggle("disActive");
}
//constante de validation du formulaire
const validationSchema = z.object({
  email: z
    .string({ required_error: "Veuillez renseigner ce champ" })
    .min(4, { message: "l'email saisie est trop court ! " })
    .max(100, { message: "l'email saisie est trop long" })
    .email({ message: "veuillez saisir un email valide" })
    .nonempty({ message: "ce champs de peut être vide" })
    .regex(new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/), {
      message: "l'email saisie n'ai pas correct",
    }),
  password: passwordRegexp,
  firstname: z
    .string({ required_error: "Veuillez renseigner ce champ" })
    .min(4, { message: "vous devez saisir 4 caractere minimum" })
    .max(20, { message: "vous devez saisir 20 caractere maximum" })
    .nonempty({ message: "ce champs de peut être vide" }),
  lastname: z
    .string({ required_error: "Veuillez renseigner ce champ" })
    .min(4, { message: "vous devez saisir 4 caractere minimum" })
    .max(20, { message: "vous devez saisir 20 caractere maximum" })
    .nonempty({ message: "ce champs de peut être vide" }),
});

//permet l'utilisation des formulaire
const { handleSubmit, resetForm: enrResetForm } = useForm({
  validationSchema: toFormValidator(validationSchema),
});
// gere  l'utilisation des champs de formulaire
const {
  meta: Emeta,
  value: emailValue,
  errorMessage: emailerror,
  handleChange: Emailhc,
  handleBlur: Emailhb,
} = useField("email", null, { validateOnValueUpdate: false });
const {
  meta: Pmeta,
  value: passwordValue,
  errorMessage: passworderror,
  handleChange: pswhc,
  handleBlur: pswhb,
} = useField("password", null, { validateOnValueUpdate: false });
const {
  meta: Fmeta,
  value: firstnameValue,
  errorMessage: firstnameerror,
  handleChange: fnhc,
  handleBlur: fnhb,
} = useField("firstname", null, { validateOnValueUpdate: false });
const {
  meta: Lmeta,
  value: lastnameValue,
  errorMessage: lastnameerror,
  handleChange: lnhc,
  handleBlur: lnhb,
} = useField("lastname", null, { validateOnValueUpdate: false });
// function qui gere l'enregistrement des utilisateur
const onsaveuser = handleSubmit(async (values) => {
  try {
    const response = await fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(values),
    })
      .then(async (result) => {
        const data = await result.json();

        if (result.status === 201) {
          enrResetForm();
          openSignModal("Enr");
          openSignModal("Cnr");
        }
        console.log(result);
        if (result.status === 400) {
          enrError.message = "Cette email est deja enregistrée";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});
// validation du formulaire
const validationSchemaCox = z.object({
  emailCox: z.string({ required_error: "Veuillez renseigner ce champ" }),
  passwordCox: z.string({ required_error: "Veuillez renseigner ce champ" }),
});
// gere  l'utilisation des champs de formulaire
const { handleSubmit: coxSub, resetForm: coxResetForm } = useForm({
  validationSchema: toFormValidator(validationSchemaCox),
});
const {
  meta: ECmeta,
  value: emailValueCox,
  errorMessage: ECerror,
  handleChange: Ec,
  handleBlur: Eb,
} = useField("emailCox", null, { validateOnValueUpdate: false });
const {
  meta: PCmeta,
  value: passwordValueCox,
  errorMessage: PCerror,
  handleChange: Pc,
  handleBlur: Pb,
} = useField("passwordCox", null, { validateOnValueUpdate: false });
//function qui gere la connextion des utilsateur
const onconnect = coxSub(async (values) => {
  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(values),
  }).then(async (result) => {
    const Data = await result.json();
    const errorText = document.querySelector("#modal-subtext-cox");
    console.log(Data);

    if (result.status == 401) {
      errorText.innerHTML = Data.error;
    }

    if (result.status === 403) {
      errorText.innerHTML = Data.error;
      if (Data.activeacount == false) {
        router.push("/erreur/403");
      }
    }
    if (result.status === 200) {
      console.log("Connectée!");
      localStorage.setItem("token", Data.token);
      localStorage.setItem("userId", Data.userId);
      coxResetForm();

      errorText.classList.remove("error");
      errorText.classList.add("ok");
      errorText.innerHTML = "Connexion effectuer";

      if (localStorage.getItem("token")) {
        router.push(`/fils/${Data.userId}`);
      }
    }
  });
});
</script>

<template>
  <router-view></router-view>
  <section class="global-content">
    <div class="haut">
      <img
        src="../assets/imgs/icon-left-font-monochrome-white.svg"
        alt="logo"
      />
      <p class="title">Bienvenue sur le reseau social d’entreprise</p>
    </div>

    <div class="center">
      <div class="circle">
        <img src="../assets/imgs/icon-left-font-monochrome-white.svg" alt="" />
      </div>

      <section class="modal-content disActive" id="Enr">
        <div @click="openSignModal(`Enr`)" class="close" id="close">X</div>

        <div class="modal-singin">
          <img src="../assets/imgs/icon-left-font.svg" alt="logo" />
          <p class="modal-title">Enregistrement</p>
        </div>

        <div class="modal-form">
          <div class="modal-input">
            <form @submit="onsaveuser">
              <h4 class="modal-info">Email*</h4>

              <input
                @blur="Emailhc"
                @focus="Emailhb"
                v-model="emailValue"
                :class="{
                  inputError: Emeta.touched && !Emeta.valid && Emeta.validated,
                }"
                class="input"
                type="email"
              />

              <h4 class="modal-info">Mots de passe*</h4>

              <input
                @blur="pswhc"
                @focus="pswhb"
                v-model="passwordValue"
                :class="{
                  inputError: Pmeta.touched && !Pmeta.valid && Pmeta.validated,
                }"
                class="input"
                type="password"
              />

              <h4 class="modal-info">Prenom*</h4>

              <input
                @blur="fnhc"
                @focus="fnhb"
                v-model="firstnameValue"
                :class="{
                  inputError: Fmeta.touched && !Fmeta.valid && Fmeta.validated,
                }"
                class="input"
                type="text"
              />

              <h4 class="modal-info">Nom*</h4>

              <input
                @blur="lnhc"
                @focus="lnhb"
                v-model="lastnameValue"
                :class="{
                  inputError: Lmeta.touched && !Lmeta.valid && Lmeta.validated,
                }"
                class="input"
                type="text"
              />

              <div class="modal-confirmation">
                <p
                  v-if="
                    enrError.message ||
                    emailerror ||
                    passworderror ||
                    firstnameerror ||
                    lastnameerror
                  "
                  class="error"
                  id="modal-subtext-enr"
                >
                  {{
                    enrError.message ||
                    emailerror ||
                    passworderror ||
                    firstnameerror ||
                    lastnameerror
                  }}
                </p>
                <p class="modal-info">*Champs obligatoires</p>
                <button type="submit" class="btn-2" id="singup">
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section class="modal-content disActive" id="Cox">
        <div @click="openSignModal(`Cox`)" class="close" id="close">X</div>
        <div class="modal-singin">
          <img src="../assets/imgs/icon-left-font.svg" alt="logo" />
          <p class="modal-title">Connexion</p>
        </div>
        <div class="modal-form">
          <form @submit="onconnect">
            <div class="modal-input">
              <h4 class="modal-info">Email*</h4>

              <input
                @blur="Ec"
                @focus="Eb"
                v-model="emailValueCox"
                :class="{
                  inputError:
                    ECmeta.touched && !ECmeta.valid && ECmeta.validated,
                }"
                type="email"
              />

              <h4 class="modal-info">Mots de passe*</h4>

              <input
                @blur="Pc"
                @focus="Pb"
                v-model="passwordValueCox"
                :class="{
                  inputError:
                    PCmeta.touched && !PCmeta.valid && PCmeta.validated,
                }"
                type="password"
              />
            </div>

            <div class="modal-confirmation">
              <p class="error" id="modal-subtext-cox"></p>
              <p class="modal-info">*Champs obligatoires</p>
              <button type="submit" class="btn-2" id="connect">
                Connecter
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="modal-content disActive" id="Cnr">
        <div @click="openSignModal(`Cnr`)" class="close" id="close">X</div>
        <div class="modal-confirm">
          <img src="../assets/imgs/icon-left-font.svg" alt="logo" />

          <p class="modal-title">
            <i class="check-icons fa-solid fa-circle-check"></i>Utilisateur
            creer
          </p>
        </div>
      </section>
    </div>

    <div class="bas">
      <div class="login-content">
        <button @click="openSignModal(`Cox`)" class="btn login">
          Connexion
        </button>
        <button @click="openSignModal(`Enr`)" class="btn signin">
          Créer un compte
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
// global Scss
@import "../assets/scss/base.scss";
</style>

<style scoped lang="scss">
// scoped Scss
@import "../assets/scss/base.scss";
.global-content {
  z-index: 1;
  @include flex(column, nowrap, center, center);
  background-color: var(--transition-color);
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  .haut {
    @include flex(column, nowrap, center, center);
    height: 49vh;
    width: 100%;
    background-color: var(--primary-color);
    text-align: center;
    text-shadow: var(--text-shadow);
  }
  .center {
    position: absolute;
    @include flex(column, wrap, center, center);
    .circle {
      overflow: hidden;
      @include flex(row, nowrap, center, flex-start);
      --size: 160px;
      border-radius: 50%;
      height: var(--size);
      width: var(--size);
      background-color: var(--transition-color);

      img {
        width: 900px;
        height: 900px;
        margin-left: 6px;
      }
    }
    .modal-content {
      &#Cox {
        height: 300px;
      }
      &#Cnr {
        height: 100px;
        text-transform: uppercase;
        animation: appar 300ms forwards;

        .modal-title {
          display: flex;
          gap: 12px;
          color: var(--ok);
          font-weight: bold;
          transform: translateX(-37px);
          margin-top: 10px;
        }
        .check-icons {
          animation: cercle 800ms forwards;
          font-size: 30px;
        }
      }
      background-color: white;
      @include flex(row, wrap, flex-start, flex-start);
      overflow: hidden;
      border: 0.3px solid #000000;

      width: 300px;
      border-radius: 20px;
      position: absolute;
      img {
        position: relative;
        top: -70px;
        left: 25px;
        width: 200px;
      }
      .modal-title {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        font-family: "Noto Music", sans-serif;
        position: absolute;
        top: 40px;
        left: 90px;
      }
      .modal-form {
        z-index: 2;
        height: 200px;
        width: 200px;
        position: relative;
        bottom: 130px;
        left: 40px;
        .modal-info {
          font-family: "Noto Music", sans-serif;
          padding: 5px 0 0 0;
          font-size: 12px;
        }
        .modal-input input {
          padding-left: 10px;
          border-radius: 10px;
          border: 1px solid #ffffff00;
          width: 100%;
          height: 25px;
          background: #c4c4c4;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
            inset 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
        }
      }
    }
  }
  .bas {
    margin-top: 15px;
    height: 50vh;
    width: 100%;
    background-color: var(--light-blue);
    @include flex(column, nowrap, center, center);

    .login-content {
      @include flex(column, nowrap, center, center);
      background: rgba(196, 196, 196, 0.72);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 30px 5px;
      height: 30%;
      width: 290px;
      margin-top: 55px;
      @media screen and (max-width: 1600px) {
        height: 45%;
      }
      @media screen and (min-width: 320px) and (max-width: 1600px) {
        height: 35%;
      }
    }

    .login,
    .signin {
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
}
</style>
