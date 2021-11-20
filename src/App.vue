<template>
  <v-app id="inspire">
    <v-app-bar app color="gray" v-if="loggedIn" flat>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>
        <h2 class="text-gray mr-4">Ensaf</h2>

        <v-btn v-for="link in links" :key="link" text>
          {{ link }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :to="routeAction"
          color="blue-grey darken-2"
          dark
          elevation="2"
          >{{
            inRole("Commissioner") ? "Create A Project" : "Submit A Claim"
          }}</v-btn
        >
        <v-btn text class="ml-2" @click="logout">Logout</v-btn>

        <!-- <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
          ></v-text-field>
        </v-responsive> -->
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-fade-transition mode="out-in" hide-on-leave>
            <router-view></router-view>
          </v-fade-transition>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
//import { mapGetters, mapActions } from "vuex";
import ApiService from "./services/api.service";
import { mapGetters, mapActions } from "vuex";
import jsonToFormData from "@ajoelp/json-to-formdata";
import axios from "axios";
export default {
  name: "App",

  mounted() {},

  data: () => ({
    mode: "dark",
    snackbar: false,
    valid: false,
    links: ["Home", "Messages", "Profile", "Updates"],
    actionLink: { text: "Submit a claim", value: "/submitTicket" },
    drawer: null,
    user: {},
    loading: false,
    notificationsMenu: false,
    customNotificationDialog: false,
    // for custom notifications
    customNotification: {
      title: null,
      description: null,
      image: null,
      account: null,
      link: null,
    },
    requiredRules: [(v) => !!v || "field is required"],
    addFileRules: [
      (v) => {
        if (v instanceof File) {
          return (
            !v ||
            v.size < 1000000 ||
            "file required and size should be less than 1 MB!"
          );
        } else {
          return "file required";
        }
      },
    ],
    //
    cruds: [
      ["Target Audience", "mdi-update"],
      ["Delete", "mdi-delete"],
    ],
    items: [
      {
        icon: "mdi-book-open",
        text: "Courses",
        route: "/courses",
      },
      {
        icon: "mdi-magnify",
        text: "Lookups",
        hierarchical: true,
        children: [
          {
            icon: "mdi-view-grid",
            text: "Categories",
            route: "/categories",
          },
          {
            icon: "mdi-view-grid-outline",
            text: "SubCategories",
            route: "/subcategories",
          },
          {
            icon: "mdi-ray-vertex",
            text: "Age Ranges",
            route: "/ageRanges",
          },
          {
            icon: "mdi-head",
            text: "Target Audiences",
            route: "/targetAudiences",
          },
          {
            icon: "mdi-tag",
            text: "Tags",
            route: "/tags",
            disabled: false,
          },
          {
            icon: "mdi-head-heart",
            text: "Interests",
            route: "/interests",
            disabled: false,
          },
          {
            icon: "mdi-head-question-outline",
            text: "Provider Profile Type",
            route: "/providerProfileType",
            disabled: false,
          },
        ],
      },
      // { heading: "Search" },

      {
        icon: "mdi-go-kart-track",
        text: "Tracks",
        route: "/tracks",
      },
      {
        icon: "mdi-account-group",
        text: "Users",
        hierarchical: true,
        children: [
          {
            icon: "mdi-account-multiple",
            text: "Seekers",
            route: "/seekers",
            disabled: true,
          },
          {
            icon: "mdi-account-multiple-check",
            text: "Mentors",
            route: "/mentors",
          },
        ],
      },
      {
        icon: "mdi-account-key",
        text: "Accounts",
        route: "/accounts",
      },
      {
        icon: "mdi-account-cog",
        text: "Internal Providers",
        route: "/internalProviders",
      },
      {
        icon: "mdi-file-question",
        text: "Mentor Requests",
        route: "/mentorRequests",
      },
      {
        icon: "mdi-comment-alert",
        text: "Reviews Reports",
        route: "/reports",
        disabled: false,
      },
      {
        icon: "mdi-email",
        text: "Contact Form Messages",
        route: "/contactFormMessages",
        disabled: false,
      },
      {
        icon: "mdi-ticket",
        text: "Promocodes",
        route: "/promocodes",
        disabled: false,
      },
    ],
  }),
  mounted() {
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    openNotificationsMenu() {
      this.notificationsMenu = true;
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    },

    submitCustomNotification() {
      this.loading = true;

      const formData = jsonToFormData(this.customNotification);
      axios({
        method: "post",
        url: "/api/notification",
        data: formData,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }).then((r) => {
        this.closeDialog();
        this.loading = false;
        this.snackbar = true;
      });
    },

    closeDialog() {
      this.customNotification = {
        title: null,
        description: null,
        image: null,
        account: null,
      };
      this.customNotificationDialog = false;
    },
  },

  computed: {
    ...mapGetters("auth", ["loggedIn", "inRole"]),
    ...mapGetters("socket", ["notifications"]),
    bellContent() {
      // console.log(this.notifications.length);
      return this.notifications.length;
    },
    routeAction() {
      if (this.inRole("Commissioner")) {
        return "CreateProject";
      } else {
        return "SubmitClaim";
      }
    },
    mini() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
          return true;
        case "md":
          return true;
        case "lg":
          return false;
        case "xl":
          return false;
      }
    },
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>
<style>
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
}
</style>
