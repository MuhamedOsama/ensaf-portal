<template>
  <div>
    <v-card
      flat
      color="grey lighten-4"
      class="mx-auto card pa-4 elevation-12"
      min-width="600px"
    >
      <v-card-title v-if="stepper == 1" class="justify-center">
        <v-avatar color="blue" class="d-block">
          <v-img src="logo-grey-black.svg"></v-img>
        </v-avatar>
        <h2 class="ml-4">Ensaf</h2>
      </v-card-title>
      <v-card-text>
        <v-stepper v-model="stepper" color="grey lighten-4">
          <v-stepper-items>
            <v-stepper-content step="1" class="grey lighten-4">
              <v-form v-model="valid" auto class="grey lighten-4">
                <v-text-field
                  :rules="requiredRules"
                  aria-autocomplete="none"
                  label="Name"
                  :name="`name${Math.random()}`"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="registration.name"
                />
                <v-text-field
                  :rules="emailRules"
                  aria-autocomplete="none"
                  label="Email"
                  :name="`name_${Math.random()}`"
                  prepend-icon="mdi-email"
                  type="text"
                  v-model="registration.email"
                />
                <v-text-field
                  label="Password"
                  :rules="[!!registration.password || 'Type a Password']"
                  :name="`password_${Math.random()}`"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="registration.password"
                />
                <v-text-field
                  label="Confirm Password"
                  :rules="[
                    registration.confirmPassword === registration.password ||
                      'Passwords Do not match',
                  ]"
                  :name="`confirm_password_${Math.random()}`"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="registration.confirmPassword"
                />
                <v-select
                  :items="registerTypes"
                  label="Registration Type"
                  :rules="registerRules"
                  :name="`register_type_${Math.random()}`"
                  prepend-icon="mdi-lock"
                  v-model="registration.userType"
                />
              </v-form>
              <p>
                Already have an account?
                <router-link to="/login" class="blue--text font-weight-bold"
                  >sign in instead</router-link
                >
              </p>
            </v-stepper-content>
            <v-stepper-content step="2" class="grey lighten-4">
              <h2 class="font-weight-light">
                Please Complete This Information.
              </h2>
              <v-card-text>
                <v-form v-model="commissionerInfo" auto class="grey lighten-4">
                  <v-select
                    :rules="requiredRules"
                    aria-autocomplete="none"
                    label="Identification"
                    @change="resetIdentification(registration.idType)"
                    :name="`username_${Math.random()}`"
                    prepend-icon="mdi-identifier"
                    type="text"
                    v-model="registration.idType"
                    :items="identificationTypes"
                  />

                  <v-slide-y-transition mode="out-in" hide-on-leave>
                    <v-text-field
                      v-if="registration.idType == 1"
                      label="KsA Id Number"
                      :rules="requiredRules"
                      :name="`KsA_${Math.random()}`"
                      prepend-icon="mdi-numeric"
                      v-model="registration.IdNumber"
                    />
                  </v-slide-y-transition>
                  <v-slide-y-transition mode="out-in" hide-on-leave>
                    <v-text-field
                      v-if="registration.idType == 2"
                      label="Iqama Id Number"
                      :rules="requiredRules"
                      :name="`Iqama${Math.random()}`"
                      prepend-icon="mdi-numeric"
                      v-model="registration.Iqama"
                    />
                  </v-slide-y-transition>
                  <v-slide-y-transition mode="out-in" hide-on-leave>
                    <v-text-field
                      v-if="registration.idType == 3"
                      label="Passport Id Number"
                      :rules="requiredRules"
                      :name="`passport${Math.random()}`"
                      prepend-icon="mdi-numeric"
                      v-model="registration.PassportNumber"
                    />
                  </v-slide-y-transition>
                  <v-fade-transition>
                    <v-text-field
                      v-if="registration.userType == 2"
                      label="Liscense Number"
                      :rules="requiredRules"
                      :name="`liscense${Math.random()}`"
                      prepend-icon="mdi-information"
                      v-model="registration.LiscenseNumber"
                    />
                  </v-fade-transition>
                  <v-fade-transition>
                    <v-text-field
                      v-if="registration.userType == 2"
                      label="Office Name"
                      :rules="requiredRules"
                      :name="`Office${Math.random()}`"
                      prepend-icon="mdi-information"
                      v-model="registration.OfficeName"
                    />
                  </v-fade-transition>
                  <v-fade-transition>
                    <v-text-field
                      v-if="registration.userType == 2"
                      label="Office Address"
                      :rules="requiredRules"
                      :name="`Address${Math.random()}`"
                      prepend-icon="mdi-information"
                      v-model="registration.OfficeAddress"
                    />
                  </v-fade-transition>

                  <v-checkbox
                    v-model="registration.acceptTerms"
                    label="I agree to privacy & policy terms."
                  ></v-checkbox>
                </v-form>
              </v-card-text>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="stepper == 2"
          large
          @click="stepper = stepper - 1"
          elevation="0"
          text
          :loading="loading"
          >Back <v-icon class="ml-3">mdi-arrow-left</v-icon></v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          v-if="stepper == 1"
          large
          @click="stepper = stepper + 1"
          elevation="0"
          text
          :loading="loading"
          :disabled="!valid"
          >Continue <v-icon class="ml-3">mdi-arrow-right</v-icon></v-btn
        >
        <v-btn
          v-if="stepper == 2"
          large
          @click="tryRegister"
          elevation="0"
          text
          :disabled="!valid || !registration.acceptTerms || !commissionerInfo"
          :loading="loading"
          >Register <v-icon class="ml-3">mdi-arrow-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      Wrong Email or Password
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "login",
  data: () => ({
    identificationTypes: [
      { text: "KsA", value: 1 },
      { text: "Iqama", value: 2 },

      { text: "Passport", value: 3 },
    ],

    requiredRules: [(v) => !!v || "Field Required"],

    stepper: 1,
    acceptTerms: false,

    valid: false,
    commissionerInfo: false,
    registerTypes: [
      { text: "Normal", value: 1 },
      { text: "Commissioner", value: 2 },
    ],
    emailErrors: [],
    emailRules: [
      (v) =>
        !!(v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
        "E-mail must be valid",
    ],
    registerRules: [(v) => !!v || "Register Type is Required"],
    passwordRules: [(v) => !!(v && v.length >= 4) || "Password is Required"],
    confirmPasswordRules: [
      (v) => !!v || "type confirm password",
      (v) => v === this.password || "The password confirmation does not match.",
    ],

    loading: false,
    snackbar: false,
    timeout: 1000,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Normal",
    idType: 0,
    IdNumber: "",
    Iqama: "",
    PassportNumber: "",
    LiscenseNumber: "",
    OfficeName: "",
    OfficeAddress: "",
    registration: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "Normal",
      idType: 0,
      PassportNumber: undefined,
      IdNumber: undefined,
      Iqama: undefined,
      LiscenseNumber: undefined,
      OfficeName: undefined,
      OfficeAddress: undefined,
    },
  }),
  mounted() {},
  methods: {
    ...mapActions("auth", ["register"]),
    tryRegister() {
      this.loading = true;
      // Perform a simple validation that email and password have been typed in
      this.register(this.registration).then((r) => {
        if (!r) {
          this.snackbar = true;
          this.loading = false;
        }
      });
    },
    resetIdentification(idType) {
      if (idType == 1) {
        (this.registration.Iqama = undefined),
          (this.registration.PassportNumber = undefined);
      }
      if (idType == 2) {
        (this.registration.IdNumber = undefined),
          (this.registration.PassportNumber = undefined);
      }
      if (idType == 3) {
        (this.registration.Iqama = undefined),
          (this.registration.IdNumber = undefined);
      }
    },
    resetUserType(userType) {
      if (userType == 1) {
        this.registration.LiscenseNumber = undefined;
        this.registration.OfficeName = undefined;
        this.registration.OfficeAddress = undefined;
      }
    },
  },
  computed: {
    ...mapGetters("auth", [
      "authenticating",
      "authenticationError",
      "authenticationErrorCode",
      "authenticationSuccess",
    ]),
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>