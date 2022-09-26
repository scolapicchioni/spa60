<template>
<v-row>
    <v-col>
        <photo :photo="photo" confirmdelete @delete-photo="deletePhoto" />
    </v-col>
</v-row>
</template>
    
<script>
import datalayer from '../datalayer'
import Photo from "../components/Photo.vue"
export default {
    data () {
        return {
            photo: {
                id: 0,
                title: "",
                description: ""
            }
        }
    },
    components:{
        Photo
    },
    async created () {
        this.photo = await datalayer.getPhotoById(+this.$route.params.id)
    },
    methods: {
        async deletePhoto () {
            await datalayer.deletePhoto(+this.$route.params.id)
            this.$router.push({name: 'home'})
        }
    }
}
</script>