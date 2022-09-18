# FrontEnd: Styling the views with the vuetify

There are many different [CSS frameworks](https://onaircode.com/top-css-frameworks-web-designer/) around.
[Many](https://www.sitepoint.com/free-material-design-css-frameworks-compared/) implement the [Google Material Design Guidelines](https://m3.material.io/).
It's hard to make a choice, so we'll just jump right in and select what the [community advices as popular choice](https://vue-community.org/guide/ecosystem/ui-libraries.html#vuetify): vuetify 

## Vuetify

> Vuetify is a semantic component framework for Vue. It aims to provide clean, semantic and reusable components that make building your application a breeze. Build amazing applications with the power of Vue, Material Design and a massive library of beautifully crafted components and features.

The official version of Vuetify supports Vuejs 2 with vue-cli, but the [next version](https://next.vuetifyjs.com/en/introduction/why-vuetify/) is in development and it supports Vue3 and Vite, so that's what we're going to use. 

Let's follow the [documentation](https://next.vuetifyjs.com/en/getting-started/installation/#adding-vuetify)

Open a terminal, navigate to the frontend folder (Lab03/Solution/PhotoSharingApplication/frontend) and type

```
vue add vuetify
```

- At the question `Choose a preset` select `Vuetify 3 - Vite (preview)`
- At the question `Would you like to install Vuetify 3 nightly build? (WARNING: Nightly builds are intended for development testing and may include bugs or other issues.) (y/N)` answer `y`

When the download is done, we can start checking which files have been modified.
- `index.html` has a `title` containing **Vuetify 3 Vite Preview**
- `src/main.js` now 
  - imports and uses the `vuetify` plugin configuring in `src/plugins/vuetify.js` 
  - imports and uses new fonts through a `src/plugins/webfontloader.js` which imports the `Roboto` font 
- `App.vue` has a different layout and our previous `router-link` have been removed. 

**NOTE: If the plugin has not been correctly [configured](https://vitejs.dev/guide/api-plugin.html#plugins-config) and you get warnings, add the plugin yourself by opening `vite.config.js`, importing `vite-plugin-vuetify` and adding it as a plugin**

Your `vite.config.js` chould look like this:

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## App

We are ready to proceed to modify `App.vue`.

The first component we need to add is the [Application](https://next.vuetifyjs.com/en/components/application/)

>In Vuetify, the `v-app` component and the `app` prop on components like `v-navigation-drawer`, `v-app-bar`, `v-footer` and more, help bootstrap your application with the proper sizing around `<v-main>` component. This allows you to create truly unique interfaces without the hassle of managing your layout sizing. The `v-app` component is **REQUIRED** for all applications. This is the mount point for many of Vuetify’s components and functionality and ensures that it propagates the default application variant (dark/light) to children components and also ensures proper cross-browser support for certain click events in browsers like Safari. `v-app` should only be rendered within your application ONCE.

Let's take the [Default application markup
](https://next.vuetifyjs.com/en/components/application/#default-application-markup).

As you can see, we got a 
- [Navigation drawer](https://next.vuetifyjs.com/en/components/navigation-drawers/)
- [App Bar](https://next.vuetifyjs.com/en/components/app-bars/)
- [Footer](https://next.vuetifyjs.com/en/components/footers/)

Let's remove the navigation drawer and footer. Let's also fill up our app bar by giving it the primary color and adding three [icon buttons](https://next.vuetifyjs.com/en/components/icons/#buttons) to navigate to the `home`, `about` and `create` route. 

```html
<template>
<v-app>
  <v-app-bar app color="primary">
    <v-toolbar-title>Market Place</v-toolbar-title>

    <div class="flex-grow-1"></div>

    <v-btn icon :to="{name: 'home'}">
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn icon :to="{name: 'about'}">
      <v-icon>mdi-chat</v-icon>
    </v-btn>
    
    <v-btn icon :to="{name: 'create'}">
      <v-icon>mdi-pencil-plus</v-icon>
    </v-btn>

  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-content>
</v-app>
</template>
```
If you navigate to your home page, you should already see a better layout than before.

## Theme Customization

We can also empty out the `<style>` section and proceed to change the [Theme](https://next.vuetifyjs.com/en/features/theme/)
Feel free to use the [Theme generator](https://theme-generator.vuetifyjs.com/) to customize your own color scheme, then apply those color to the `src/plugins/vuetify.js` file, which could become something like this:

```js
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme: {
          dark: false,
          colors: {
            'primary': '#ff9800',
            'secondary': '#cddc39',
            'accent': '#8bc34a',
            'error': '#f44336',
            'warning': '#e91e63',
            'info': '#00bcd4',
            'success': '#795548',
            'anchor': '#cddc39'
          }
        }
      }
    }
  }
)
```

Save and verify that your color scheme is changed.

## HomeView

Let's restore our `views/HomeView.vue` to show our `Photos` component:

```html
<script setup>
  import Photos from '../components/Photos.vue'
</script>
  
<template>
  <Photos />
</template>
```

## Photos

Time to tackle the `Photos` component.


We will align our products into a [Grid](https://next.vuetifyjs.com/en/components/grids/).
We already have a container in the `App`, so let's create one row and let's wrap each product into a column that spans one third of the row if the screen width is large enough and occupies the whole row if the screen is small. 

```html
  <v-row>
    <v-col
     v-for="photo in photos" :key="photo.id"
     cols="12" md="4"
    >      
    </v-col>
  </v-row>
```

Each photo will be displayed into a [Card](https://next.vuetifyjs.com/en/components/cards/).

The inside of the column will have this:

```html
<v-card elevation="10">
  <v-card-title>{{ photo.id }} - {{ photo.title }}</v-card-title>
  <v-card-text>{{ photo.description }}</v-card-text>
  <v-card-actions>
    <v-btn variant="text" color="primary" :to="{name: 'details', params: {id: photo.id}}">details</v-btn>
    <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}">edit</v-btn>
    <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}">delete</v-btn>
  </v-card-actions>
</v-card>
```

Save and verify that the home page has now cards. Also, resize the browser and verify that the cards resize depending on the viewport width.

The template section of the `DetailsView` component will look pretty much like the `Photos` component.

```html
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
```

Let's tackle the `CreateView` View.
We will need a [Form](https://next.vuetifyjs.com/en/components/forms/). 
Inside the form we will need a [TextField](https://next.vuetifyjs.com/en/components/text-fields/) and a [TextArea](https://next.vuetifyjs.com/en/components/textareas/)
We will also transform our link into a [Button](https://next.vuetifyjs.com/en/components/buttons/)

The `template` section will look like this:

```html
<template>
<v-form>
  <v-text-field label="Title" v-model="photo.title"></v-text-field>
  <v-textarea label="Description" v-model="photo.description" hint="Description"></v-textarea>
  <v-btn @click="insertPhoto" color="primary" variant="text">INSERT PHOTO</v-btn>
</v-form>
</template>
```

The `UpdateView` will look more or less the same, we just need to modify the button into update instead of add.

```html
<template>
<v-form>
  <v-text-field label="Title" v-model="photo.title"></v-text-field>
  <v-textarea label="Description" v-model="photo.description" hint="Description"></v-textarea>
  <v-btn @click="updatePhoto" color="primary" variant="text">UPDATE PHOTO</v-btn>
</v-form>
</template>
```

The last template we have to change is the one of the `DeleteView` View, which will look similar to the `Details` view.

```html
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
```

Our styling is complete.  Our next lab will focus on the back end: we're going to build a REST service using ASP.NET Core 6.0.

Go to `Labs/Lab04`, open the `readme.md` and follow the instructions thereby contained.   
