# Security: Authentication and Authorization

We have not implemented any security yet. In this lab we are going to setup and configure a new project that will act as an *Authentication Server*. We will then protect the **Create** operation and we will use the Authentication Server to authenticate the user and issue a *token*, then have the client gain access to the protected operation by using such token.
The Authentication Server that we're going to use implements [OAuth 2.0 and IDConnect](https://www.oauth.com/).

[Duende Identity Server](https://docs.duendesoftware.com/identityserver/v6/overview/) is going to be our Authentication Server.

We are going to use its [Templates](https://docs.duendesoftware.com/identityserver/v6/quickstarts/0_overview/#preparation).  
Specifically, the [ASP.NET Core Identity](https://docs.duendesoftware.com/identityserver/v6/quickstarts/5_aspnetid/#new-project-for-aspnet-core-identity) template, which contains the UI to login and logout and a couple of example users stored in a SqlLite database. This template stores the configuration in memory, which for our purpose is more than enough. Feel free to explore the other templates and eventually [use EntityFramework Core for configuration and operational data](https://docs.duendesoftware.com/identityserver/v6/quickstarts/4_ef/) instead.   

- We will protect our [resources](https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/) (our Photos REST Api) by: 
  - [Defining API Scopes](https://docs.duendesoftware.com/identityserver/v6/quickstarts/1_client_credentials/#defining-an-api-scope)
  - [Adding JWT Bearer Authentication](https://docs.duendesoftware.com/identityserver/v6/quickstarts/1_client_credentials/#add-jwt-bearer-authentication)
  - [Using the Authorize attribute](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/simple?view=aspnetcore-6.0)
- We will configure our client by:
  - [Adding a client registration to IdentityServer for the JavaScript client](https://docs.duendesoftware.com/identityserver/v6/quickstarts/js_clients/js_without_backend/#add-a-client-registration-to-identityserver-for-the-javascript-client)
- We will protect our Frontend by
  - [Using the oidc client](https://docs.duendesoftware.com/identityserver/v6/quickstarts/js_clients/js_without_backend/#reference-oidc-client)

## The Authentication Server

To create our Duende Identity Server project, let's follow the [Using ASP.NET Core Identity Tutorial](https://docs.duendesoftware.com/identityserver/v6/quickstarts/5_aspnetid/)

- Open a command prompt and navigate to your `Labs\Lab06\Start\PhotoSharingApplication` folder
- If you haven't installed the IdentityServer templates yet, do it by typing the following command:

```
dotnet new --install Duende.IdentityServer.Templates
```

- Create an empty IdentityServer project that uses ASP.NET Identity for user management by typing the following command: 

```
dotnet new isaspid -n IdentityServerAspNetIdentity
```

> When prompted to “seed” the user database, choose “Y” for “yes”. This populates the user database with our “alice” and “bob” users. Their passwords are “Pass123$”.

Create a new empty solution by entering the following commands:
```
cd IdentityServerAspNetIdentity
dotnet new sln --name IdentityServerAspNetIdentity
dotnet sln add IdentityServerAspNetIdentity.csproj
```


- Open Visual Studio
- Open the project you just created in the `Lab06\Start\PhotoSharingApplication\IdentityServerAspNetIdentity` folder

If you want to browse the SqlLite db created by the template from within Visual Studio, you will need a Visual Studio Extension. 
- In Visual Studio, select `Tools -> Extension And Updates`, 
- Select `Online` 
- Search for `SqLite`. 
- Select the `SQLite / SQL Server Compact Toolbox` 
- Click on `Download`. 
- When the download completes, close Visual Studio to start the installation. 
- When the installation completes, go back to Visual Studio
- Click on `View -> Other Windows -> SQLite / SQL Compact Toolbox`, 
- Click on the `Add SQLite / SQL Compact from current solution` button. 
- You should see a `AspIdUsers.db` Database.
  - Feel free to explore its structure and content. 

## Identity Provider Configuration

Now that we have a project, we need to cofigure it for our own purposes.

- We already have two users: *alice* and *bob* with password *Pass123$* (you can find them in the the `SeedData.cs` file).
- Our [IdentityResource](https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/identity/) has already been configured, so we don't need to change that in the `Config.cs` file.
- We need to configure one [API Scope](https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/api_scopes/) to grant access to the REST Service for the Photos
- We need to configure one [client](https://docs.duendesoftware.com/identityserver/v6/fundamentals/clients/) to grant access to the Vuejs frontend

### ApiScopes

Open the `Config.cs` file located in the root of your `IdentityServerAspNetIdentity` project.

- Configure the `Photos` ApiScope. 
  - Name it `backend`
  - Include the `Name` of the user in the access token. We will use the name in a future lab to allow photos update and deletion only to the photo owner.

So replace this code
```cs
public static IEnumerable<ApiScope> ApiScopes =>
  new ApiScope[]
  {
      new ApiScope("scope1"),
      new ApiScope("scope2"),
  };
```

with this code

```cs
public static IEnumerable<ApiScope> ApiScopes =>
  new ApiScope[]
  {
      new ApiScope("backend") { UserClaims = new string[] { JwtClaimTypes.Name }}
  };
```

### Client

The second thing we need to configure is the [Javascript Client](https://docs.duendesoftware.com/identityserver/v6/fundamentals/clients/), as described in the [JavaScript applications without a backend tutorial](https://docs.duendesoftware.com/identityserver/v6/quickstarts/js_clients/js_without_backend/)
- Locate the `Clients` static property.
- Remove every client 
- Add a new Client with the following properties
- Set the `ClientId` to `frontend`
- Set the `ClientName` will be `PhotoSharing JavaScript Client`
- Set the `AllowedGrantTypes` to `GrantTypes.Code`
- Set the `ClientSecret` to a New Guid (you can generate one in Visual Studio by selecting the Tools -> Create GUID menu item)
- Set the `ClientUri` to `http://localhost:5173`
- Set the `RedirectUris` to `{ "http://localhost:5173/callback" }`
- Set the `PostLogoutRedirectUris` to `http://localhost:5173`
- Set the `AllowedCorsOrigins` to `http://localhost:5173`
- Set the `AllowedScopes` to 

```cs
{   
  IdentityServerConstants.StandardScopes.OpenId,
  IdentityServerConstants.StandardScopes.Profile,
  "backend"
}
```

The `Clients property` method should look like the following:

```cs
public static IEnumerable<Client> Clients =>
  new Client
  {
    ClientId = "frontend",
    ClientName = "Vuejs JavaScript Client",
    AllowedGrantTypes = GrantTypes.Code,
    RequireClientSecret = false,
    
    RedirectUris =           { "http://localhost:5173/callback" },
    PostLogoutRedirectUris = { "http://localhost:5173" },
    AllowedCorsOrigins =     { "http://localhost:5173" },
    AlwaysIncludeUserClaimsInIdToken = true,
    AllowedScopes = 
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        "backend"
    }
  };
```

Open the `HostingExtensions.cs` and remove the `AddGoogle` call. This code

```cs
builder.Services.AddAuthentication()
  .AddGoogle(options =>
  {
      options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

      // register your IdentityServer with Google at https://console.developers.google.com
      // enable the Google+ API
      // set the redirect URI to https://localhost:5001/signin-google
      options.ClientId = "copy client ID from Google here";
      options.ClientSecret = "copy client secret from Google here";
  });
```

simply becomes

```cs
builder.Services.AddAuthentication();
```


In Visual Studio, run the application and test a user login, by navigating to `https://localhost:5001/Account/Login` and using `alice` / `Pass123$` or `bob` / `Pass123$` as username / password. You should see the user correctly logged on.

## Configuring the REST Service

We can now switch to our Web Api project. We need to:
- Configure it to use Duende Identity Server
- Protect the access to the `Create` action to allow only authenticated users

As explained in the [Protecting an API](https://docs.duendesoftware.com/identityserver/v6/quickstarts/1_client_credentials/#create-an-api-project) tutorial, we need to configure the API.

- Add the following package to the `Backend` project:
  - `Microsoft.AspNetCore.Authentication.JwtBearer`

We need to add the authentication services to DI and the authentication middleware to the pipeline. These will:

- validate the incoming token to make sure it is coming from a trusted issuer
- validate that the token is valid to be used with this api (aka scope)

We now need to add the authentication services to DI and configure "Bearer" as the default scheme. We can do that thanks to the `AddAuthentication` extension method. We then also have to add the JwtBearer access token validation handler into DI for use by the authentication services, throught the invocation of the `AddJwtBearer` extension method, to which we have to configure the `Authority` (which is the http address of our Identity Server) and the `Audience` (which we set in the previous project as `backend`). The Metadata Address or Authority must use HTTPS unless disabled for development by setting `RequireHttpsMetadata=false`.

Open your `Program.cs`, add the following code before building the app:

```cs
builder.Services.AddAuthentication("Bearer")
.AddJwtBearer("Bearer", options => {
    options.Authority = "https://localhost:5001";

    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateAudience = false
    };
});
```

which requires a

```cs
using Microsoft.IdentityModel.Tokens;
```

We also need to add the authentication middleware to the pipeline so authentication will be performed automatically on every call into the host, by invoking the `UseAuthentication` extension method **BEFORE** the `app.UseAuthorization` line.

```cs
app.UseAuthentication();
```

The last step is to protect the `Create` action of our `PhotosController` by using the [Authorize](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/simple?view=aspnetcore-6.0) attribute.

Open your `PhotosController` class, locate the `PostPhoto` method and add the `[Authorize]` attribute right before the definition of the method:

```cs
[Authorize]
[HttpPost]
public async Task<ActionResult<Photo>> PostPhoto(Photo photo) {
    _context.Photo.Add(photo);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetPhoto", new { id = photo.Id }, photo);
}
```

If you use the Swagger to invoke the Create action you should get a 401 status code in return. This means your API requires a credential.

The API is now protected by Duende Identity Server.

## Configuring the Javascript Client

The third part requires the configuration of our client project.

Let's begin by testing if the create still works. Run all the three projects, then try to post a new photo using our client application. You should see that the photo is not added, while you  should still be able to get the list of all photos, and also to get the details, modify and delete a specific photo.

What we need to do is to give the user the chance to log in, get the tokens from Duende Identity Server and add the access token to the post request in order to be authorized.
The process of configuring a javascript client is described in the 
[Duende Identity Server Documentation](https://docs.duendesoftware.com/identityserver/v6/quickstarts/js_clients/js_without_backend/)

We are going to:
- Add the `oidc-client` library
- Create a `ApplicationUserManager` class extending the [UserManager](https://github.com/IdentityModel/oidc-client-js/wiki) that
    - autoconfigures itself in the constructor
    - provides login and logout functionalities
- Expose a global constant instance of the ApplicationUserManager
- Add a `Login` functionality
    - Add a button to the `App` ViewComponent
    - Handle its click by invoking the `login` method of our `applicationUserManager`
- Implement the LoginCallBack
    - Create a `LoginCallBackView` ViewComponent
    - Invoke the `signinRedirectCallback` method of our `applicationUserManager`
    - Go back to the HomeView
    - Configure the route to the `LoginCallbackView`
- Use the `applicationUserManager` in the `datalayer` to
    - get the access token
    - pass the token in the header of the post request



In order to add the `oidc-client-ts` library, follow the instructions described on the [oidc-client-ts git page](https://github.com/authts/oidc-client-ts#installation): 

open a console window, ensure to navigate to the client project folder, then type

```
npm install oidc-client-ts --save
```

The following steps are:

- Create an `ApplicationUserManager` class extending the [UserManager](https://authts.github.io/oidc-client-ts/classes/UserManager.html) that
    - autoconfigures itself in the constructor
    - provides login and logout functionalities
- Expose a global constant instance of the ApplicationUserManager

Let's start by creating a new file `applicationusermanager.js` in your `src` folder.

- Start by importing the `UserManager` dependency from the `oidc-client` package.
- Create a new class `ApplicationUserManager` that extends `UserManager`
- implement a constructor and invoke the constructor of the base class passing an object with the following properties:
  - authority: 'https://localhost:5001',
  - client_id: 'frontend',
  - redirect_uri: 'http://localhost:5173/callback',
  - response_type: 'code',
  - scope: 'openid profile backend',
  - post_logout_redirect_uri: 'http://localhost:5173'
- implent an `async login` method that
    - asynchronously waits for the `signinRedirect` method
    - invokes the `getUser` method and returns the result
- implement an `async logout` method that invokes the `signoutRedirect` method and returns the result
- Create an instance of the `ApplicationUserManager` class and export it as a default constant

Your `applicationusermanager.js` file should look like this:

```js
import { UserManager } from 'oidc-client-ts'

class ApplicationUserManager extends UserManager {
  constructor () {
    super({
      authority: 'https://localhost:5001',
      client_id: 'frontend',
      redirect_uri: 'http://localhost:5173/callback',
      response_type: 'code',
      scope: 'openid profile backend',
      post_logout_redirect_uri: 'http://localhost:5173'
    })
  }

  async login () {
    await this.signinRedirect()
  }

  async logout () {
    return this.signoutRedirect()
  }
}

const applicationUserManager = new ApplicationUserManager()
export { applicationUserManager as default }

```
Now let's create a `Login` component to encapsulate the ui and the logic to
- Show the user a login button that uses the applicationManager to redirect the user to our Identity Provider to let the user sign in
- Show the user a logout button if the user is already logged on, to give the chance to logout by invoking the applicationManager

### The Login Component

- In the `src/components` folder, add a new `Login.vue` file. 

```html
<template>
  
</template>

<script>
export default {

}
</script>

<style>

</style>
```
Let's start by adding the  `Login` functionality
    - Add a button 
    - Handle its click by invoking the `login` method of our `applicationUserManager`
    
### Add a button to the toolbar of the `App` View

Let's first think about the UI. In the `template` section, add the following code:


```html
  <v-btn icon @click="login">
    <v-icon>mdi-account</v-icon>
  </v-btn>
```

Now it's time to write the logic. We need to make use of our applicationUserManager constant, so the first thing we need to do is to import it from the module.
Locate the `<script>` tag and add this code as first statement:

```js
import applicationUserManager from '../applicationusermanager'
```

Now we need to add a new `async login` method that invokes the `login` of our `applicationUserManager` object and asynchronously wait for the result:

```js
methods: {
  async login () {
    try {
      await applicationUserManager.login()
    } catch (error) {
      console.log(error)
    }
  }
}
```

Whenever we login, we are sent to the Duende Identity Server site where we can proceed to enter our credentials. If we get authenticated by the system, we are then redirected to a callback url. This is what we still don't have and that we're going to create next.

As described in the [Identity Server Documentation](https://docs.duendesoftware.com/identityserver/v6/quickstarts/js_clients/js_without_backend/)

> This HTML file is the designated `redirect_uri` page once the user has logged into IdentityServer. It will complete the OpenID Connect protocol sign-in handshake with IdentityServer. The code for this is all provided by the `UserManager` class we used earlier. Once the sign-in is complete, we can then redirect the user back to the main `index.html` page. 

- To implement the LoginCallBack we need to:
    - Create a `LoginCallBackView` View
    - Invoke the `signinRedirectCallback` method of our `applicationUserManager`
    - Go back to the `Home` View
    - Configure the `route` to the `LoginCallbackView` View  

Should our site be slow, we will also show a message to inform the user that no further actions are necessary, since the page should soon automatically refresh.

In your `src/views` folder, create a `LoginCallbackView.vue` file.
In the template, show a message informing that the page should refresh.
In the script, start by importing the `applicationUserManager` object from the `applicationusermanager` module.
Then export the default object giving it a `name` of `logincallback-view`. Ensure that the `created` event is handled by asynchronously waiting for the `signinRedirectCallback` method of the `applicationUserManager` object. Remember to also push the HomeView route so that the page is refreshed.

Your `LoginCallbackView.vue` should look like this:

```html
<template>
  <h3>Please wait, you are being redirected to the Home page</h3> 
</template>

<script>
import applicationUserManager from '../applicationusermanager'

export default {
  async created () {
    try {
      await applicationUserManager.signinRedirectCallback()
      this.$router.push({name: 'home'})
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
```  

Configure the callback route.

Open the `src/router/index.js` file.

Import `LoginCallback` component:

```js
import LoginCallBackView from '../views/LoginCallBackView.vue'
```

and a new route and bind it to the corresponding path and component:
```js
{
  path: '/callback',
  name: 'callback',
  component: LoginCallBackView
},
```

### Add the Login Component to the App toolbar

Add the component to the `App` toolbar.

- Open the `src/App.vue` file
- Add a `<script>` section to import the `Login` component and register it 

```html
<script>
import Login from "./components/Login.vue";
export default {
  components: {
    Login
  }
}
</script>
```

In the the `<template>` section, add a `<login />` component in the toolbar, between the button to add a new photo and the one to navigate to the `about` view. 

```html
<v-btn icon :to="{name: 'about'}">
  <v-icon>mdi-chat</v-icon>
</v-btn>

<login/>

<v-btn icon :to="{name: 'create'}">
  <v-icon>mdi-pencil-plus</v-icon>
</v-btn>

```

Save the files and run the frontend, after making sure that both the backend and the identity provider are running.

Click on the button to logon.
You should get redirected to the IdentityServer site. You should be able to log on using `alice` and `Pass123$` and you should briefly see the callback url and then the home page.

### Logout

To continue, we're going to 
- Show the `LOGIN` button only if the user is not logged on
- Show a `LOGOUT` button and the user name if the user is logged on

In the `Login.vue` component, we're going to [conditionally render a template](https://vuejs.org/guide/essentials/conditional.html): if the user is not yet authenticated, we will show the `LOGIN` button; else, we will show the user name, a `LOGOUT` button and we will bind the click event of the button to a `logout` method. 

In order to do that, we will have to create a `data` function to return a `user` object  with a `name` and a `isAuthenticated` property. We will update this object during creation and at [every change in route](https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes) by invoking the `getUser` method of our `applicationUserManager` object, testing for a result and reading the `profile.name` property of the return value.

The `<script>` section of our `Login.vue` component will become:

```html
<script>
import applicationUserManager from '../applicationusermanager'
export default {
    data () {
    return {
      user: {
        name: '',
        isAuthenticated: false
      }
    }
  },
  async created () {
    await this.refreshUserInfo()
  },
  watch: {
    async '$route' (to, from) {
      await this.refreshUserInfo()
    }
  },
  methods: {
    async login () {
      try {
        await applicationUserManager.login()
      } catch (error) {
        console.log(error)
      }
    },
    async logout () {
      try {
        await applicationUserManager.logout()
      } catch (error) {
        console.log(error)
      }
    },
    async refreshUserInfo () {
      const user = await applicationUserManager.getUser()
      if (user) {
        this.user.name = user.profile.name
        this.user.isAuthenticated = true
      } else {
        this.user.name = ''
        this.user.isAuthenticated = false
      }
    }
  }
}
</script>
```

The `<template>` section will become:

```html
<template>
  <v-btn icon @click="login" v-if="!user.isAuthenticated">
    <v-icon>mdi-account</v-icon>
  </v-btn>
  <v-btn text @click="logout" v-else>
      {{ user.name }}
    <v-icon>mdi-account-off</v-icon>
  </v-btn>
</template>
```

Save, rebuild and test. You should be able to login and logout and see the UI change accordingly.

### Post

Now we need to use the `applicationUserManager` in the datalayer to:
- get the access token
- pass the token in the header of the post request

- Open the `datalayer.js` file in your `src` folder.
- Import the `applicationUserManager` object from the `../applicationusermanager` module.
- Modify the `async insertPhoto` method to
    - asynchronously wait for the `applicationUserManager.getUser()` method and put the result into a `user` constant
    - add a new `Authorization` property to the `Headers` object, set to `'Bearer '` followed by the `user.access_token` property (if the `user` constant has a value)

Your `datalayer` should begin with

```js
import applicationUserManager from './applicationusermanager'
```

and the `insertPhoto` should now look like this:

```js
async insertPhoto (photo) {
  const user = await applicationUserManager.getUser()
  const response = await fetch(this.serviceUrl, {
    method: 'POST',
    body: JSON.stringify(photo),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (user ? user.access_token : '')
    })
  })
  let result
  if (response.status !== 201) {
    result = response.statusText
  } else {
    result = await response.json()
  }
  return result
}
```

At this point you should be able to insert a new photo.

### Show / Hide the create button

The `App` vue also needs to know if the user is authenticated in order to decide wether to show the `Create` button or not, so let's move the `user` property, the `login` and `logout` methods and the logic behind the `refreshUserInfo` into a [`Composable`](https://vuejs.org/guide/reusability/composables.html).
We will need to change the way we watch the routes as explained in [Vue Router and the Composition API](https://router.vuejs.org/guide/advanced/composition-api.html).  

In the `src` folder, create a `user.js` file.  


```js
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import applicationUserManager from './applicationusermanager.js'

// by convention, composable function names start with "use"
export function useUser() {
    const route = useRoute()

    // state encapsulated and managed by the composable
    const user = ref({
                    name: '',
                    isAuthenticated: false
                })

    async function login () {
        try {
            await applicationUserManager.login()
        } catch (error) {
            console.log(error)
        }
    }
    async function logout () {
        try {
            await applicationUserManager.logout()
        } catch (error) {
            console.log(error)
        }
    }
    async function refreshUserInfo () {
        const userFromUM = await applicationUserManager.getUser()
        if (userFromUM) {
            user.value.name = userFromUM.profile.name
            user.value.isAuthenticated = true
        } else {
            user.value.name = ''
            user.value.isAuthenticated = false
        }
    }

    onMounted(async () => await refreshUserInfo())

    watch(
        () => route.path,
        async () => {
            await refreshUserInfo()
        }
    )

    // expose managed state as return value
    return { user, login, logout }
}
```

Now let's import the composable in the `Login` component, as explained in the [Using Composables in Options API](https://vuejs.org/guide/reusability/composables.html#using-composables-in-options-api) documentation.

- Open the `src/components/Login.vue` file.
- Replace the whole `template` section with the following code


```js
<script>
import { useUser } from '../user.js'
export default {
    setup(){
        const {user , login, logout} = useUser();
        return {user, login, logout };
    }
}
</script>
```

The functionalities of your site should result unchanged, but now we can proceed to modify the `App` view.

- Open the `src/App.vue` View.
- Import the composable

```js
import { useUser } from './user.js'
```

- Deconstruct the `user` property and export it in the `setup`

```js
 <script>
import Login from "./components/Login.vue"
import { useUser } from './user.js'
export default {
  setup(){
    const {user} = useUser();
    return {user};
  },
  components: {
    Login
  }
}
</script>
```

- Show the `create` button only if the user is authenticated

```html
<v-btn icon :to="{name: 'create'}"  v-if="user.isAuthenticated">
  <v-icon>mdi-pencil-plus</v-icon>
</v-btn>
```

Try your frontend. You should see the `Create` button only if the user is logged on.

We have successfully managed to protect the `Create` operation.

What we need to do next is to allow updates and deletes only to the photo owners.
This is what we're going to do in the next lab.

Go to `Labs/Lab07`, open the `readme.md` and follow the instructions thereby contained.   
