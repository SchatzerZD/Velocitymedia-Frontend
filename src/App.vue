<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { tokenStore } from './stores/tokenStore';
import router from './router';
</script>

<template>
  <header>
      <nav>
        <RouterLink :to="{name: 'Home'}">Home</RouterLink>
        <RouterLink :to="{name: 'Login'}" v-if="loggedOut">Login</RouterLink>
        <RouterLink to="" @click="logOut" v-else>Log out</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>


<script>

export default {

  data(){
    return {
      loggedOut: true
    }
  },
  methods:{
    logOut(){
      tokenStore().changeJWT("")
      tokenStore().changeUsername("")
      window.location.replace("http://localhost:5173/")
    }
  },
  mounted(){
    if(tokenStore().user.jwt){
      this.loggedOut = false
    }
  }

}

</script>

<style scoped>

header {
  line-height: 1;
  max-height: 50vh;
  background-color: gray;
  text-align: center;
  
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  display: flex;
  margin-top: 2rem;
  justify-content: right;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
