import Vue from 'vue'
import App from './App.vue'
import firebase from '@firebase/app';
import '@firebase/analytics';
import firebaseConfig from "../firebaseConfig";

firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  render: h => h(App),
}).$mount('#app');
