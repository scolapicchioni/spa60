<template>
<v-form>
  <v-text-field label="Title" v-model="photo.title"></v-text-field>
  <v-textarea label="Description" v-model="photo.description" hint="Description"></v-textarea>
  <v-btn @click="insertPhoto" color="primary" variant="text">INSERT PHOTO</v-btn>
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
    methods: {
        insertPhoto () {
            datalayer.insertPhoto(this.photo)
            this.$router.push({name: 'home'})
        }
    }
}
</script>