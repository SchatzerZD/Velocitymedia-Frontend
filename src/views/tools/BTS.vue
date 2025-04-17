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


<style scoped>
.bts-container {
    padding: 2rem;
    color: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #8ec5fc;
}

.loading-screen {
    text-align: center;
    font-size: 1.5rem;
    color: #bfc9ff;
}

.image-grid {
    display: grid;
    gap: 1.5rem;
    padding: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.image-tile {
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: #1a1a2e;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    max-height: 200px;
}

.image-tile:hover {
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(142, 197, 252, 0.6);
}

.image-tile img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.modal-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 80vh;
    padding: 1rem;
}

.modal-image-wrapper img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.modal-image-container {
    width: 65vw;
    height: 70vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1a1a2e;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    margin: 0 auto;
}


.modal-image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.08);
    border: none;
    font-size: 2rem;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s ease;
}

.nav-arrow:hover {
    background: rgba(255, 255, 255, 0.15);
}

.nav-arrow.left {
    left: 1rem;
}

.nav-arrow.right {
    right: 1rem;
}
</style>