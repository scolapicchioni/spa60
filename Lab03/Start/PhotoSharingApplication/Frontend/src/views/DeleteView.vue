<template>
    <div>
        <h1>Delete {{ $route.params.id }}</h1>
        <div>{{ photo.id }}</div>
        <div>{{ photo.title }}</div>
        <div>{{ photo.description }}</div>
        <a href="#" @click.prevent="deletePhoto">DELETE PHOTO</a>
    </div>
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
            deletePhoto () {
                datalayer.deletePhoto(+this.$route.params.id)
                this.$router.push({name: 'home'})
            }
        }
    }
    </script>