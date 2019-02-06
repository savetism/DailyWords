import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';

import WordView from './components/WordView.vue';
import TakeTest from './components/TakeTest.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/words',
      name: 'WordView',
      component: WordView
    },
    {
      path: '/test',
      name: 'TakeTest',
      component: TakeTest
    }
  ]
});
