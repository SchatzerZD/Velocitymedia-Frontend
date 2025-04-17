<script setup>
import Row from '@/components/Row.vue'
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
</script>

<template>
    <div class="bts-container">
        <div v-if="loading" class="loading-screen">
            <h1>Loading behind the scenes...</h1>
        </div>

        <div v-else>
            <h1 class="page-title">Behind the Scenes</h1>
            <div class="image-grid">
                <div v-for="image in images" :key="image.id" class="image-tile" @click="handleImageClick(image)">
                    <img :src="'../../../media/images/' + getImageName(image.imagePath)"
                        :alt="getImageName(image.imagePath)" />
                </div>
            </div>
        </div>
    </div>
</template>



<script>

export default {

    data() {
        return {
            images: [],
            loading: false
        }
    },
    methods: {
        getImageName(filePath) {
            var stringArray = filePath.split("\\")
            var imageName = stringArray[stringArray.length - 1]
            return imageName
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
</style>