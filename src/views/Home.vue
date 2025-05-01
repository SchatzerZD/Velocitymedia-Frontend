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
        <Box @click="contract">
            <h2>KONTRAKT</h2>
        </Box>

        <div class="dots">
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
        <div v-if="!invoiceLink">
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

            formData: {
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
            const firstResult = Math.random().toString(36).substring(2, 12);
            const secondResult = Math.random().toString(36).substring(2, 12);
            window.location.href = `https://fiken.no/oauth/authorize?response_type=code&client_id=q35jROmqSY4sdSxn23685689881289974&redirect_uri=http://localhost:5173&state=${firstResult + secondResult}`
        },
        toggleModal() {
            this.showModal = !this.showModal
        },
        submitContract() {
            axios.post('http://localhost:8080/fiken/create-contract', this.formData, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            })
                .then(res => {
                    this.invoiceLink = res.data.invoiceUrl;
                    this.invoiceBody = res.data.content;

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

        if (this.$router.isReady()) {
            if (this.$route.query.code && this.$route.query.state) {
                this.toggleModal()

                axios.post('http://localhost:8080/fiken/token', {
                    code: this.$route.query.code,
                    redirect_uri: "http://localhost:5173",
                    state: this.$route.query.state
                }).then(res => {
                    this.accessToken = res.data.access_token;
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