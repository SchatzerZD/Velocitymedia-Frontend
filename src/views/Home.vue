<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import Log from './tools/Log.vue';
import Modal from '@/components/Modal.vue';
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
import InvoicePreview from '@/components/InvoicePreview.vue';
</script>

<template>

    <Row v-if="loggedIn" class="container">
        <Box @click="contract" :class="{ complete: contractComplete }">
            <h2>KONTRAKT</h2>
        </Box>

        <div class="dots" :class="{ completeDots: contractComplete }">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Review' }">
            <Box>
                <h2>GJENNOMGANG</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink to="/404">
            <Box>
                <h2>FAKTURA</h2>
            </Box>
        </RouterLink>

    </Row>

    <div class="log-wrapper">
        <Log maxLogs="3" />
    </div>

    <Modal v-if="showModal" @closeModal="toggleModal">
        <div v-if="!contractComplete">
            <h2>Opprett kontrakt og faktura</h2>
            <form @submit.prevent="submitContract">

                <label>Navn</label>
                <input type="text" v-model="formData.customerName" required>

                <label>Email</label>
                <input type="email" v-model="formData.customerEmail" required>

                <label>Adresse</label>
                <input type="text" placeholder="Gateadresse" v-model="formData.address.streetAddress" required>
                <input type="text" placeholder="Postnummer" v-model="formData.address.postCode" required>
                <input type="text" placeholder="By" v-model="formData.address.city" required>
                <input type="text" placeholder="Land" v-model="formData.address.country" required>

                <button type="submit">Send</button>
            </form>
        </div>
        <div v-else>
            <h2>Faktura opprettet</h2>
            <p>
                <a :href="invoiceLink" target="_blank">Klikk her for å se fakturaen på Fiken.no</a>
            </p>
            <InvoicePreview :invoice="invoiceBody"></InvoicePreview>
        </div>
    </Modal>


</template>

<script>


export default {

    data() {
        return {
            loggedIn: false,
            showModal: false,
            accessToken: null,
            contractComplete: false,

            formData: {
                accessToken: '',
                customerName: '',
                customerEmail: '',
                contractText: 'Tjeneste',
                address: {
                    streetAddress: '',
                    postCode: '',
                    city: '',
                    country: ''
                }
            },
            invoiceLink: null,
            invoiceBody: null

        }
    },
    methods: {
        contract() {
            if ((this.$router.isReady() && !this.$route.query.code && !this.$route.query.state)) {
                const firstResult = Math.random().toString(36).substring(2, 12);
                const secondResult = Math.random().toString(36).substring(2, 12);
                window.location.href = `https://fiken.no/oauth/authorize?response_type=code&client_id=q35jROmqSY4sdSxn23685689881289974&redirect_uri=http://localhost:5173&state=${firstResult + secondResult}`
            } else {
                if (tokenStore().user.invoiceId) {
                    axios.get("http://localhost:8080/fiken/get-contract/" + tokenStore().user.invoiceId, {
                        headers: {
                            "Authorization": "Bearer " + this.accessToken
                        }
                    })
                        .then(response => {
                            this.invoiceBody = response.data
                            this.invoiceLink = "https://fiken.no/foretak/fiken-demo-gammel-burger-as/webfaktura/" + tokenStore().user.invoiceId;
                            this.toggleModal()
                        })
                        .catch(error => console.log(error))
                } else {
                    this.toggleModal()
                }
            }
        },
        toggleModal() {
            this.showModal = !this.showModal
        },
        submitContract() {
            this.formData.accessToken = this.accessToken
            axios.post('http://localhost:8080/fiken/create-contract', this.formData, tokenStore().headers)
                .then(res => {
                    this.invoiceLink = res.data.invoiceUrl;
                    this.invoiceBody = res.data.content;
                    this.contractComplete = true
                })
                .catch(err => {
                    console.error('Feil ved oppretting:', err);
                    alert('Kunne ikke opprette kontrakt/faktura. Sjekk konsollen.');
                });
        }

    },
    mounted() {
        if (tokenStore().user.jwt) {
            this.loggedIn = true
        }

        if (!tokenStore().user.invoiceId) {
            axios.get('http://localhost:8080/user/me', tokenStore().headers)
                .then(response => {
                    tokenStore().changeAccountId(response.data.accountId)
                    tokenStore().changeInvoiceId(response.data.invoiceId)
                    if (response.data.accountId && response.data.invoiceId) {
                        this.contractComplete = true
                    }
                })
                .catch(error => console.log(error))
        } else {
            this.contractComplete = true
        }

        if (this.$router.isReady()) {
            if (this.$route.query.code && this.$route.query.state) {
                if (!this.contractComplete) {
                    this.toggleModal()
                }
                axios.post('http://localhost:8080/fiken/token', {
                    code: this.$route.query.code,
                    redirect_uri: "http://localhost:5173",
                    state: this.$route.query.state
                }).then(res => {
                    this.accessToken = res.data.access_token;

                    this.contract()
                });
            }
        }



    }

}

</script>

<style scoped>
.box:hover {
    cursor: pointer;
}

.container {
    margin-top: 8rem;
}

.dots {
    color: #3aaaff;
    font-size: 4rem;
    font-weight: bold;
    margin: auto 0.6rem;
    display: flex;
    flex-direction: row;
    height: 6rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
}

.dots span {
    border: 0.45rem solid #3aaaff;
    border-radius: 4px;
    padding: none;
    margin: none;
    height: 0.1rem;
}

.row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
}

a {
    text-decoration: none;
    color: inherit;
}

.log-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
}

.complete {
    background-color: #3aaaff;
    color: white;
}

.completeDots {
    background-color: #3aaaff;
    height: 50%;
    border-radius: 100px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    align-items: stretch;
}

label {
    font-weight: bold;
    color: inherit;
    text-transform: uppercase;
    font-size: 0.9rem;
}

input[type="text"],
input[type="email"] {
    padding: 0.75rem;
    border-radius: 8px;
    border: 2px solid #3aaaff;
    background-color: #1a1a1a;
    color: white;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

button[type="submit"] {
    background-color: #3aaaff;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

button[type="submit"]:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.6);
}

@media(max-width:750px) {
    .row {
        flex-direction: column
    }

    .dots {
        flex-direction: column;
    }

    .box {
        min-width: 220px;
    }
}
</style>