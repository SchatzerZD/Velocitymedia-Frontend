<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
import Modal from '@/components/Modal.vue';
</script>

<template>
    <div class="bts-container">
        <div v-if="loading" class="loading-screen">
            <h1>Loading behind the scenes...</h1>
        </div>

        <div v-else>
            <h1 class="page-title">Behind the Scenes</h1>
            <div class="image-grid">
                <div v-for="image in images" :key="image.id" class="image-tile" @click="selectImage(image)">
                    <img :src="'../../../media/images/' + getImageName(image.imagePath)"
                        :alt="getImageName(image.imagePath)" />
                </div>
            </div>
        </div>
    </div>


    <Modal v-if="showModal" @closeModal="toggleModal" theme="black">
        <div class="modal-image-container">
            <button class="nav-arrow left" @click.stop="showPrevImage">&#10094;</button>
            <img :src="'../../../media/images/' + getImageName(selectedImage.imagePath)"
                :alt="getImageName(selectedImage.imagePath)" />
            <button class="nav-arrow right" @click.stop="showNextImage">&#10095;</button>
        </div>
    </Modal>




</template>



<script>

export default {

    data() {
        return {
            images: [],
            loading: false,
            showModal: false,
            selectedImage: null
        }
    },
    methods: {
        getImageName(filePath) {
            var stringArray = filePath.split("\\")
            var imageName = stringArray[stringArray.length - 1]
            return imageName
        },
        selectImage(image) {
            this.selectedImage = image
            this.toggleModal()
        },
        toggleModal() {
            this.showModal = !this.showModal
        },
        showNextImage() {
            const currentIndex = this.images.findIndex(img => img.id === this.selectedImage.id);
            if (currentIndex < this.images.length - 1) {
                this.selectedImage = this.images[currentIndex + 1];
            }
        },
        showPrevImage() {
            const currentIndex = this.images.findIndex(img => img.id === this.selectedImage.id);
            if (currentIndex > 0) {
                this.selectedImage = this.images[currentIndex - 1];
            }
        }

    },
    async mounted() {
        this.loading = true
        await axios.get('http://localhost:8080/image/', tokenStore().headers)
            .then(response => {
                this.images = response.data
                console.log(this.images)
            })
            .catch(error => console.log(error.response.data))
        this.loading = false
    }

}


</script>


<style scoped></style>