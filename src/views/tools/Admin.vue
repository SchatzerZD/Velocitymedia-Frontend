<script setup>
import axios from 'axios';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>
    <div class="admin-container">
        <h1>Admin Panel</h1>

        <div class="select-wrapper">
            <label for="user-select">Velg Bruker:</label>
            <select id="user-select" v-model="selectedUser" @change="fetchUserProjects">
                <option disabled value="">-- Velg en bruker --</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.username }}
                </option>
            </select>
        </div>

        <div class="select-wrapper" v-if="userProjects.length > 0">
            <label for="project-select">Velg Prosjekt:</label>
            <select id="project-select" v-model="selectedProjectId">
                <option disabled value="">-- Velg et prosjekt --</option>
                <option v-for="project in userProjects" :key="project.id" :value="project.id">
                    {{ project.name }}
                </option>
            </select>
        </div>

        <div class="tab-container">
            <div class="tab-buttons">
                <button :class="{ active: currentTab === 'upload' }" @click="currentTab = 'upload'">Video/Bilde
                    Opplasting</button>
                <button :class="{ active: currentTab === 'contract' }" @click="currentTab = 'contract'">Last opp
                    Kontrakt</button>
                <button :class="{ active: currentTab === 'log' }" @click="currentTab = 'log'">Skriv
                    Prosjektlogg</button>
                <button :class="{ active: currentTab === 'project-flags' }" @click="currentTab = 'project-flags'">Velg
                    Prosjektflagg</button>
            </div>

            <div v-if="uploadingMessage" class="uploading-message">{{ uploadingMessage }}</div>
            <div v-if="uploadSuccessMessage" class="upload-success-message">{{ uploadSuccessMessage }}</div>
            <div v-if="uploadErrorMessage" class="upload-error-message">{{ uploadErrorMessage }}</div>

            <div v-show="currentTab === 'upload'" class="upload-grid">

                <div class="upload-card">
                    <h2>Last opp Videokladd</h2>
                    <div class="select-wrapper">
                        <label for="flag-select">Merk video med:</label>
                        <select id="flag-select" v-model="selectedFlag">
                            <option disabled value="">-- Velg flagg --</option>
                            <option v-for="flag in selectedProjectFlags" :key="flag" :value="flag">{{ flag }}</option>
                        </select>
                    </div>
                    <form @submit.prevent="draftUpload">
                        <input type="file" accept="video/mp4" @change="onFileChangeDraft" />
                        <button type="submit">Last opp</button>
                    </form>
                </div>

                <div class="upload-card">
                    <h2>Last opp BTS-bilde</h2>
                    <form @submit.prevent="btsUpload">
                        <input type="file" accept="image/*" @change="onFileChangeImage" />
                        <button type="submit">Last opp</button>
                    </form>
                </div>

            </div>



            <div v-show="currentTab === 'contract'" class="contract-upload-card">
                <h2>Last opp Kontrakt (PDF)</h2>
                <form @submit.prevent="uploadContract">
                    <input type="file" accept="application/pdf" @change="onContractFileChange" />
                    <button type="submit">Last opp PDF</button>
                </form>
            </div>
            <div v-show="currentTab === 'log'" class="log-entry-section">
                <h2>Prosjektlogg</h2>
                <form @submit.prevent="logUpload">
                    <textarea v-model="logText" placeholder="Skriv loggtekst her..." rows="10"></textarea>
                    <button type="submit">Lagre Logg</button>
                </form>
            </div>
            <div v-show="currentTab === 'project-flags'" class="project-flags-tab">
                <h2>Velg relevante flagg for prosjektet</h2>
                <div class="checkbox-list">
                    <label v-for="flag in videoFlags" :key="flag">
                        <input type="checkbox" :value="flag" v-model="selectedProjectFlags" />
                        {{ flag }}
                    </label>
                </div>
                <button @click="submitProjectFlags">Oppdater Prosjektflagg</button>
            </div>
        </div>

        <div class="invoice-section" v-if="selectedProjectId">
            <h2>Fakturautkast</h2>

            <div v-if="invoiceDraftUrl">
                <p>Fakturautkast er generert.</p>

                <form @submit.prevent="updateProjectUrl">
                    <input type="text" v-model="invoiceDraftUrl">
                    <button type="submit">Oppdater Ferdig Faktura Link</button>
                </form>

            </div>

            <div v-else-if="showInvoiceForm">
                <form @submit.prevent="createInvoiceDraft">
                    <button type="submit">Generer fakturautkast</button>
                </form>
            </div>

            <div v-else>
                <p>Ingen fakturainformasjon tilgjengelig.</p>
            </div>
        </div>


    </div>
</template>



<script>

export default {
    data() {
        return {
            users: [],
            userProjects: [],
            selectedUser: null,
            selectedProjectId: null,
            selectedFlag: null,
            videoFlags: ['CLIPPING', 'GRADING', 'VFX', 'SFX'],
            uploading: false,
            video: null,
            image: null,
            logText: '',
            contract: null,
            currentTab: 'upload',
            selectedProjectFlags: [],
            uploadingMessage: '',
            uploadSuccessMessage: '',
            uploadErrorMessage: '',

            invoiceDraftUrl: null,
            showInvoiceForm: false,



        };
    },
    methods: {
        async fetchUserProjects() {
            this.selectedProjectId = null;
            this.userProjects = [];

            try {
                const res = await axios.get(`http://localhost:8080/user/projects/admin/${this.selectedUser}`, tokenStore().headers);
                this.userProjects = res.data.sort((a, b) => new Date(b.projectCreatedAt) - new Date(a.projectCreatedAt))
            } catch (err) {
                console.error('Feil ved henting av prosjekter:', err);
            }
        },
        async draftUpload() {
            if (!this.selectedProjectId || !this.selectedFlag || !this.video) {
                alert('Velg prosjekt, flagg og video');
                return;
            }

            this.uploading = true;
            this.uploadingMessage = 'Laster opp video...';
            this.uploadSuccessMessage = '';
            this.uploadErrorMessage = '';

            const formData = new FormData();
            formData.append('file', this.video);
            formData.append('flag', this.selectedFlag);

            try {
                await axios.post(`http://localhost:8080/video/${this.selectedProjectId}`, formData, {
                    headers: { "Authorization": "Bearer " + tokenStore().user.jwt }
                });
                this.uploadSuccessMessage = 'Video lastet opp!';
            } catch (error) {
                console.error(error);
                this.uploadErrorMessage = 'Feil ved opplasting av video.';
            } finally {
                this.uploading = false;
                this.uploadingMessage = '';
                this.resetForm();
            }
        },
        async btsUpload() {
            if (!this.selectedProjectId || !this.image) return alert('Velg prosjekt og bilde');

            this.uploading = true;
            this.uploadingMessage = 'Laster opp bilde...';
            this.uploadSuccessMessage = '';
            this.uploadErrorMessage = '';

            const formData = new FormData();
            formData.append('file', this.image);

            await axios.post(`http://localhost:8080/image/${this.selectedProjectId}`, formData, {
                headers: { "Authorization": "Bearer " + tokenStore().user.jwt }
            }).then(
                this.uploadSuccessMessage = 'Bilde lastet opp!'
            ).catch(error => {
                console.error(error);
                this.uploadErrorMessage = 'Feil ved opplasting av bilde.';
            });

            this.uploading = false;
            this.uploadingMessage = '';
            this.resetForm();
        },
        async logUpload() {
            if (!this.selectedProjectId || !this.logText) return alert('Velg prosjekt og skriv en loggtekst');
            this.uploading = true;

            this.uploading = true;
            this.uploadingMessage = 'Laster opp log...';
            this.uploadSuccessMessage = '';
            this.uploadErrorMessage = '';

            await axios.post(`http://localhost:8080/log/${this.selectedProjectId}`, {
                log: this.logText
            }, tokenStore().headers)
                .then(
                    this.uploadSuccessMessage = 'Log lastet opp!'
                ).catch(error => {
                    console.error(error);
                    this.uploadErrorMessage = 'Feil ved opplasting av log.';
                });

            this.uploading = false;
            this.uploadingMessage = '';
            this.resetForm();
        },
        async uploadContract() {
            if (!this.selectedProjectId || !this.contract) return alert("Velg prosjekt og PDF-fil");
            if (this.contract.type !== 'application/pdf') return alert("Bare PDF-filer er tillatt");

            this.uploading = true;
            this.uploadingMessage = 'Laster opp kontrakt...';
            this.uploadSuccessMessage = '';
            this.uploadErrorMessage = '';

            const formData = new FormData();
            formData.append('file', this.contract);

            await axios.post(`http://localhost:8080/user/projects/admin/contract/${this.selectedProjectId}`, formData, {
                headers: {
                    "Authorization": "Bearer " + tokenStore().user.jwt
                }
            })
                .then(
                    this.uploadSuccessMessage = 'Kontrakt lastet opp!'
                ).catch(error => {
                    console.error(error);
                    this.uploadErrorMessage = 'Feil ved opplasting av kontrakt.';
                });

            this.contract = null;
            this.uploading = false;
            this.uploadingMessage = '';
            this.resetForm();
        },
        async submitProjectFlags() {
            if (!this.selectedProjectId || this.selectedProjectFlags.length === 0) {
                return alert("Velg et prosjekt og minst ett flagg");;
            }

            try {
                await axios.post(
                    `http://localhost:8080/user/projects/admin/${this.selectedProjectId}/flags`,
                    this.selectedProjectFlags, tokenStore().headers);
                alert("Prosjektflagg oppdatert!");
            } catch (err) {
                console.error("Feil ved oppdatering av prosjektflagg:", err);
                alert("Noe gikk galt.");
            }
        },
        async fetchProjectFlags(projectId) {
            try {
                const res = await axios.get(`http://localhost:8080/user/projects/${projectId}/flags`, tokenStore().headers);
                this.selectedProjectFlags = res.data || [];
            } catch (err) {
                console.error("Feil ved henting av prosjektflagg:", err);
            }
        },

        resetForm() {
            this.uploading = false;
            this.selectedProjectId = null;
            this.selectedFlag = null;
            this.logText = '';
        },
        onFileChangeDraft(e) {
            this.video = e.target.files[0];
        },
        onFileChangeImage(e) {
            this.image = e.target.files[0];
        },
        onContractFileChange(e) {
            this.contract = e.target.files[0];
        },

        async fetchInvoiceDraft() {
            if (!this.selectedProjectId) return alert("Velg et prosjekt først");

            try {
                const res = await axios.get(`http://localhost:8080/user/projects/admin/project/${this.selectedProjectId}`, tokenStore().headers);
                this.invoiceDraftUrl = res.data.invoiceURL;
                if (this.invoiceDraftUrl) {
                    this.showInvoiceForm = false;
                } else {
                    this.showInvoiceForm = true;
                }
            } catch (err) {
                console.error(err);
                alert("Feil ved henting av fakturautkast");
            }
        },

        async updateProjectUrl() {
            const body = {
                url: this.invoiceDraftUrl
            }

            axios.post(`http://localhost:8080/fiken/update-url/${this.selectedProjectId}`, body, tokenStore().headers)
                .then(response => {
                    this.invoiceDraftUrl = response.data
                    alert("Link oppdatert")
                })
                .catch(error => alert("Noe gikk galt"))
        },

        async createInvoiceDraft() {
            if (!this.selectedProjectId) return alert("Velg et prosjekt først");

            const selectedUserObj = this.users.find(user => user.id === this.selectedUser);
            const selectedProject = this.userProjects.find(project => project.id === this.selectedProjectId)
            const body = {
                customerName: selectedUserObj.username,
                contractText: selectedProject.name
            };


            try {
                const res = await axios.post(`http://localhost:8080/fiken/create-contract/${this.selectedProjectId}`, body, tokenStore().headers);
                console.log(res.data)
                this.invoiceDraftUrl = res.data.invoiceURL;
                this.showInvoiceForm = false;
                alert("Fakturautkast opprettet!");
            } catch (err) {
                console.error(err);
                alert("Feil ved oppretting av fakturautkast");
            }
        },

    },
    mounted() {
        axios.get('http://localhost:8080/user/', tokenStore().headers)
            .then(response => {
                this.users = response.data.filter(user => user.username !== 'admin');
            })
            .catch(error => console.log(error.response.data));
    },
    watch: {
        selectedProjectId(newProjectId) {
            if (newProjectId) {
                this.fetchProjectFlags(newProjectId);
                this.fetchInvoiceDraft();
            } else {
                this.selectedProjectFlags = [];
                this.invoiceDraftUrl = null;
                this.showInvoiceForm = false;
            }
        }
    }



};


</script>

<style scoped>
.admin-container {
    max-width: 1120px;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #1a1a1a;
    border-radius: 16px;
    box-shadow: 0 0 16px rgba(0, 191, 255, 0.2);
    color: white;
    min-height: 100vh;
}

h1 {
    text-align: center;
    color: #3aaaff;
    margin-bottom: 2rem;
}

.select-wrapper {
    margin-bottom: 1.5rem;
}

.select-wrapper label {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: block;
    color: #3aaaff;
}

select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    background-color: #222;
    border: 2px solid #3aaaff;
    color: white;
    font-weight: bold;
    transition: border 0.3s, box-shadow 0.3s;
}

select:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
}

.upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.upload-card {
    background-color: #2a2a2a;
    border-radius: 12px;
    padding: 1.5rem;
    border: 2px solid #3aaaff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.upload-card h2 {
    color: #3aaaff;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.upload-card input[type="file"],
.upload-card textarea {
    background-color: #1a1a1a;
    border: 2px solid #3aaaff;
    padding: 0.75rem;
    color: white;
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
}

.upload-card button {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #3aaaff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.upload-card button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.4);
}

.uploading-message {
    text-align: center;
    color: #3aaaff;
    font-size: 1.5rem;
    padding: 3rem 0;
}

.contract-upload-card {
    background-color: #2a2a2a;
    border: 2px solid #3aaaff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
}

.contract-upload-card h2 {
    color: #3aaaff;
    margin-bottom: 1rem;
}

.contract-upload-card input[type="file"] {
    background-color: #1a1a1a;
    border: 2px solid #3aaaff;
    padding: 0.75rem;
    color: white;
    border-radius: 8px;
    font-size: 1rem;
}

.contract-upload-card button {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #3aaaff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.contract-upload-card button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.4);
}

.log-entry-section {
    background-color: #2a2a2a;
    border: 2px solid #3aaaff;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;
}

.log-entry-section h2 {
    color: #3aaaff;
    margin-bottom: 1rem;
}

.log-entry-section textarea {
    width: 100%;
    background-color: #1a1a1a;
    border: 2px solid #3aaaff;
    padding: 1rem;
    color: white;
    font-size: 1rem;
    border-radius: 8px;
    resize: vertical;
    min-height: 200px;
    margin-left: -1.7%
}

.log-entry-section button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #3aaaff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.log-entry-section button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.4);
}

.tab-container {
    margin-top: 3rem;
}

.tab-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 1rem;
}

.tab-buttons button {
    padding: 0.75rem 1.5rem;
    border: 2px solid #3aaaff;
    background-color: transparent;
    color: #3aaaff;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.tab-buttons button.active,
.tab-buttons button:hover {
    background-color: #3aaaff;
    color: white;
}

.project-flags-tab {
    background-color: #2a2a2a;
    border: 2px solid #3aaaff;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 2rem;
}

.project-flags-tab h2 {
    color: #3aaaff;
    margin-bottom: 1rem;
}

.checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 10%;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    text-align: left;

}

.checkbox-list input[type="checkbox"] {
    margin-right: 0.5rem;
    transform: scale(1.2);
}

.project-flags-tab button {
    padding: 0.75rem 1.5rem;
    background-color: #3aaaff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.project-flags-tab button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.4);
}

.uploading-message,
.upload-success-message,
.upload-error-message {
    text-align: center;
    margin-top: 1rem;
    font-weight: bold;
    font-size: 1.2rem;
}

.uploading-message {
    color: #3aaaff;
}

.upload-success-message {
    color: #00ff99;
}

.upload-error-message {
    color: #ff5555;
}

.invoice-section {
    margin-top: 3rem;
    padding: 1.5rem;
    border: 2px solid #3aaaff;
    border-radius: 12px;
    background-color: #2a2a2a;
    color: white;
}

.invoice-section label {
    display: block;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
    font-weight: bold;
    color: #3aaaff;
}

.invoice-section button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #3aaaff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.invoice-section button:hover {
    background-color: #00bfff;
    box-shadow: 0 0 12px rgba(0, 191, 255, 0.4);
}




@media(max-width: 900px) {
    .upload-grid {
        grid-template-columns: 1fr;
    }
}
</style>