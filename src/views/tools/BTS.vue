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
            <div class="gallery-wrapper">
                <div class="image-grid">
                    <div v-for="image in images" :key="image.id" class="image-tile" @click="selectImage(image)">
                        <img loading="lazy" :src="'../../../media/images/' + getImageName(image.imagePath)"
                            :alt="getImageName(image.imagePath)" />
                    </div>
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
    padding: 4rem 2rem;
    color: white;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
    padding-top: 0px;
}

.page-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #3aaaff;
}

.loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    color: #3aaaff;
}

.image-grid {
    column-count: 4;
    column-gap: 1rem;
    padding: 1rem;
}

.image-tile {
    display: inline-block;
    margin-bottom: 1rem;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #3aaaff;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    break-inside: avoid;
}

.image-tile img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.image-tile:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(58, 170, 255, 0.5);
}


.modal-image-container {
    position: relative;
    width: 90vw;
    max-width: 1000px;
    height: 80vh;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0d0d0d;
    border-radius: 16px;
    overflow: hidden;
    padding: 1rem;
}

.modal-image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
}

.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    background: none;
    border: none;
    color: #3aaaff;
    cursor: pointer;
    z-index: 10;
    padding: 0 1rem;
    transition: color 0.3s;
}

.nav-arrow:hover {
    color: #00bfff;
}

.nav-arrow.left {
    left: 0;
}

.nav-arrow.right {
    right: 0;
}

.gallery-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.image-grid {
    column-gap: 1.5rem;
    padding: 1rem 0;
}




.image-tile {
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}



@media (max-width: 768px) {
    .modal-image-container {
        flex-direction: column;
        gap: 1rem;
    }

    .nav-arrow {
        font-size: 2.5rem;
    }
}

@media (max-width: 1200px) {
    .image-grid {
        column-count: 3;
    }
}

@media (max-width: 900px) {
    .image-grid {
        column-count: 2;
    }
}

@media (max-width: 600px) {
    .image-grid {
        column-count: 1;
    }
}
</style>