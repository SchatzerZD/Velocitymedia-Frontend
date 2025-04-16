import { ref, watch } from 'vue'
import { defineStore } from 'pinia'



export const tokenStore = defineStore("user", () => {
    const user = ref({
        username: "",
        jwt: ""
    })


    if (localStorage.getItem("user")) {
        user.value = JSON.parse(localStorage.getItem("user"))
    }


    watch(
        user,
        (userVal) => {
            localStorage.setItem("user", JSON.stringify(userVal));
        },
        {deep: true}
    )


    const changeJWT = (jwt) => {
        user.value.jwt = jwt;
    }

    const changeUsername = (username) => {
        user.value.username = username
    }


    return { user, changeJWT, changeUsername }
})


