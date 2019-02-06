import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

export const defaultClient = new ApolloClient({
  dataIdFromObject: o => o.id,
  uri: 'https://api.graph.cool/simple/v1/cjrf6wrnna1ad0131mpo7wi4b',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    });
  },
  onError({ graphQLErrors, networkError }) {
    if (networkError) {
      console.log('networkError', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          store.commit('setAuthError', err);
          store.dispatch('signoutUser');
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  render: h => h(App)
}).$mount('#app');
