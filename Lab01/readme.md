# The Vue FrontEnd: A Progressive Web Application

We will start by building the client side application using Vue.js.

From [the official Vue documentation:](https://vuejs.org/guide/introduction.html)

## What is Vue.js?

> Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. It builds on top of standard HTML, CSS and JavaScript, and provides a declarative and component-based programming model that helps you efficiently develop user interfaces, be it simple or complex.

Although not recommended for beginners, we will make use of already made templates that will take care of configuration and build steps for us. 
In order to install and use these, we first need **npm**.

If do not know what npm is, how to install it and how to use it, watch lessons 1 to 10 of the [documentation](
https://docs.npmjs.com/getting-started/what-is-npm).

When you're done learning, install the latest version of [nodejs](https://nodejs.org/en/) 

## Vite Installation

We are going to install and use [Vite](https://vitejs.dev/guide/)

> Vite is a lightweight and fast build tool with first-class Vue SFC support. It is created by Evan You, who is also the author of Vue!
> To get started with Vite + Vue, simply run:
>
> ```cmd
>npm init vue@latest
> ```
> This command will install and execute [create-vue](https://github.com/vuejs/create-vue), the official Vue project scaffolding tool.
> To learn more about Vite, check out the [Vite](https://vitejs.dev/) docs.
To configure Vue-specific behavior in a Vite project, for example passing options to the Vue compiler, check out the docs for [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).


We are going to create a new project and we're going to manually select the following features:
- Vue
- Router
- Linter

Do not worry if you don't know what these options are, we are going to focus on these aspects during the labs. 

- Open a command prompt
- Navigate to the ```Labs\Lab01\Start\PhotoSharingApplication``` folder
- Type the following commands

```
npm init vue@latest
```

If it's the first time you use Vite, you'll be asked if you want to  download and install Vite. Select Yes.  
If you're asked the type of project you want to create, select Vue.  

- You can now pick a name for your project. Type `Frontend`.  
- As `Package name`, just press enter leaving `frontend` as value.  
- Do NOT add TypeScript
- Do NOT add JSX support
- DO Select `Vue Router` , since we want to build a Single Page Application (select `Yes`)
- Do NOT add `Pinia` for state management
- DO add `Vitest` for Unit Testing (select `Yes`)
- Do add `Cypress` for End-toEnd testing (select `Yes`)
- Do NOT add `ESLint` for code quality (select `Yes`)
- Do NOT add `Prettier` for code formatting

This is the configuration you should use:

```
Name: Frontend
Package: frontend
- ( ) TypeScript
- ( ) JSX
- (*) Vue Router
- ( ) Pinia
- (*) Vitest Unit Testing
- (*) Cypress E2E Testing       
- (*) ESLint
- ( ) Prettier
```

Now type

```
cd Frontend
npm install
npm run dev
```

After a while (if it's your first time it may take a long time) you should be able to see a message on the console showing the address of your new website. Open a browser and navigate to that address (it should be `http://localhost:5173/`). You should see a page with the Vue logo and some links to the Vue docs, resources, ecosystem and so on.

[It is also recommended to install the dev tools](https://github.com/vuejs/devtools)

You can now go back to the console and press `CTRL + C` and then `Y` to stop the website.

Open the `Frontend` folder in Visual Studio Code, by typing `code .`.
Visual Studio Code does not understand Vuejs natively, but there is an extension that can help. If you haven't already, install [Volar](https://github.com/johnsoncodehk/volar)

The project that has been generated for us is a showcase of the many possibilities of Vuejs. It's packed full with examples and it can be overwhelming to understand what's going on because there are so many components involved. We don't actually need to understand each and every item in the project. If we try to deep dive into every item we run the risk to enter way too many rabbit holes. Let's just take a shallow look at what we get and we'll analize the rest when and if we need it. 

Let's start from the start.

When users navigate to the root of our website, they go to `index.html` page. What they get is different from what we have in our root folder, because it is  the result of 
- the build process of `Vite` 
- the dynamic runtime process of `vue`

As per the [Vite Documentation](https://vitejs.dev/guide/#index-html-and-project-root)

> (...) index.html is the entry point to your application.
>
> Vite treats `index.html` as source code and part of the module graph. It resolves `<script type="module" src="...">` that references your JavaScript source code. Even inline `<script type="module">` and CSS referenced via `<link href>` also enjoy Vite-specific features.

If you inspect `index.html` you can find

```html
<div id="app"></div>
``` 

This is where Vue will render its content.
You can also find 

```html
<script type="module" src="/src/main.js"></script>
```

The ```main.js``` file is the starting point of the dynamic content and logic behind our application.

This file:
- Creates a [Vue instance](https://vuejs.org/guide/essentials/application.html#the-application-instance)
- Injects and configures the [Vue Router](https://github.com/vuejs/router)
- Renders the `App` [Single File Component](https://vuejs.org/guide/essentials/component-basics.html)
- Mounts the `App component` to the `html tag` whose `id` is `app`

If this doesn't make sense, let's go step by step and try to understand each part.

We need to follow all the files that are involved in the construction and configuration of the `Vue instance`; they are a lot, so have patience. 

Open the ```src/main.js``` file. Examine the code that has been generated for us:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

The code begins by importing the `createApp` function from the `vue` npm package. This is necessary to create the [Vue instance](https://vuejs.org/guide/essentials/application.html#creating-a-vue-application), later in the file.

It then proceeds to import `App.vue`, our main [component](https://vuejs.org/guide/essentials/component-basics.html)

> Components allow us to split the UI into independent and reusable pieces, and think about each piece in isolation. (...) Vue implements its own component model that allow us to encapsulate custom content and logic in each component.

The project we created makes use of [Vue Router](https://router.vuejs.org/).

> In a Single-Page Application (SPA), the client-side JavaScript can intercept the navigation, dynamically fetch new data, and update the current page without full page reloads. This typically results in a more snappy user experience, especially for use cases that are more like actual "applications", where the user is expected to perform many interactions over a long period of time.
>
> In such SPAs, the "routing" is done on the client side, in the browser. A client-side router is responsible for managing the application's rendered view using browser APIs such as History API or the hashchange event.
>
> Vue is well-suited for building SPAs. For most SPAs, it's recommended to use the officially-supported Vue Router library.

Vue Router is configured in our `src/router/index.js` file, imported on line 3 (more on this later).

The next step is to import the `css` file to style the application, which is found under `./assets/main.css`

Now, we can create the [Vue Instance passing App as Root Component](https://vuejs.org/guide/essentials/application.html#the-root-component)

Now that we have the Application, we can add the `router` [plugin](https://vuejs.org/guide/reusability/plugins.html)

Finally, we can [mount the app](https://vuejs.org/guide/essentials/application.html#mounting-the-app)

So, as a recap:
- `Index.html` starts, with a reference to `main.js`
- `main.js`:
  - creates an instance of `Vue` passing `App` as a Root Component
  - configures and injects the `Router`
  - renders and mounts the App component on the `div` tag with the `app` id

This means that when the user navigates to our root, `index.html` is downloaded together with a javascript file that creates a Vue instance that replaces the `app div` with the content of the `App` component. 

So, what is the `App` component?

In order to proceed, let's switch to ```App.vue```, which we can find in the ```src``` folder.

You will find the three sections of any Single File Component:

```html
<script>
...
</script>

<template>
...  
</template>

<style>
...
</style>
```

The `HelloWorld` component is an example of how easy it is to reference and render a vue component: you import it in the `script` section and you use it as a tag in the `template` section, eventually passing properties as if they were html attributes.

The `App` component also uses the [router-link](https://router.vuejs.org/api/#router-link) and the [router-view](https://router.vuejs.org/api/#router-view) components.

> `<router-link>` is the component for enabling user navigation in a router-enabled app. The target location is specified with the `to` prop. It renders as an `<a>` tag with correct `href` by default. In addition, the link automatically gets an `active` CSS class when the target route is active.

>The `<router-view>` component is a functional component that renders the matched component for the given path.

A Route is just an address, like `/about`, or `/products/create` and so on.
When you use `vue router`, you configure each path with a specific `component`, so that when the user navigates to a route that component gets rendered in the `router-view`. To the user it looks like he navigated to the page `/about`, but he actually never left the `index.html` page. It's the `vue router` that dynamically changes the content of the page with the specific component.

What are the configured routes and which components will be rendered by the `router-view`? Open `src/router/index.js` to find out.

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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

As you can see: 
- The `HomeView` component is mapped to the `/` route
- The `AboutView` component is mapped to the `/about` route

This means that when the user navigates to the root (`/`), the `router-view` component will render the content of the `HomeView` component, while when the user navigates to `/about` the `AboutView` component will be rendered.

The `HomeView` component looks like this.

```html
<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
```

`TheWelcome` component has a bunch of useful links and it uses `TheWelcomeItem` multiple times to render some icons.  

`TheWelcome` component is an example of the use of [slot](https://vuejs.org/guide/components/slots.html).

So, as a recap (last time, I promise):
- `index.html` has a reference to the js bundle
- the js bundle starts with `main.js`
- `main.js` creates a `vue instance`
- the vue instance renders the `App` component
- the `App` component renders `HelloWorld` and it uses `vue router`
- the Router renders the `HomeView` component
- the `HomeView` component renders the `TheWelcome` component
- `TheWelcome` component renders `TheWelcomeItem` multiple times

I told you it was a lot, but we're finally there.   

So now it's time to customize the website.

## The Photos Component

Our ultimate goal is to display a list of photos instead of the `TheWelcome`. To start in simple, we won't display the actual pictures, but we will just display some metadata such as an `Id`, a `Title` and a `Description`.   
In future labs we will take care of 
- the UI by using Material Design
- the data by creating and using a REST service
For the time being we will display a simple list retrieved from an array in memory.

Let's start by creating a `Photos` component

Go to the `components` folder and add a `Photos.vue` file.  
Type the following code:

```html
<template>
  <h1>Products</h1>
</template>
```

Save the file.

Now let's change the `HomeView` component to use our newly created `Products` component instead of the `TheWelcome` one. 

- Open the `HomeView.vue` file.
- Replace its content with

```html
<script setup>
import Photos from '../components/Photos.vue'
</script>

<template>
  <main>
    <Photos />
  </main>
</template>
```

- Save the file.

Let's also remove the `HelloWorld` component from the `App.vue` component, whose `script` and `template` sections become:

```html
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
```

You can leave the `style` section unchanged for now.


- Open your [Visual Studio Code integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal). 
- Type `npm run dev`.

**Note: ensure that the terminal output is ```DONE Compiled successfully```. If it isn't, correct all the errors from top to bottom and save the file again.** 

- Navigate to your website (`http://localhost:5173/`) and verify that the home page has the **Photos** title instead of the links.

Let's continue with our `Photos` component by adding some data that will be used to dynamically render UI.

Vue has a [Reactive System](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) that binds the data to the view.

> With Options API, we use the data option to declare reactive state of a component. The option value should be a function that returns an object. Vue will call the function when creating a new component instance, and wrap the returned object in its reactivity system. Any top-level properties of this object are proxied on the component instance (this in methods and lifecycle hooks).

The `data` function should return an object with a `photos` property. The photos property should be an `array` with some `photo` object. Each photo object should have three properties: `id` *(number)*, `title` *(string)*, `description` *(string)*.

You `data` function could look something like this:

```js
data () {
    return {
      photos: [
        {id: 1, title: 'Win-win survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
        {id: 2, title: 'High level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
        {id: 3, title: 'Organically grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
        {id: 4, title: 'Agile frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
      ]
    }
  }
```

This means that the `<script>` section of the `Products.vue` file should now look like the following:

```html
<script>
export default {
    data () {
        return {
            photos: [
                {id: 1, title: 'Win-win survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
                {id: 2, title: 'High level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
                {id: 3, title: 'Organically grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
                {id: 4, title: 'Agile frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
            ]
        }
    }
}
</script>
```

Save your file and ensure that it gets compiled. If not, resolve your issues before going further.

Now let's update the UI. We will use a loop in order to render multiple divs, one for each product.

The directive to loop through array items is [v-for](https://vuejs.org/guide/essentials/list.html)

> We can use the `v-for` directive to render a list of items based on an array. The `v-for` directive requires a special syntax in the form of `item in items`, where `items` is the source data array and `item` is an **alias** for the array element being iterated on

We are also going to use our `id` property as [key](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)

> To give Vue a hint so that it can track each node’s identity, and thus reuse and reorder existing elements, you need to provide a unique key attribute for each item.

Replace the `<template>` section with the following code:

```html
<template>
    <div>
        <div v-for="photo in photos" :key="photo.id">
            <p>{{ photo.id }} - {{ photo.title }}</p>
            <p>{{ photo.description }}</p>
        </div>
    </div>
</template>
```

Save your file. 
Go to the browser and verify that the home page now contains four divs with the details of our photos.
Do not worry about the style. We will fix it on a later lab.

In the next lab we will build four additional views:

- Details
- Insert
- Update
- Delete 

To continue, open ```Labs/Lab02/readme.md``` and follow the provided instructions.

