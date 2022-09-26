<template>
<v-form>
  <v-text-field label="Title" v-model="photo.title"></v-text-field>
  <v-textarea label="Description" v-model="photo.description" hint="Description"></v-textarea>
  <v-btn @click="updatePhoto" color="primary" variant="text">UPDATE PHOTO</v-btn>
</v-form>
</template>

<script>
import datalayer from '../datalayer'
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
    async created () {
        this.photo = await datalayer.getPhotoById(+this.$route.params.id)
    },
    methods: {
        async updatePhoto () {
            await datalayer.updatePhoto(+this.$route.params.id, this.photo)
            this.$router.push('/')
        }
    }
}
</script>