# Images

In this lab we are going to add an image to each photo.
We will give users the possibility to either select an existing image from their device or to take a picture with their camera, using the [Media Devices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) native functionality.
Server side we will modify our REST Service to send and receive files together with the Photo data and we will store each file in our SQL DataBase.

## Showing existing Photos images

We will first update the Model and DataBase server side, then we will proceed to update views on the client to show the picture on each photo.

## Wep Api

We will start by modifying the server side.

### Modify the Model and DB structure by adding fields to hold the picture data

The info we need to store in the DB is a string for the picture.

In Visual Studio, open the `Models/Photo.cs` file and add the following properties:

```cs
public string Picture { get; set; }
```

Open the `Package Manager Console` and type the following commands:

```
Add-Migration "PhotoPicture"
Update-DataBase
```

Open your `SQL Server Object Explorer`, locate your `MarketPlace` database, open the `Photos` table, select all the photos and delete them.

Let's proceed to show the images on our client application.

## The Client

Seen the fact that we use Vuetify, we can follow the [example](https://next.vuetifyjs.com/en/components/cards/#media-with-text) to understand how to show a picture in a card

We will dynamically bind the `src` attribute to the `photo.picture`.

Open the `src/components/Photo.vue` file, wrap the `v-card-title` into a [`v-img`](https://next.vuetifyjs.com/en/components/images/) and bind its `src` property to `photo.picture`

```html
<v-img class="white--text" :src="photo.picture">
  <v-card-title class="align-end fill-height">{{ photo.id }} - {{ photo.name }}</v-card-title>
</v-img>
```

## Photo Create - Now with pictures!

It's time for us to tackle the photo picture upload. We will need to update once again both the server and the client side.

### Client side : select a file from hard disk

Our final goal is to give the user the possibility to either chose the file from hard disk or to snap a picture with the camera, but we will start by implementing the first option.

To let the user select a file from hard disk, we can use a [`v-file-input`](https://next.vuetifyjs.com/en/components/file-inputs/) element.
We can handle its `change` event to get a [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
We will use a [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) to generate a [data url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
This string will be added as a new property to the `photo` and sent to the server, along with the rest of the information.
We will also use the same string to display it on an `img` component on the page, so that the user can see what is going to be uploaded.


On the `CreateView.vue`, we will:
- Update the `photo` property to include a string for the `picture`
- Add a `v-file` and a `v-img` element
- Add a `selectedFile` property to the object returned by the `data` function (we don't want to send the file to the server, so we will keep it separate from the photo)
- Handle the `change` event of the `v-file` element in an `onFileChanged` method to 
  - update the `selectedFile` with the file 
  - refresh the `photo.picture` property  

Open the `src/views/CreateView.vue` file, locate the textarea for the photo description and add the following code:

```html
<v-row>
  <v-col>
    <v-file-input accept="image/*" label="Select Picture from device" @update:model-value="onFileChanged"></v-file-input>
  </v-col>
</v-row>
<v-row>
  <v-col>
    <v-img :src="photo.picture"></v-img>
  </v-col>
</v-row>
```

Now locate the `data` function in the `<script>` tag and update it as follows:

```js
data () {
  return {
    photo: {
      id: 0,
      name: '',
      description: '',
      picture: ''
    },
    selectedFile: null
  }
}
```

Now add the `onFileChanged` method under the `methods` property of your component:

```js
onFileChanged (theFiles) {
  console.dir(theFiles)
  this.selectedFile = theFiles[0]
  this.updateImage()
}
```

Let's also add an `updateImage` method, whose job is to read the file by using the `FileReader` and update the `photo.picture` property:

```js
updateImage () {
  const reader = new FileReader()
  reader.onload = () =>  this.photo.picture = reader.result 
  reader.readAsDataURL(this.selectedFile)
}
```

If you run the application now, you should be able to go to the `CreateView`, select a file from the hard disk by clicking on the `File Upload` button and you should see the image appearing on the page.
Also, if you save the photo, you should see that the photo, along with its picture, gets sent to the server, saved to the db and sent back to the `Home` view.

### The camera

The next step is to update the client so that the user can take a picture with the device's camera.

We're going to use two APIs:
- [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) 
- [ImageCapture](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture).

There are many examples that we can use to understand how it works:
- https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Image_Capture_API
- https://googlechrome.github.io/samples/image-capture/grab-frame-take-photo.html

We are going to follow this [tutorial](https://medium.com/theodo/a-progressive-web-application-with-vue-js-webpack-material-design-part-4-96c8c216810b) that is specific for VueJs.

We will: 
- Add a `video` and `button` elements in our template
- Handle: 
  - The `mounted` event to 
    - get the video MediaStream
    - link it to the `video` element 
    - play the video so that the user can see the camera stream on the page
  - The `click` of the `button` to 
    - create an `ImageCapture` from the `mediaStreamTrack`
    - take a photo
    - update the `selectedFile` and the `image` element
  - The `destroyed` event to stop the stream when the user exits the page

On the `src/views/CreateView.vue` file, locate the `v-file-input` component and add the following code:

```html
<v-row>
  <v-col>
    <v-btn variant="text" @click="capture">
      <v-icon>mdi-camera</v-icon>
    </v-btn>
    <video ref="videoElement" width="100%"></video>
  </v-col>
</v-row>
``` 

In the `<script>` tag, hook the `mounted` event to the following code:

```js
async mounted () {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
  this.mediaStream = mediaStream
  this.$refs.videoElement.srcObject = mediaStream
  this.$refs.videoElement.play()
}
```

Then handle the `unmounted` event with this code:

```js
unmounted () {
  const tracks = this.mediaStream.getTracks()
  tracks.map(track => track.stop())
}
```

And finally add the following method in the `methods` section:

```js
async capture () {
  const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
  const imageCapture = new window.ImageCapture(mediaStreamTrack)
  this.selectedFile = await imageCapture.takePhoto()
  this.updateImage()
}
```

Because the `Blob` returned by the `takePhoto` has the same interface as the `File` returned by the `file` element, we don't need to add anything else. If you run the application you should be able to see the camera stream, take a picture and upload it with a new photo.
