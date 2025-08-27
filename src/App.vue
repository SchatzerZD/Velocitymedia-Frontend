<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { tokenStore } from './stores/tokenStore';
import Modal from './components/Modal.vue';
import Login from './views/account/Login.vue';
import SignUp from './views/account/SignUp.vue';
import Static from './views/Static.vue';
</script>

<template>
  <div class="background">

  </div>

  <header v-if="$route.name !== 'NotFound'">

    <div>
      <div class="site-logo" @click="staticPage">
        <img src="./assets/logo.svg" alt="Velocity Media logo" class="logo">
        <h2>VELOCITY MEDIA</h2>
      </div>


    </div>


    <div class="navbar-container">

      <nav>
        <div class="nav-links">
          <RouterLink :to="{ name: 'Home' }" @click="flowPage" v-if="!loggedOut">Velocity Flow</RouterLink>

          <RouterLink to="" @click="toggleModal" v-if="loggedOut">Logg inn</RouterLink>

          <template v-else-if="!admin">
            <RouterLink to="" @click="logOut">Logg ut</RouterLink>
          </template>

          <template v-else>
            <RouterLink :to="{ name: 'Admin' }" @click="flowPage">Admin Tools</RouterLink>
            <RouterLink to="" @click="logOut">Logg ut</RouterLink>
          </template>
        </div>
      </nav>

      <div v-if="!loggedOut" class="user-info">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6" width="10%" height="10%">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

        <h3>{{ username }}</h3>
      </div>

    </div>
  </header>


  <div v-if="isFlow">
    <h1>VELOCITY <span>FLOW</span></h1>

    <RouterView />
  </div>

  <div v-else>
    <Static></Static>
  </div>

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
      admin: false,
      isFlow: false

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
    },
    staticPage() {
      this.isFlow = false
    },
    flowPage() {
      this.isFlow = true
    }
  },
  mounted() {
    const bg = document.querySelector('.background')

    window.addEventListener('mousemove', (e) => {
      bg.style.setProperty('--x', e.clientX + 'px')
      bg.style.setProperty('--y', e.clientY + 'px')
    })

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
  display: flex;
  justify-content: space-between;


  & img {
    height: 3rem;
  }

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

.site-logo {
  display: flex;
  text-align: center;
  justify-content: center;
  gap: 1rem;


  & h2 {
    padding-top: 0.55rem;
  }
}

.site-logo:hover {
  cursor: pointer;
}
</style>
