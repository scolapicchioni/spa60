<template>
    <div>
        <div v-for="photo in photos" :key="photo.id">
            <p>{{ photo.id }} - {{ photo.title }}</p>
            <p>{{ photo.description }}</p>
            <router-link :to="{name: 'details', params: {id: photo.id}}">details</router-link>
            <router-link :to="{name: 'update', params: {id: photo.id}}">edit</router-link>
            <router-link :to="{name: 'delete', params: {id: photo.id}}">delete forever</router-link>
        </div>
    </div>
</template>

<script>
import datalayer from '../datalayer'
export default {
    data () {
        return {
            photos: []
        }
    },
    created (){
        this.photos = datalayer.getPhotos()
    }
}
</script>