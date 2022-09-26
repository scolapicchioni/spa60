<template>
<v-row>
    <v-col>
        <photo :photo="photo" update requestdelete />
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
    }
}
</script>