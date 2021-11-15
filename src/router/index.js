import Vue from 'vue';
import VueRouter from 'vue-router';
import { TokenService } from '../services/storage.service';

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: function () {
        return import('../views/Home.vue');
      },
    },

    {
      path: '/login',
      name: 'login',
      component: function () {
        return import('../views/Login.vue');
      },
      meta: {
        public: true, // Allow access to guest user.
        onlyWhenLoggedOut: true,
      },
    },

    {
      path: '/register',
      name: 'register',
      component: function () {
        return import('../views/Register.vue');
      },
      meta: {
        public: true, // Allow access to guest user.
        onlyWhenLoggedOut: true,
      },
    },
    {
      path: '/registerSuccess',
      name: 'registerSuccess',
      component: function () {
        return import('../views/RegisterSuccess.vue');
      },
      meta: {
        public: true, // Allow access to guest user.
        onlyWhenLoggedOut: true,
      },
    },
    //make a page not found component later
    // {
    //   path: '*',
    //   component: PageNotFound,
    //   meta: {
    //     public: true,
    //   }
    // }
  ],
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    // disconnects from socket if connected

    return next({
      path: '/login',
      query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/');
  }

  next();
});

export default router;
