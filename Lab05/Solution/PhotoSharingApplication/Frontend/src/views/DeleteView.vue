<template>
<v-row>
    <v-col>
        <v-card elevation="10">
            <v-card-title>{{ photo.id }} - {{ photo.title }}</v-card-title>
            <v-card-text>{{ photo.description }}</v-card-text>
            <v-card-actions>
                <v-btn variant="text" color="primary" :to="{name: 'home'}">CANCEL</v-btn>
                <v-btn variant="text" color="error" @click="deletePhoto">CONFIRM DELETE</v-btn>
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