# FrontEnd: Additional Views

Now that we have a Vue project with our first HomeView, we will proceed to create four additional views:
- Details
- Create
- Update
- Delete

We will also create a first javascript  Data Layer with methods to 
- get a list of all the `photos`
- get one `photo` given its `id`
- add a given `photo`
- update a given `photo`
- delete a `photo` given its `id`

For now our data layer will work with an `array` in memory, but we will replace it with one that will communicate with a REST service in a later lab.

- Create a ```datalayer.js``` in your ```src``` folder.
- Define a ```datalayer``` constant as an object containing the following:
  - a ```photos``` property with an `array` with four `photos` (just so that we will see some initial data in our `HomeView` as soon as we switch to this datalayer).
  - a ```getPhotos``` method that returns the ```photos``` `array`.
  - a ```getPhotoById``` method that 
    - accepts an `id`
    - looks for a `photo` in the ```photos``` array with the given `id`
    - returns the found `photo` or `undefined`
  - an ```insertPhoto``` method that 
    - accepts a `photo` object
    - calculates a new `id` by finding the maximum `id` contained in the ```photos``` `array` and adding 1
    - updates the `id` of the given `photo` with newly calculated `id`
    - pushes the `photo` in the `array`
  - a ```deletePhoto``` method that
    - accepts an `id`
    - looks for a `photo` in the ```photos``` `array`
    - deletes the found `photo` or does nothing otherwise
  - an ```updatePhoto``` method that 
    - accepts an `id` and a `photo`
    - looks for a `photo` in the ```photos``` `array` with the given `id`
    - if the `photo` is found
      - updates the properties of the found `photo` with the values of the properties of the given `photo`
    - does nothing otherwise
- Export the datalayer constant as default

In the end your file may look something like this:

```js
const datalayer = {
  photos: [
    {id: 1, title: 'WIN-WIN survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
    {id: 2, title: 'HIGH level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
    {id: 3, title: 'ORGANICALLY grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
    {id: 4, title: 'AGILE frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
  ],
  getPhotos () {
    return this.photos
  },
  getPhotoById (id) {
    return this.photos.find(p => p.id === id)
  },
  insertPhoto (photo) {
    const id = this.photos.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id) + 1
    photo.id = id
    this.photos.push(photo)
  },
  updatePhoto (id, photo) {
    const oldPhoto = this.photos.find(p => p === id)
    if (oldPhoto) {
      oldPhoto.title = photo.title
      oldPhoto.description = photo.description
    }
  },
  deletePhoto (id) {
    const photoIndex = this.photos.findIndex(p => p.id === id)
    this.photos.splice(photoIndex, 1)
  }
}

export default datalayer
```

We are going to start by initializing the state of the data.photos property with an empty array, then during the `created` [lifecycle hook](https://vuejs.org/guide/essentials/lifecycle.html) we will update it with a call to our datalayer.

Let's start with the `Photos` component.

Open ```src\components\Photos.vue```.

Initialize the `photos` property with an empty array.

Import the ```datalayer``` constant from ```/src/datalayer``` and invoke the ```getPhotos``` method during creation of the component.

Your ```<script>``` section should look like this:

```js
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
```

By saving your files you should see the page refresh with the new data.

**NOTE: If Vite is not running:**
- Open your [Visual Studio Code integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal). 
- Type `npm run dev`.

**Note: ensure that the terminal output is ```DONE Compiled successfully```. If it isn't, correct all the errors from top to bottom and save the file again.** 

- Navigate to your website (`http://localhost:5173) and verify that the home page has the **Photos** coming from the datalayer.


Now let's proceed with the new views. We are going to:
- Create four new components
- Create and configure four new routes, each mapped to its corresponding component
- Link the routes in the Home View
- Refactor the components to add the logic to interact with the datalayer

Our first step is to create four new Vue Components.

Open `src/views` and create a `DetailsView.vue` file. 
Fill the file with an initial skeleton of a `template`, `script` and `style`.
Repeat for `CreateView.vue`, `UpdateView.vue` and `DeleteView.vue`.

Your files should look something like this:

```html
<template>
    <h1>Details</h1>
</template>

<script>
export default {
  
}
</script>

<style>

</style>
```

with, of course, the corresponding titles matching the action they represent.

Now let's create our routes.

Open the `src/router/index.js` file.

Import the four components and add four new routes, each bound to the corresponding path and component.
In the end your file may look like this:

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'
import UpdateView from '../views/UpdateView.vue'
import DetailsView from '../views/DetailsView.vue'
import DeleteView from '../views/DeleteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/update',
      name: 'update',
      component: UpdateView
    },
    {
      path: '/details',
      name: 'details',
      component: DetailsView
    },
    {
      path: '/delete',
      name: 'delete',
      component: DeleteView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```  

Save all your files, ensure that everything gets compiled correctly and try to navigate to the paths you configured by entering the addresses on your browser. You should see the corresponding component replacing Home.

The Details, Update, and Delete views need some data to display and the route should contain a parameter in the form of an id. We are going to use [Dynamic Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)

> A param is denoted by a colon `:`. When a route is matched, the value of its `params` will be exposed as `this.$route.params` in every component. 

Let's change the `src/router/index.js` to add a dynamic `id` parameter at the end of the `details`, `update` and `delete` routes:

```js
{
  path: '/update/:id',
  name: 'update',
  component: UpdateView
},
{
  path: '/details/:id',
  name: 'details',
  component: DetailsView
},
{
  path: '/delete/:id',
  name: 'delete',
  component: DeleteView
}
```

Now let's update the components to show the id parameter contained in the global `$route` object:

```html
<template>
    <h1>Details {{ $route.params.id }}</h1>
</template>
``` 

Repeat also for the Update and Create.
Save and navigate to `details/3`.
You should see in the header the number `3` following the `Details` word.

We will follow the same pattern of initializing an empty photo property in the data function and then refresh it during the creation of our component.

Our `script` tag will look like this:

```js
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
```

Now let's update our template to show the photo metadata:

```html
<template>
<div>
    <h1>Details {{ $route.params.id }}</h1>
    <div>{{ photo.id }}</div>
    <div>{{ photo.title }}</div>
    <div>{{ photo.description }}</div>
</div>
</template>
```

Save and check that the details view updates correctly when you enter an address such as `/details/1` and `/details/2`.

Repeat the same steps for the Delete View.
In the end your Delete.vue should look like this:

```html
<template>
<div>
  <h1>Delete {{ $route.params.id }}</h1>
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
```

We will repeat this process also for the `Update View`, but our template will be different, because we will have to render a form and [bind](https://vuejs.org/guide/essentials/forms.html) a textbox and a textarea to our photo properties in order to let the user input the new values.

This is how our UpdateView will look like:

```html
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
    created (){
        this.photo = datalayer.getPhotoById(+this.$route.params.id)
    }
}
</script>
```

Lastly, we will update the Create View. It won't be necessary to update the photo data during creation, seen the fact that this route is not dynamically bound.

The Create View will have the following code:

```html
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
    }
}
</script>
```

Of course neither the `DeleteView`, nor the `UpdateView` and the `CreateView` do anything, so let's fix that.
Let's start with the `DeleteView`.

We're going to [bind a click event](https://vuejs.org/guide/essentials/event-handling.html) of a link tag to a [method event handler](https://vuejs.org/guide/essentials/event-handling.html#method-handlers) and we are going to make sure that it [prevents the default form behavior](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers).
The method will invoke the datalayer to delete the corresponding photo and will then [programmatically navigate](https://router.vuejs.org/guide/essentials/navigation.html) to the root.

The `template` will now contain 

```html
<a href="#" @click.prevent="deletePhoto">DELETE PHOTO</a>
```

and in the `script` we will add a 

```js
methods: {
  deletePhoto () {
    datalayer.deletePhoto(+this.$route.params.id)
    this.$router.push({name: 'home'})
  }
}
```

Save and navigate to `/delete/2`, then click on the link and check that the photo is deleted and that you return to the home view.

Now on to the `Update` view. We will handle the click event of a link as well. The handler method will invoke the datalayer to update the photo and it will navigate back to the root.

Let's add the following code to the `template`:

```html
<a href="#" @click.prevent="updatePhoto">UPDATE PHOTO</a>
```

And now let's handle the click event in a new `updatePhoto` method in the `script` section.

```js
methods: {
  updatePhoto () {
    datalayer.updatePhoto(+this.$route.params.id, this.photo)
    this.$router.push({name: 'home'})
  }
}
``` 

Save, navigate to `/update/2`, change some values, click on the link and verify that the photo gets updated and that you are sent back to the root.

Our last step is to complete the `CreateView`. We will have to handle the click event of a link one last time and invoke the datalayer to create the new photo.

Updated template:

```html
<a href="#" @click.prevent="insertPhoto">INSERT PHOTO</a>
```

Updated script:
```js
methods: {
  insertPhoto () {
      datalayer.insertPhoto(this.photo)
      this.$router.push({name: 'home'})
    }
}
``` 

Save, navigate to `/create`, insert some values, click on the link and verify that the photo gets created and that you are sent back to the root.

The very last thing we need to do is to add some [navigation links](https://router.vuejs.org/guide/#router-link) to our `App.vue` and to the `Photos.vue` component.

We will insert a link to view the details, update and delete for each photo (passing the specific id to the route) and one link to create a new photo.

The `template` of our `App.vue` becomes:

```html
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/create">Create</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
```

Save and verify that you can navigate to the `create` route from any page.

Now let's update the `Photos` component.

Add three new `<router-link>` tags to navigate to the `update`, `details` and `delete` routes, passing the `id` as a `param`.

The template of the `Photos` component becomes:

```html
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
```

Save and verify that each photo now link to its own edit, update and delete.

Our views are functionally ready but their appearance could improve. We are going to take care of their styles in the next lab.

Go to `Labs/Lab03`, open the `readme.md` and follow the instructions thereby contained.