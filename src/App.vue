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
        <div class="navLinks">
          <RouterLink :to="{name: 'Home'}">Home</RouterLink>
          <RouterLink to="" @click="toggleModal" v-if="loggedOut">Log in</RouterLink>
          <div v-else-if="!admin" class="navLinks">
            <RouterLink :to="{name: 'BTS'}">BTS</RouterLink>
            <RouterLink :to="{name: 'Log'}">Log</RouterLink>
            <RouterLink :to="{name: 'Draft'}">Draft</RouterLink>
            <RouterLink to="" @click="logOut">Log out</RouterLink>
          </div>
          <div v-else class="navLinks">
            <RouterLink :to="{name: 'Admin'}">Admin Tools</RouterLink>
            <RouterLink to="" @click="logOut">Log out</RouterLink>
          </div>
        </div>

      </nav>
    </div>

  </header>

  <RouterView />

  <Modal v-if="showModal" @closeModal="toggleModal">
    <Login @register="toggleRegister" v-if="!register"></Login>
    <SignUp @login="toggleRegister" v-else></SignUp>
  </Modal>

</template>


<script>

export default {

  data(){
    return {
      loggedOut: true,
      username: "",
      showModal: false,
      register: false,
      admin: false

    }
  },
  methods:{
    logOut(){
      tokenStore().changeJWT("")
      tokenStore().changeUsername("")
      window.location.replace("http://localhost:5173/")
    },
    toggleModal(){
      this.register = false
      this.showModal = !this.showModal
    },
    toggleRegister(){
      this.register = !this.register
    }
  },
  mounted(){
    if(tokenStore().user.jwt){
      this.loggedOut = false
      this.username = tokenStore().user.username
      this.admin = tokenStore().user.admin
    }
  }

}

</script>

<style scoped>

.navbar-container {
  display: flex;
  justify-content: right;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-right: 3rem;
  position: relative;
}

header {
  background: linear-gradient(to right, #fdfbfb, #ebedee);
  padding: 16px 1rem;
  border-bottom: 1px solid #ddd;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  border-radius: 5px;
  width: 98%;
  margin: 0 auto;
}

nav {
  display: flex;
  align-items: right;
  justify-content: right;
  text-align: right;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  padding: 8px 12px;
}

.navLinks {
  display: flex;
  gap: 20px;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #34495e;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

nav a:hover {
  background-color: #4a90e2;
  color: white;
}

nav a.router-link-exact-active {
  font-weight: 600;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    width: 100%;
    margin-top: 10px;
  }

  .navLinks {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  h3 {
    margin-bottom: 10px;
  }
}

</style>
