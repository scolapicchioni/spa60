<template>
<form>
  <div>
    <label for="title">Photo Title</label>
    <input id="title" v-model="photo.title" type="text" placeholder="title"/>
  </div>
  <div>
    <label for="description">Photo Description</label>
    <textarea id="description" v-model="photo.description" placeholder="description"></textarea>
  </div>
  <a href="#" @click.prevent="updatePhoto">UPDATE PHOTO</a>
</form>
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
    created (){
        this.photo = datalayer.getPhotoById(+this.$route.params.id)
    },
    methods: {
        updatePhoto () {
            datalayer.updatePhoto(+this.$route.params.id, this.product)
            this.$router.push({name: 'home'})
        }
    }
}
</script>