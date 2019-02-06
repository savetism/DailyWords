import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import gql from 'graphql-tag';

import { defaultClient as apolloClient } from './main';
import {
  GET_POSTS,
  ADD_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
  ALL_EVENTS,
  WORD_BUCKET,
  CREATE_WORD_PAIR,
  WORD_VIEW,
  DELETE_WORD_PAIR
} from './queries';

const composeUpdateAllQuery = keysToUpdate => {
  const updatePart = keysToUpdate.map(key => {
    return `
      ${key}: updateWordPair(id: "${key}", bucketId: null, viewId: "cjrgoiw7c1gqd0119d8m3ritu") {
        id
        word
        translation
        bucket {
          id
        }
        view {
          id
        }
      }
    `;
  });

  const updatesMutation = gql`mutation { ${updatePart.join(' ')} }`;
  return updatesMutation;
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    events: [],
    userPosts: [],
    searchResults: [],
    wordPairs: [],
    viewWords: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setWordPairs(state, payload) {
      state.wordPairs = payload;
    },
    setViewWords(state, payload) {
      console.log('setting: viewWords', payload);
      state.viewWords = payload;
    },
    setPosts(state, payload) {
      state.posts = payload;
    },
    setEvents(state, payload) {
      state.events = payload;
    },
    setSearchResults(state, payload) {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setUserPosts(state, payload) {
      state.userPosts = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setAuthError(state, payload) {
      state.authError = payload;
    },
    clearUser(state) {
      state.user = null;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          console.log('data', data);
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getPosts({ commit }) {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          console.log(data.getPosts);

          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    allEvents({ commit }) {
      commit('setLoading', true);
      apolloClient
        .query({
          query: ALL_EVENTS
        })
        .then(({ data }) => {
          console.log(data.allEvents);

          commit('setEvents', data.allEvents);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    WordBucket({ commit }) {
      commit('setLoading', true);
      apolloClient
        .query({
          query: WORD_BUCKET
        })
        .then(({ data }) => {
          commit('setWordPairs', data.WordBucket.wordPairs);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
        });
    },
    WordView({ commit }) {
      commit('setLoading', true);
      apolloClient
        .query({
          query: WORD_VIEW
        })
        .then(({ data }) => {
          commit('setViewWords', data.WordView.wordPairs);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
        });
    },
    createWordPair({ state, commit }, payload) {
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: CREATE_WORD_PAIR,
          variables: payload
        })
        .then(({ data }) => {
          const wordPairs = [...state.wordPairs, data.createWordPair];
          commit('setWordPairs', wordPairs);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
        });
    },
    updateAllWordPairs({ state, commit }, payload) {
      commit('setLoading', true);
      const keysToUpdate = state.wordPairs.map(wordPair => wordPair.id);
      const updatesMutation = composeUpdateAllQuery(keysToUpdate);

      apolloClient
        .mutate({
          mutation: updatesMutation,
          update(cache, { data }) {
            // console.log('result', result);
            // try {
            console.log(' --- TRY DATA ---');
            const d = cache.readQuery({ query: WORD_VIEW });
            console.log('cache data: ', d);
            console.log('mutaion data: ', data);
            console.log('Object.values(data)', Object.values(data));
            console.log('d.WordView.wordPairs BEFORE', d.WordView.wordPairs);

            d.WordView.wordPairs.push(...Object.values(data));

            console.log('d.WordView.wordPairs AFTER', d.WordView.wordPairs);
            cache.writeQuery({
              query: WORD_VIEW,
              d
            });
            console.log('-------------------------------------');
            // } catch (e) {}
            // console.log('data', data);

            // console.log('cache', cache);
            // console.log('result', result);
          }
        })
        .then(({ data }) => {
          console.log('data From Mutation: ', data);
          commit('setLoading', false);
          // console.log('Object.values(data)', Object.values(data));
          const viewWords = [...state.viewWords, ...Object.values(data)];
          // console.log('viewWords from mutate', viewWords);
          commit('setViewWords', viewWords);
          router.push('/words');
        })
        .catch(err => {
          commit('setLoading', false);
          console.error('Mutation ERR:', err);
        });
    },

    deleteWordPair: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_WORD_PAIR,
          variables: payload
        })
        .then(({ data }) => {
          if (payload.view) {
            const index = state.viewWords.findIndex(viewWord => viewWord.id === data.deleteWordPair.id);

            const viewWords = [...state.viewWords.slice(0, index), ...state.viewWords.slice(index + 1)];

            commit('setViewWords', viewWords);
          } else {
            const index = state.wordPairs.findIndex(wordPair => wordPair.id === data.deleteWordPair.id);

            const wordPairs = [...state.wordPairs.slice(0, index), ...state.wordPairs.slice(index + 1)];

            commit('setWordPairs', wordPairs);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          console.log('data.getUserPosts', data.getUserPosts);
          commit('setUserPosts', data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    searchPosts({ commit }, payload) {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setSearchResults', data.searchPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addPost({ commit }, payload) {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update(
            cache,
            {
              data: { addPost }
            }
          ) {
            const data = cache.readQuery({ query: GET_POSTS });

            data.getPosts.unshift(addPost);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          },
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log('data.addPost', data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost({ state, commit }, payload) {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);

          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];

          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost({ state, commit }, payload) {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);

          const userPosts = [...state.userPosts.slice(0, index), ...state.userPosts.slice(index + 1)];

          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    signinUser({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
        });
    },
    signupUser({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          console.log('signupUser: data', data);
          localStorage.setItem('token', data.signupUser.token);
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
        });
    },
    async signoutUser({ commit }) {
      commit('clearUser');
      localStorage.setItem('token', '');

      console.dir('apolloClient', apolloClient);
      console.log('apolloClient', apolloClient);
      await apolloClient.resetStore();
      router.push('/');
    }
  },
  getters: {
    posts: state => state.posts,
    events: state => state.events,
    wordPairs: state => state.wordPairs,
    viewWords: state => state.viewWords,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError
  }
});
