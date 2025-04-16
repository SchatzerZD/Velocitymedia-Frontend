<template>

    <h1>Draft</h1>

    <div>
        <form @submit.prevent="fileUpload">
            <input type="file" accept="video/*" capture @change="onFileChange($event)"/>
            <button>submit</button>
        </form>
        
    </div>

</template>

<script>
import { tokenStore } from '@/stores/tokenStore';


export default{

    data() {
        return {
            video: null
        }
    },
    methods:{
        fileUpload(){
            console.log(this.video)
        },
        onFileChange(e){
            this.video = e.target.files[0]
        }
    },  

    mounted(){

    }


}

</script>


<style>



</style>