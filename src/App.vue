<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { tokenStore } from './stores/tokenStore';
import Modal from './components/Modal.vue';
import Login from './views/account/Login.vue';
import SignUp from './views/account/SignUp.vue';
</script>

<template>
  <header v-if="$route.name !== 'NotFound'">
    <div class="navbar-container">
      <div class="user-info">
        <h3 v-if="!loggedOut">{{ username }}</h3>
      </div>

      <nav>
        <div class="nav-links">
          <RouterLink :to="{ name: 'Home' }">Hjem</RouterLink>

          <RouterLink to="" @click="toggleModal" v-if="loggedOut">Logg inn</RouterLink>

          <template v-else-if="!admin">
            <RouterLink to="" @click="logOut">Logg ut</RouterLink>
          </template>

          <template v-else>
            <RouterLink :to="{ name: 'Admin' }">Admin Tools</RouterLink>
            <RouterLink to="" @click="logOut">Logg ut</RouterLink>
          </template>
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
      tokenStore().changeAccountId("")
      tokenStore().changeInvoiceId("")
      tokenStore().changeProjectId("")
      window.location.replace(window.location.origin + "/");
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
<style scoped>
header {
  background-color: #000;
  padding: 1rem 2rem;
  border-bottom: 2px solid #3aaaff;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info h3 {
  color: #3aaaff;
  font-weight: 600;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  color: white;
  font-weight: 700;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
}

nav a:hover {
  border-color: #3aaaff;
  background-color: rgba(58, 170, 255, 0.1);
  color: #3aaaff;
}
</style>
