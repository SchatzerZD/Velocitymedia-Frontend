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

<style scoped>
.navbar-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-right: 3rem;
  position: relative;
}

header {
  background: linear-gradient(135deg, #343450, #1a1a2e, #23234d);
  padding: 16px 1.5rem;
  border-bottom: 1px solid rgb(255, 255, 255);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-wrap: wrap;
  border-radius: 12px;
  width: 96%;
  margin: 1rem auto;
  backdrop-filter: blur(8px);
  background-clip: padding-box;
  color: #f5f5f5;
}

nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  flex-grow: 1;
}

h3 {
  font-size: 25px;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 1rem 0 0;
  padding: 8px 12px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #bfc9ff;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: transparent;
}

nav a:hover {
  background: linear-gradient(135deg, #5b86e5, #36d1dc);
  color: #ffffff;
  box-shadow: 0 0 8px rgba(86, 204, 242, 0.3);
}

nav a.router-link-exact-active {
  font-weight: 600;
  color: #ffffff;
  background-color: #36d1dc33;
  border: 1px solid rgba(86, 204, 242, 0.3);
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    width: 100%;
    margin-top: 10px;
    justify-content: flex-start;
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
