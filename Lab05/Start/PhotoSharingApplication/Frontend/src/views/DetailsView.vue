<template>
<v-row>
    <v-col>
        <v-card elevation="10">
            <v-card-title>{{ photo.id }} - {{ photo.title }}</v-card-title>
            <v-card-text>{{ photo.description }}</v-card-text>
            <v-card-actions>
                <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}">edit</v-btn>
                <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}">delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</v-row>
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