<template>
    <div class="container">
        <h1>Logg Inn</h1>

        <form @submit.prevent="onSubmit">


            <input type="text" id="username" v-model="user.username"></input>
            <label for="username">Username</label>


            <input type="password" id="password" v-model="user.password"></input>
            <label for="password">Password</label>

            <div id="bottom">
                <!-- <p>Dont have an account? <span id="register" @click="register">Register here</span></p> -->
                <button>Submit</button>
            </div>

        </form>

        <div v-if="error" id="error">{{ error }}</div>

    </div>

</template>


<script>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';

export default {

    data() {
        return {
            user: {
                username: "",
                password: ""
            },

            error: ""

        }
    },
    methods: {
        async onSubmit() {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, this.user)
                .then(response => this.login(response.data))
                .catch(error => {
                    this.error = error.response.data
                })
        },
        login(jwt) {
            console.log("login successful")
            tokenStore().changeJWT(jwt)
            tokenStore().changeUsername(this.user.username)


            window.location.replace(window.location.origin + "/");

        },
        register() {
            this.$emit("register")
        }
    }


}

</script>


<style scoped>
.container {
    width: 15vw;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 2rem;
}

h1 {
    text-align: center;
    color: black;
}

form {
    display: flex;
    flex-direction: column;
    height: 17rem;
    align-items: center;
    position: relative;
}

label {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #061524;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: color 0.3s ease;
}




input[type="text"],
input[type="password"] {
    width: 80%;
    max-width: 400px;
    padding: 12px 16px;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
    font-size: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.3s ease;
    background-color: transparent;
    box-shadow: none;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-bottom: 2px solid #4a90e2;
    outline: none;
    box-shadow: none;
}


#bottom {
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#bottom p {
    color: black;
}

#register {
    color: blue;
    cursor: pointer;
}

#register:hover {
    font-weight: bold;
    transition-duration: 0.1s;
}

button {
    text-align: center;
    width: 10rem;
    height: 2rem;
    border-radius: 6px;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #4a90e2;
    color: #fff;
    cursor: pointer;
}

#error {
    color: red;
    text-align: center;
    font-weight: bold;
}
</style>