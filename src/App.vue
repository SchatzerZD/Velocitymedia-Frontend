<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { tokenStore } from './stores/tokenStore';
import Modal from './components/Modal.vue';
import Login from './views/account/Login.vue';
import SignUp from './views/account/SignUp.vue';
</script>

<template>
  <header>
    <div v-if="!loggedOut">
      <h3>{{ username }}</h3>
    </div>
    <div class="navbar-container">
      <nav>
        <div class="nav-links">
          <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
          <RouterLink to="" @click="toggleModal" v-if="loggedOut">Log in</RouterLink>
          <div v-else-if="!admin" class="nav-links">
            <RouterLink :to="{ name: 'BTS' }">BTS</RouterLink>
            <RouterLink :to="{ name: 'Log' }">Log</RouterLink>
            <RouterLink :to="{ name: 'Draft' }">Draft</RouterLink>
            <RouterLink to="" @click="logOut">Log out</RouterLink>
          </div>
          <div v-else class="nav-links">
            <RouterLink :to="{ name: 'Admin' }">Admin Tools</RouterLink>
            <RouterLink to="" @click="logOut">Log out</RouterLink>
          </div>
        </div>

      </nav>
    </div>

  </header>

  <h1>VELOCITY <span>FLOW</span></h1>

  <RouterView />



  <Modal v-if="showModal" @closeModal="toggleModal">
    <Login @register="toggleRegister" v-if="!register"></Login>
    <SignUp @login="toggleRegister" v-else></SignUp>
  </Modal>

</template>


<script>

export default {

  data() {
    return {
      loggedOut: true,
      username: "",
      showModal: false,
      register: false,
      admin: false

    }
  },
  methods: {
    logOut() {
      tokenStore().changeJWT("")
      tokenStore().changeUsername("")
      window.location.replace("http://localhost:5173/")
    },
    toggleModal() {
      this.register = false
      this.showModal = !this.showModal
    },
    toggleRegister() {
      this.register = !this.register
    }
  },
  mounted() {
    if (tokenStore().user.jwt) {
      this.loggedOut = false
      this.username = tokenStore().user.username
      this.admin = tokenStore().user.admin
    }
  }

}

</script>

<style scoped></style>
