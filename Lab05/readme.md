# FrontEnd: Connecting with the BackEnd

In this lab we're going connect our two projects to each other.

Our client will issue http requests to our server and it will handle the results to update the model. Vue will take care of updating the UI.

Let's start by our `frontend` project.

We're going to replace our old datalayer with a new one that uses 
- [fetch API](https://web.dev/introduction-to-fetch/) 
- [Promises](https://web.dev/promises/) 
- [async functions](https://web.dev/javascript-async-functions/)

### Modify the JavaScript datalayer to issue http requests

Under the `src` folder of the `Frontend` project, open `datalayer.js` in Visual Studio Code.

We don't need a `photos` array anymore, so we will remove it.
What we do need is a property to store the address of the service.

In the `datalayer` constant, remove 

```js
photos: [
  {id: 1, title: 'WIN-WIN survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
  {id: 2, title: 'HIGH level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
  {id: 3, title: 'ORGANICALLY grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
  {id: 4, title: 'AGILE frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
]
```
  
and replace it with

```js
serviceUrl: 'https://localhost:7241/api/photos'
```

**Note: Your port number may vary, make sure to use the port assigned by Visual Studio. If you don't know which one it is, open tour `Backend` project in Visual Studio, right click the project name in the `Solution Explorer`, select `Properties`. Under `Debug->General`, open the launch profiles and check the address listed as `App Url`**


Now let's change the `getPhotos` method by fetching a request to our service, asynchronously waiting for the result and returning the response parsed as json. Don't forget to turn the method into an `async function`.

```js
async getPhotos () {
  const response = await fetch(this.serviceUrl)
  return response.json()
}
```

The `getPhotoById` will be very similar. The only difference is the address to fetch, which will contain the `id` of the photo to retrieve:

```js
async getPhotoById (id) {
  const response = await fetch(`${this.serviceUrl}/${id}`)
  return response.json()
}
```

The `insertPhoto` will pass the `fetch` method not only the url to call, but also an object with three properties:
- `method` - set to `POST`
- `body` - set to a json string representing the `photo` parameter
- `headers` - set to an instance of the `Header` class, with a `Content-type` property set to `application/json`

```js
async insertPhoto (photo) {
  const response = await fetch(this.serviceUrl, {
    method: 'POST',
    body: JSON.stringify(photo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  return response.json()
}
```

The `updatePhoto` will be very similar. The only differences are
- the address to fetch, which will contain the `id` of the photo to update
- the `method` option, set to `PUT`

```js
async updatePhoto (id, photo) {
  return fetch(`${this.serviceUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(photo),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
}
```

The `deletePhoto` will also fetch an url containing the `id` of the photo to delete. The `method` will be `delete` and we won't need neither the `body` nor the `header`.

```js
async deletePhoto (id) {
  return fetch(`${this.serviceUrl}/${id}`, {
    method: 'DELETE'
  })
}
```

By starting **both** projects, you will notice an error in the browser console: 

```
Access to fetch at 'https://localhost:7241/api/photos' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

This happens because our server does not allow [Cross Origin Requests (CORS)](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-6.0). Let's proceed to modify our server project by using the [CORS with named policy and middleware](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-6.0#cors-with-named-policy-and-middleware) strategy.

- Open `Program.cs`
- Locate the following code:

```cs
var builder = WebApplication.CreateBuilder(args);
```

- **After** that, add the following code:

```cs
builder.Services.AddCors(options =>
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    )
);
```

- **BEFORE**  

```
app.MapControllers();
```

add the following code:

```cs
app.UseCors("frontend");
```

### The FrontEnd Views

Now we need to modify our Views to asyncronously wait for our datalayer.

Let's start with our `src/components/Photos.vue` component. The `created` method has to become and `async function` and it has to `await` the `getPhotos`.

```js
async created () {
  this.photos = await datalayer.getPhotos()
}
```

Same goes for the `src/views/DetailsView.vue` view, where the `created` method has to become `async functions` and has to `await` for the `getPhotoById` method of our `datalayer` object.

```js
async created () {
  this.photo = await datalayer.getPhotoById(+this.$route.params.id)
}
```

The `insertPhoto` of the `src/views/CreateView.vue` view will also turn into an `async function`:

```js
async insertPhoto () {
  await datalayer.insertPhoto(this.photo)
  this.$router.push('/')
}
```

The `created` and `updatePhoto` of the `scr/views/UpdateView.vue` view will get the same facelift.

```js
async created () {
  this.photo = await datalayer.getPhotoById(+this.$route.params.id)
},
methods: {
  async updatePhoto () {
    await datalayer.updatePhoto(+this.$route.params.id, this.photo)
    this.$router.push('/')
  }
}
```

Last but not least, let's not forget `src/views/DeleteView.vue`

```js
async created () {
  this.photo = await datalayer.getPhotoById(+this.$route.params.id)
},
methods: {
  async deletePhoto () {
    await datalayer.deletePhoto(+this.$route.params.id)
    this.$router.push({name: 'home'})
  }
}
```

Save and verify that the client can send and receive data to and from the server.

We did not implement any security yet. Our next lab will start with setup and configure a new project that will act as an *Authentication Server*. We will then protect the Create operation and we will use the Authentication Server to authenticate the user and have the client gain access to the protected operation.

Go to `Labs/Lab06`, open the `readme.md` and follow the instructions thereby contained.   