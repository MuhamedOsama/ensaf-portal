<template>
  <div>
    <v-card
      color="grey lighten-4"
      class="mx-auto card pa-4 elevation-12"
      min-width="600px"
    >
      <v-card-title class="justify-center">
        <v-avatar color="blue" class="d-block">
          <v-img src="logo-grey-black.svg"></v-img>
        </v-avatar>
        <h2 class="ml-4">Ensaf</h2>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" auto>
          <v-text-field
            :rules="emailRules"
            aria-readonly="true"
            aria-autocomplete="none"
            label="Email"
            :name="`username_${Math.random()}`"
            prepend-icon="mdi-account"
            type="text"
            v-model="email"
          />
          <v-text-field
            aria-readonly="true"
            label="Password"
            :rules="passwordRules"
            :name="`password_${Math.random()}`"
            prepend-icon="mdi-lock"
            type="password"
            v-model="password"
          />
        </v-form>
        <v-row class="mt-2 ml-1">
          <p>
            New on our platform?
            <router-link to="/register" class="blue--text font-weight-bold"
              >Create an account</router-link
            >
          </p>
          <v-spacer></v-spacer>
          <p>
            <router-link to="/register" class="blue--text font-weight-bold"
              >Forgot Password?</router-link
            >
          </p>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!valid"
          large
          @click="TryLogin"
          elevation="0"
          text
          :loading="loading"
          >Login <v-icon class="ml-3">mdi-arrow-right</v-icon></v-btn
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
    email: "",
    terms: false,
    valid: false,
    emailErrors: [],
    emailRules: [
      (v) =>
        !!(v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
        "E-mail must be valid",
    ],
    passwordRules: [(v) => !!v || "Password is Required"],
    password: "",
    loading: false,
    snackbar: false,
    timeout: 1000,
  }),
  mounted() {},
  methods: {
    ...mapActions("auth", ["login"]),
    TryLogin() {
      this.loading = true;
      // Perform a simple validation that email and password have been typed in
      if (this.email != "" && this.password != "") {
        this.login({ email: this.email, password: this.password }).then((r) => {
          if (!r) {
            this.snackbar = true;
            this.loading = false;
          }
        });
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