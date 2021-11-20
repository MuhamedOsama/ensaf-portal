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
      path: '/CreateProject',
      name: 'CreateProject',
      component: function () {
        return import('../views/CreateProject.vue');
      },
      meta: {
        public: false, // Allow access to guest user.
        onlyCommissioner: true,
      },
    },
    {
      path: '/SubmitClaim',
      name: 'SubmitClaim',
      component: function () {
        return import('../views/SubmitClaim.vue');
      },
      meta: {
        public: false, // Allow access to guest user.
        onlyNormalUser: true,
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
  const onlyCommissioner = to.matched.some(
    (record) => record.meta.onlyCommissioner
  );
  const onlyNormalUser = to.matched.some(
    (record) => record.meta.onlyNormalUser
  );
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );
  const isNormalUser = !!TokenService.getRoles().includes('Normal');
  const loggedIn = !!TokenService.getToken();
  const isCommissioner = !!TokenService.getRoles().includes('Commissioner');
  if (onlyCommissioner) {
    if (!isCommissioner) {
      return next('/');
    }
  }
  if (onlyNormalUser) {
    if (!isNormalUser) {
      return next('/');
    }
  }
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
