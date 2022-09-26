<template>
    <v-card elevation="10">
        <v-card-title>{{ photo.id }} - {{ photo.title }}</v-card-title>
        <v-card-text>
            <p>{{ photo.description }}</p>
            <p>{{ photo.userName }}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn variant="text" color="primary" :to="{name: 'details', params: {id: photo.id}}" v-if="details===true">details</v-btn>
            <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}" v-if="showUpdateButton">edit</v-btn>
            <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}" v-if="showDeleteButton">delete</v-btn>
            <v-btn variant="text" color="primary" :to="{name: 'home'}" v-if="showConfirmDeleteButtons">CANCEL</v-btn>
            <v-btn variant="text" @click="$emit('deletePhoto')" color="error" v-if="showConfirmDeleteButtons">CONFIRM DELETE</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { useUser } from '../user.js'
export default {
    setup(){
        const { user } = useUser()
        return { user }
    },
    props: {
        photo : Object,
        details: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        requestdelete: {type: Boolean, default: false},
        confirmdelete: {type: Boolean, default: false}
    },
    emits: ['deletePhoto'],
    computed: {
        showDeleteButton() {
            return this.requestdelete && this.user.name === this.photo.userName
        },
        showConfirmDeleteButtons(){
            return this.confirmdelete && this.user.name === this.photo.userName
        },
        showUpdateButton() {
            return this.update && this.user.name === this.photo.userName
        }
    }
}
</script>