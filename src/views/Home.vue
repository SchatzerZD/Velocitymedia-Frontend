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

    <div class="project-dropdown-container" v-if="loggedIn && projects">
        <select v-model="currentProjectId" @change="switchProject">
            <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
            </option>
            <option disabled>────────────</option>
            <option value="__new__">+ Opprett nytt prosjekt</option>
        </select>
    </div>


    <Row v-if="loggedIn && currentProjectId && currentProject" class="container">

        <Box :class="{ complete: contractComplete }" @click="toggleContractModal">
            <h2>KONTRAKT</h2>
        </Box>



        <div class="dots" :class="{ completeDots: contractComplete }">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Review', query: { contractComplete: contractComplete } }">
            <Box>
                <h2 :class="{ blue: !contractComplete }">PRODUKSJON</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>


        <Box :class="{ complete: fakturaComplete }" @click="redirecttToInvoice">
            <h2 :class="{ blue: !fakturaComplete }">FAKTURA</h2>
        </Box>


    </Row>

    <div v-if="loggedIn && currentProject && currentProjectId" class="log-wrapper">
        <Log :projectId="currentProjectId" maxLogs=3 />
    </div>


    <Modal theme="large" v-if="showContractModal" @closeModal="toggleContractModal">
        <div class="contract-modal">
            <h2>Kontrakt</h2>
            <object :data="contractUrl + contractFileName" type="application/pdf" width="100%" height="70vh"
                style="margin-top: 1rem;"></object>

            <div v-if="showSignaturePad && !contractComplete" class="signature-pad-container">
                <h3>Signer kontrakten her</h3>
                <canvas ref="signaturePadCanvas" width="400" height="200"></canvas>
                <div class="signature-buttons">
                    <button @click="submitSignature">Send inn signatur</button>
                    <button @click="clearSignature">Tøm feltet</button>
                </div>
            </div>


            <div v-if="contractFound && !showSignaturePad && !contractComplete" class="modal-actions">
                <button @click="startSignature">Signer</button>
                <button @click="signContract(false)">Avslå</button>
            </div>
        </div>
    </Modal>




    <Modal v-if="newProject && loggedIn"
        @closeModal="newProject = false; currentProjectId = null; tokenStore().changeProjectId('')">
        <div class="new-project-container">
            <h2>Opprett nytt prosjekt</h2>
            <form @submit.prevent="createNewProject">
                <label>Prosjekt Navn</label>
                <input type="text" v-model="newProjectName" required>

                <button type="submit">Oprett prosjekt</button>
            </form>
        </div>

    </Modal>


</template>

<script>
import SignaturePad from 'signature_pad';


export default {

    data() {
        return {
            loggedIn: false,
            showModal: false,
            accessToken: null,

            newProject: false,
            newProjectName: '',
            projects: null,
            currentProject: null,
            currentProjectId: null,

            contractComplete: false,
            reviewComplete: false,
            fakturaComplete: false,
            contractFound: false,

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

            showContractModal: false,
            contractFileName: '',

            showSignaturePad: false,
            signaturePad: null,
            signatureDataUrl: null

        }
    },
    computed: {
        contractUrl() {
            const backend = import.meta.env.VITE_BACKEND_URL;
            return `${backend}${this.contractFileName}?t=${Date.now()}`;
        }
    },
    methods: {
        async createNewProject() {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/projects`, {

                name: this.newProjectName
            },
                tokenStore().headers)
                .then(response => {
                    this.newProject = false
                    this.projects = response.data.sort((a, b) => new Date(b.projectCreatedAt) - new Date(a.projectCreatedAt))
                    this.currentProjectId = this.projects[0].id
                    this.currentProject = this.projects[0]
                    this.currentProject.contractPath ? this.contractFileName = this.currentProject.contractPath.split('\\').pop() : this.contractFileName = ''
                    this.contractFileName ? this.contractFound = true : this.contractFound = false
                    this.newProjectName = ''
                    this.contractComplete = false
                    tokenStore().changeProjectId(this.currentProjectId)
                })
                .catch(error => console.log(error))
        },
        switchProject() {
            if (this.currentProjectId === '__new__') {
                tokenStore().changeProjectId('')
                this.newProject = true;
                this.currentProject = null;
            } else {
                tokenStore().changeProjectId(this.currentProjectId);
                this.currentProject = this.projects.find(
                    project => project.id === this.currentProjectId
                );

                this.currentProject.contractPath ? this.contractFileName = this.currentProject.contractPath.split('\\').pop() : this.contractFileName = ''
                this.contractFileName ? this.contractFound = true : this.contractFound = false
                this.contractComplete = this.currentProject.contractSigned
                this.invoiceLink = this.currentProject.invoiceURL
                this.invoiceLink ? this.fakturaComplete = true : this.fakturaComplete = false
            }
        },
        toggleContractModal() {
            this.showContractModal = !this.showContractModal;
        },

        signContract(signed) {
            if (!signed) {
                alert("Kontrakt ble avslått.");
                this.toggleContractModal();
                return;
            }

            axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/contract/` + this.currentProjectId, null, tokenStore().headers)
                .then(res => {
                    this.contractComplete = true;
                    alert("Kontrakt signert!");
                    this.toggleContractModal();
                })
                .catch(err => {
                    console.error("Feil ved signering:", err);
                    alert("Det oppstod en feil. Sjekk konsollen.");
                });
        },
        startSignature() {
            this.showSignaturePad = true;
            this.$nextTick(() => {
                const canvas = this.$refs.signaturePadCanvas;
                this.signaturePad = new SignaturePad(canvas);
            });
        },
        clearSignature() {
            if (this.signaturePad) {
                this.signaturePad.clear();
            }
        },
        submitSignature() {
            if (this.signaturePad.isEmpty()) {
                alert("Please provide a signature!");
                return;
            }
            this.signatureDataUrl = this.signaturePad.toDataURL();

            this.appendSignatureToPdf();
        },
        appendSignatureToPdf() {
            const blob = this.dataURLtoBlob(this.signatureDataUrl);
            const formData = new FormData();
            formData.append("signature", blob, "signature.png");

            axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/projects/${this.currentProjectId}/contract/signature`,
                formData, {
                headers: {
                    "Authorization": "Bearer " + tokenStore().user.jwt,
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(response => {
                    this.signContract(true)
                })
                .catch(error => {
                    console.error("Feil ved signering:", error);
                    alert("Det oppstod en feil. Sjekk konsollen.");
                });
        }
        ,
        dataURLtoBlob(dataURL) {
            const byteString = atob(dataURL.split(',')[1]);
            const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ab], { type: mimeString });
        },

        toggleContractFound(found) {
            this.contractFound = found
        },
        redirecttToInvoice() {
            window.open(this.invoiceLink)
        }

    },
    mounted() {
        if (tokenStore().user.jwt) {
            this.loggedIn = true
        }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/projects`, tokenStore().headers)
            .then(response => {
                if (response.data.length === 0) {
                    !tokenStore().user.admin && (this.newProject = true)
                } else {
                    this.projects = response.data.sort((a, b) => new Date(b.projectCreatedAt) - new Date(a.projectCreatedAt))
                    if (tokenStore().user.projectId) {
                        this.currentProjectId = tokenStore().user.projectId
                        this.currentProject = this.projects.find(
                            project => project.id === this.currentProjectId
                        );
                    } else {
                        this.currentProjectId = this.projects[0].id
                        this.currentProject = this.projects[0]
                        tokenStore().changeProjectId(this.currentProjectId)
                    }

                    this.contractComplete = this.currentProject.contractSigned
                    this.currentProject.contractPath ? this.contractFileName = this.currentProject.contractPath.split('\\').pop() : this.contractFileName = ''
                    this.contractFileName ? this.contractFound = true : this.contractFound = false
                    this.invoiceLink = this.currentProject.invoiceURL
                    this.invoiceLink ? this.fakturaComplete = true : this.fakturaComplete = false
                }
            })
            .catch(error => console.log(error))

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

.blue {
    color: #3aaaff
}

.project-dropdown-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.project-dropdown-container select {
    background-color: #1a1a1a;
    color: white;
    border: 2px solid #3aaaff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    max-width: 300px;
    text-align: center;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.project-dropdown-container select:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.modal-actions button {
    background-color: #3aaaff;
    color: white;
    font-weight: bold;
    margin-right: 1rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.modal-actions button:hover {
    background-color: #00bfff;
}

.contract-modal {
    background-color: #1a1a1a;
    color: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 90vw;
    width: 100%;
    height: 90vh;
    overflow: auto;
}

.contract-modal h2 {
    font-size: 1.5rem;
    color: #3aaaff;
    margin-bottom: 1rem;
}

.contract-modal object {
    border: 2px solid #3aaaff;
    border-radius: 8px;
    height: 70vh;
}

.contract-modal .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.log-wrapper {
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
}

.new-project-container {
    padding: 2rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}


.container {
    transform: scale(0);
    animation: zoomOut 0.5s ease forwards;
}

.signature-pad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

canvas {
    border: 2px solid #3aaaff;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.2);
}

.signature-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.signature-buttons button {
    background-color: #3aaaff;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.signature-buttons button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.6);
}



@keyframes zoomOut {
    from {
        transform: scale(2);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
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