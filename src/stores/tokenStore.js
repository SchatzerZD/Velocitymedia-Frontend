import { ref, watch } from 'vue'
import { defineStore } from 'pinia'



export const tokenStore = defineStore("user", () => {
    const user = ref({
        username: "",
        jwt: "",
        accountId: "",
        invoiceId: "",
        admin: false
    })

    const headers = ref({
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer "
        }
    })


    if (localStorage.getItem("user")) {
        user.value = JSON.parse(localStorage.getItem("user"))
    }

    if (localStorage.getItem("headers")) {
        headers.value = JSON.parse(localStorage.getItem("headers"))
    }


    watch(
        user,
        (userVal) => {
            localStorage.setItem("user", JSON.stringify(userVal));

        },
        {deep: true}
    )

    watch(
        headers,
        (headerVal) => {
            localStorage.setItem("headers", JSON.stringify(headerVal));

        },
        {deep: true}
    )


    const changeJWT = (jwt) => {
        user.value.jwt = jwt
        headers.value.headers.Authorization = 'Bearer ' + jwt
    }

    const changeUsername = (username) => {
        user.value.username = username
        
        if(username === 'admin'){
            user.value.admin = true
        }else{
            user.value.admin = false
        }
    }

    const changeAccountId = (accountId) => {
        user.value.accountId = accountId
    }

    const changeInvoiceId = (invoiceId) => {
        user.value.invoiceId = invoiceId
    }


    return { user, headers, changeJWT, changeUsername, changeAccountId, changeInvoiceId}
})


