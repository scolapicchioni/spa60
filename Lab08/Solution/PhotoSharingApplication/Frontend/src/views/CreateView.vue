<template>
<v-form>
  <v-text-field label="Title" v-model="photo.title"></v-text-field>
  <v-textarea label="Description" v-model="photo.description" hint="Description"></v-textarea>
  <v-file-input accept="image/*" label="Select Picture from device" @update:model-value="onFileChanged"></v-file-input>
  <v-btn variant="text" @click="capture">
      <v-icon>mdi-camera</v-icon>
    </v-btn>
    <video ref="videoElement" width="100%"></video>
  <v-img :src="photo.picture"></v-img>
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
                description: "",
                picture: ''
            },
            selectedFile: null,
            mediaStream : null,
        }
    },
    async mounted () {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        this.mediaStream = mediaStream
        this.$refs.videoElement.srcObject = mediaStream
        this.$refs.videoElement.play()
    },
    unmounted () {
        const tracks = this.mediaStream.getTracks()
        tracks.map(track => track.stop())
    },
    methods: {
        async insertPhoto () {
            await datalayer.insertPhoto(this.photo)
            this.$router.push('/')
        },
        onFileChanged (theFiles) {
            console.dir(theFiles)
            this.selectedFile = theFiles[0]
            this.updateImage()
        },
        async capture () {
            const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            this.selectedFile = await imageCapture.takePhoto()
            this.updateImage()
        },
        updateImage () {
            const reader = new FileReader()
            reader.onload = () =>  this.photo.picture = reader.result 
            reader.readAsDataURL(this.selectedFile)
        }
    }
}
</script>