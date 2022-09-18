<template>
<div>
    <h1>Details {{ $route.params.id }}</h1>
    <div>{{ photo.id }}</div>
    <div>{{ photo.title }}</div>
    <div>{{ photo.description }}</div>
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
    }
}
</script>