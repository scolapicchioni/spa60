<template>
    <v-row>
        <v-col v-for="photo in photos" :key="photo.id">
            <photo :photo="photo" details update requestdelete/>
        </v-col>
    </v-row>
</template>

<script>
import datalayer from '../datalayer'
import Photo from "./Photo.vue"
export default {
    data () {
        return {
            photos: []
        }
    },
    components: {
        Photo
    },
    async created () {
        this.photos = await datalayer.getPhotos()
    }
}
</script>