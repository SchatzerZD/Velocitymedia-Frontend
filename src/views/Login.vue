<template>

<h1>LOGIN PAGE</h1>

<form @submit.prevent="onSubmit">


    <label>Username</label>
    <input type="text" v-model="user.username"></input>

    <label>Password</label>
    <input type="password" v-model="user.password"></input>

    <button>Submit</button>
</form>

<div v-if="error">{{ error }}</div>

</template>


<script>
import router from '@/router';
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';



export default {

    data(){
        return {
            user: {
                username: "",
                password: ""
            },

            error: ""
            
        }
    },
    methods: {
        async onSubmit(){
            await axios.post('http://localhost:8080/user/login', this.user)
                .then(response => this.login(response.data))
                .catch(error => {
                    this.error = error.response.data
                })
        },
        login(jwt){
            console.log("login successful")
            tokenStore().changeJWT(jwt)
            tokenStore().changeUsername(this.user.username)
            window.location.replace("http://localhost:5173/")
        }
    }


}



</script>