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
    <a href="#" @click.prevent="insertPhoto">INSERT PHOTO</a>
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
    methods: {
        insertPhoto () {
            datalayer.insertPhoto(this.photo)
            this.$router.push({name: 'home'})
        }
    }
}
</script>