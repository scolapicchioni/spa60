# Security: Resource Based Authorization

We did not protect the `update` and `delete` operations, yet.

What we would like to have is an application where:
- Every photo has an owner
- Photos may be updated and deleted only by their respective owners

In order to achieve this, we have to update both our Backend and FrontEnd.

## BackEnd
- We'll add a UserName property to the Photo class so that we can persist who the owner is
- We will update the Create action to check the UserName property of the photo being added
- We will configure the [Resource Based Authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-6.0) by creating
    - A PhotoOwner [Policy](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-6.0)
    - A PhotoOwner [Requirement](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-6.0#requirements)
    - A PhotoOwner [Handler](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-6.0#authorization-handlers). This handler will succeed only if the UserName property of the Photo being updated/deleted matches the value of the name claim received in the access_token and the claim has been issued by our own Duende Identity Server Web Application.
- We will check the PhotoOwner Policy on Update eventually denying the user the possibility to complete the action if he's not the photo's owner
- We will check the PhotoOwner Policy on Delete eventually denying the user the possibility to complete the action if he's not the photo's owner

## FrontEnd
- We will:
  - update the User Interface of the `Photo` Item by adding a `userName` property to `photo`
  - add a `userName` property to current `photo` of the `Vue` instance setting it to the logged on user name
  - pass the Credentials to our ApiController during update, just like we did during the Create
  - pass the Credentials to our ApiController during delete, just like we did during the Create
  - make sure that the `Update` and `Delete` buttons are shown only if allowed by:
    - adding a `userIsOwner` computed property to photo-item component
    - showing the update and delete buttons of each photo-item only if userIsOwner is true

Let's start by updating our BackEnd Service.

### The Model and the DataBase

We are currently missing a crucial information about our photo: the name of the user that created the photo. The easiest thing we can do is add a new property on our `Photo` model and update the database schema accordingly. Thanks to Entity Framework Migrations, it is going to be easy.

Open the `Photo` class (under the `Models` folder) and add a new `UserName` public property  of type `string`:

```cs
public string UserName { get; set; }
```

In order to update the database schema we need to add a migration in the code, then invoke the EF command to update the database.

Open the [Package manager Console(https://learn.microsoft.com/en-us/nuget/consume-packages/install-use-packages-powershell#opening-the-console-and-console-controls) and type:

```
Add-Migration "PhotoUserName"
```

Then type:

```
Update-DataBase
```

This will ensure that the model and the database match.


### Update the Create action to check the UserName property of the photo being added

We want to retrieve the name of the user and write it on the Photo before we save it on the database.

The name of the user has been added to the access_token by our Identity Provider, because when we configured the Api, we added the `Name` [Claim](https://andrewlock.net/introduction-to-authentication-with-asp-net-core/).

```cs
public static IEnumerable<ApiScope> ApiScopes =>
  new ApiScope[]
  {
    new ApiScope("backend") { UserClaims = new string[] { JwtClaimTypes.Name }}
  };
```

This means that we can retrieve it using the `FindFirst` method of the `User` property in our `Controller` 

Open the `BackEnd/Controllers/PhotosController.cs`, locate the `PostPhoto` action and add this line code before you save the photo to the database:

```cs
photo.UserName = User.FindFirst(c => c.Type == JwtClaimTypes.Name && c.Issuer == "https://localhost:5001").Value;
```
This requires to install the `IdentityModel` NuGet Package.

Optionally, you may want to open the db an manually fill the UserName column for each photo in your Photos table, for example by opening the `SQL Server Object Explorer` in `Visual Studio` and select your `BackEnd` database. 

## Authorization

Now that the code for our Database is ready, let's proceed to enforce Authorization Policies by implementing [Resource Based Authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-6.0).

### Custom Policy-Based Authorization

Role authorization and Claims authorization make use of 

- a requirement 
- a handler for the requirement 
- a pre-configured policy

These building blocks allow you to express authorization evaluations in code, allowing for a richer, reusable, and easily testable authorization structure.

An *authorization policy* is made up of one or more *requirements*. Register it as part of the authorization service configuration, in the app's `Program.cs` file:

```cs
builder.Services.AddAuthorization(options => {
    options.AddPolicy("PhotoOwner", policy => policy.Requirements.Add(new PhotoOwnerAuthorizationRequirement()));
});
```

Here you can see a `PhotoOwner` policy is created with a single requirement, that of being the owner of a photo, which is passed as a parameter to the requirement. ```PhotoOwnerAuthorizationRequirement``` is a class that we will create in a following step, so don't worry if your code does not compile.

Policies can usually be applied using the ```Authorize``` attribute by specifying the policy name, but not in this case.
Our authorization depends upon the resource being accessed. A `Photo` has a `UserName` property. Only the photo owner is allowed to update it or delete it, so the resource must be loaded from the photo repository before an authorization evaluation can be made. This cannot be done with an `[Authorize]` attribute, as attribute evaluation takes place before data binding and before your own code to load a resource runs inside an action. Instead of *declarative authorization*, the attribute method, we must use *imperative authorization*, where a developer calls an authorize function within their own code.

### Authorizing within your code

Authorization is implemented as a service, ```IAuthorizationService```, registered in the service collection and available via dependency injection for Controllers to access.

```cs
public class PhotosController : ControllerBase {
  private readonly BackEndContext _context;
  private readonly IAuthorizationService _authorizationService;

  public PhotosController(BackEndContext context, IAuthorizationService authorizationService) {
    _context = context;
    _authorizationService = authorizationService;
  }
  //same code as before
}
```

The ```IAuthorizationService``` interface has two methods, one where you pass the resource and the policy name and the other where you pass the resource and a list of requirements to evaluate.
To call the service, load your photo within your action then call the `AuthorizeAsync`, returning a `ChallengeResult` if the `Succeeded` property of the result is false. 
Also, add the `[Authorize]` attribute on top of the `PutPhoto` method in order to make sure that the user is at least authenticated before proceeding with the action.

### Update Action

This is how the `PutPhoto` becomes:

```cs
[HttpPut("{id}")]
[Authorize]
public async Task<IActionResult> PutPhoto(int id, Photo photo) {
    if (id != photo.Id) {
        return BadRequest();
    }
    Photo original = await _context.Photo.AsNoTracking<Photo>().FirstOrDefaultAsync(p => p.Id == id);
    AuthorizationResult authresult = await _authorizationService.AuthorizeAsync(User, original, "PhotoOwner");
    if (!authresult.Succeeded) {
        return new ForbidResult();
    }

    _context.Entry(photo).State = EntityState.Modified;

    try {
        await _context.SaveChangesAsync();
    } catch (DbUpdateConcurrencyException) {
        if (!PhotoExists(id)) {
            return NotFound();
        } else {
            throw;
        }
    }

    return NoContent();
}
```

### Delete Action

This is how the `DeletePhoto` becomes:

```cs
[HttpDelete("{id}")]
[Authorize]
public async Task<ActionResult<Photo>> DeletePhoto(int id) {
  var photo = await _context.Photo.FindAsync(id);
  AuthorizationResult authresult = await _authorizationService.AuthorizeAsync(User, photo, "PhotoOwner");
  if (!authresult.Succeeded) {
    return new ForbidResult();
  }

  if (photo == null) {
    return NotFound();
  }

  _context.Photo.Remove(photo);
  await _context.SaveChangesAsync();

  return photo;
}
```

### Requirements

An authorization requirement is a collection of data parameters that a policy can use to evaluate the current user principal. In our `PhotoOwner` policy the requirement we have is a single parameter, the owner. A requirement must implement ```IAuthorizationRequirement```. This is an empty, marker interface. 
Create a new Folder ```Authorization``` in your ApiController project.
Add a new ```PhotoOwnerAuthorizationRequirement``` class and let the class implement the ```IAuthorizationRequirement``` interface by replacing the file content with the following code :

```cs
using Microsoft.AspNetCore.Authorization;

namespace Backend.Authorization; 
public class PhotoOwnerAuthorizationRequirement : IAuthorizationRequirement {
}
```

A requirement doesn't need to have data or properties.

### Authorization Handlers

An *authorization handler* is responsible for the evaluation of any properties of a requirement. The authorization handler must evaluate them against a provided ```AuthorizationHandlerContext``` to decide if authorization is allowed. A requirement can have multiple handlers. Handlers must inherit ```AuthorizationHandler<T>``` where ```T``` is the requirement it handles.

We will first look to see if the current user principal has a name claim which has been issued by an Issuer we know and trust. If the claim is missing we can't authorize so we will return. If we have a claim, we'll have to figure out the value of the claim, and if it matches the UserName of the photo then authorization will be successful. Once authorization is successful we will call context.Succeed() passing in the requirement that has been successful as a parameter.

In the ```Authorization``` folder, add a ```PhotoOwnerAuthorizationHandler``` class and replace its content with the following code:

```cs
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Authorization; 
public class PhotoOwnerAuthorizationHandler : AuthorizationHandler<PhotoOwnerAuthorizationRequirement, Photo> {
  protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PhotoOwnerAuthorizationRequirement requirement, Photo resource) {
    if (!context.User.HasClaim(c => c.Type == ClaimTypes.Name && c.Issuer == "https://localhost:5001"))
      return Task.CompletedTask;

    var userName = context.User.FindFirst(c => c.Type == ClaimTypes.Name && c.Issuer == "https://localhost:5001").Value;

    if (userName == resource.UserName)
      context.Succeed(requirement);

    return Task.CompletedTask;
  }
}
```

Handlers must be registered in the services collection during configuration. 

Each handler is added to the services collection by using ```services.AddSingleton<IAuthorizationHandler, YourHandlerClass>();``` passing in your handler class.

Open `Program.cs` and add this line of code before `var app = builder.Build();`:

```cs
//requires using Microsoft.AspNetCore.Authorization;
//requires using BackEnd.Authorization;
builder.Services.AddSingleton<IAuthorizationHandler, PhotoOwnerAuthorizationHandler>();
```

Save everything and ensure it compiles.

We are now ready to move to the FrontEnd.

## Update the Photos Component, Details and Delete View

First of all, let's see if we can speed up our process a bit. We have three pages (Home, Details and Delete) that basically use the same layout: a card with the photo information. The only thing that changes are which buttons to show. This means that we will have to update the UI and the logic of three components (Photos, Details and Delete), writing  the same code three times. This situation is less than ideal, so let's refactor the `card` into its own component and let's make it so that we can configure which buttons to show depending on the view.

## The Photo Component

In the `src/components` folder, create a new file `Photo.vue`.
Scaffold the usual vue template with `<template>` and `<script>`.  
Now cut the `card` of the `Photos` component and paste it in the `Photo` component.

```html
<template>
<v-card elevation="10">
  <v-card-title>{{ photo.id }} - {{ photo.title }}</v-card-title>
  <v-card-text>{{ photo.description }}</v-card-text>
  <v-card-actions>
    <v-btn variant="text" color="primary" :to="{name: 'details', params: {id: photo.id}}">details</v-btn>
    <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}">edit</v-btn>
    <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}">delete</v-btn>
  </v-card-actions>
</v-card>
</template>
```

This time, instead of loading the photo by asking it to the datalayer, we will accept it as a [prop](https://vuejs.org/guide/components/props.html). So the `<script>` becomes

```html
<script>
export default {
    props: {
        photo : Object
    }
}
</script>
```

Now let's use the component from within the `Photos` component.
- The `<template>` becomes

```html
<template>
  <v-row>
    <v-col
     v-for="photo in photos" :key="photo.id"
     cols="12" md="4"
    >
      <photo :photo="photo" />
    </v-col>
  </v-row>
</template>
```

-The `<script>` becomes

```html
<script>
import datalayer from '../datalayer'
import Photo from "./Photo.vue"
export default {
    data () {
        return {
            photos: []
        }
    },
    components: {
        Photo
    },
    async created () {
        this.photos = await datalayer.getPhotos()
    }
}
</script>
```

Save and verify that the home view still works as before.

Because we want to use the card from within the `Details` and `Delete` views as well, we need to be able to configure which buttons to show.
- The `Photos` Component used in the `Home` View will configure the `Photo` to show: 
  - A button to navigate to the `Details` View
  - A button to navigate to the `Update` View
  - A button to navigate to the `Delete` View
- The `Details` View  will configure the `Photo` to show:
  - A button to navigate to the `Update` View
  - A button to navigate to the `Delete` View
- The `Delete` View  will configure the `Photo` to show:
  - A button to actually delete the photo

Let's create some `Boolean` `props` into the `Photo` component:

```js
details: {type: Boolean, default: false},
update: {type: Boolean, default: false},
requestdelete: {type: Boolean, default: false},
confirmdelete: {type: Boolean, default: false}
```

Let's use the `props` to show the corresponding buttons.  
Let's [emit an event](https://vuejs.org/guide/components/events.html) when the confirmdelete button is pressed.

```html
<v-card-actions>
  <v-btn variant="text" color="primary" :to="{name: 'details', params: {id: photo.id}}" v-if="details===true">details</v-btn>
  <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}" v-if="update===true">edit</v-btn>
  <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}" v-if="requestdelete===true">delete</v-btn>
  <v-btn variant="text" color="primary" :to="{name: 'home'}" v-if="confirmdelete===true">CANCEL</v-btn>
  <v-btn variant="text" @click="$emit('deletePhoto')" color="error" v-if="confirmdelete===true">CONFIRM DELETE</v-btn>
</v-card-actions>
```

Now let's have the `Photos` component [pass the values](https://vuejs.org/guide/components/props.html#boolean-casting) it needs to show. We don't need to pass the rest, as they are already `false`.

```html
<photo :photo="photo" details update requestdelete />
```

Let's repeat for the `Details` and `Delete` Views.

The `<template>` section of the `src/views/DetailsView.vue` view becomes:

```html
<template>
<v-row>
  <v-col>
    <photo :photo="photo" update requestdelete />
  </v-col>
</v-row>
</template>
```

while the `<script>` section becomes

```js
<script>
import datalayer from '../datalayer'
import Photo from "../components/Photo.vue"
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
  components:{
    Photo
  },
  async created () {
    this.photo = await datalayer.getPhotoById(+this.$route.params.id)
  }
}
</script>
```

The `<template>` section of the `src/views/DeleteView.vue` view becomes

```html
<template>
  <v-row>
    <v-col cols="sm">
      <photo :photo="photo" confirmdelete @delete-photo="deletePhoto" />
    </v-col>
  </v-row>
</template>
```

The `<script>` section becomes

```js
<script>
import datalayer from '../datalayer'
import Photo from "../components/Photo.vue"
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
  components:{
    Photo
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
```

We're done refactoring. Everything should still work exactly as before, so we can (finally!) proceed to 
- Show the owner name on each photo
- Show the delete and update buttons only if the user is authorized 

### The photo owner name

Let's show the owner of each photo. Open the `Photo.vue` component under the `src\components` folder and replace this code

```html
<v-card-text>
  {{ photo.description }}
</v-card-text>
```

with the following

```
<v-card-text>
  <p>{{ photo.description }}</p>
  <p>{{ photo.userName }}</p>
</v-card-text>
```

If you have updated the database content with user names for the photos, you should see them on each view, now.

Now we want to show the buttons only if the photo is owned by the current user. In order to do that we have to use the `authenticationManager` to get who the current user is. We will use this information to compare it with each photo's `userName` property in the view template. Luckily we have written our code in a composable, so we can import that to already include most of the logic we need.

In the `Photo` component we will test if the `photo.userName` is equal to the `user.name`.

## Import the `user` composable to retrieve the current user

Open the `Photo.vue` component under your `src/components` folder, locate the `<script>` tag and import the `useUser` function by adding the following line:

```js
import { useUser } from '../user.js'
```

Extract and export the `user` reactive property during `setup`:

```
setup(){
  const { user } = useUser()
  return { user }
},
```

Now let's create some [Computed Properties](https://vuejs.org/guide/essentials/computed.html)  

```js
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
```
We can now update the template.

```html
<v-card-actions>
    <v-btn variant="text" color="primary" :to="{name: 'details', params: {id: photo.id}}" v-if="details===true">details</v-btn>
    <v-btn variant="text" color="warning" :to="{name: 'update', params: {id: photo.id}}" v-if="showUpdateButton">edit</v-btn>
    <v-btn variant="text" color="error" :to="{name: 'delete', params: {id: photo.id}}" v-if="showDeleteButton">delete</v-btn>
    <v-btn variant="text" color="primary" :to="{name: 'home'}" v-if="showConfirmDeleteButtons">CANCEL</v-btn>
    <v-btn variant="text" @click="$emit('deletePhoto')" color="error" v-if="showConfirmDeleteButtons">CONFIRM DELETE</v-btn>
</v-card-actions>
```

If you run the application, you should see the update and delete button only on photos created by the logged on user.

### Pass the credentials during Update and Delete

Now let's proceed to update our `datalayer`: we need to pass the credentials during the update and delete, to make sure that our service can recognize the user by extracting the user name from the token.

Modify the `updatePhoto` method of your `datalayer.js` file as follows:

```js
async updatePhoto (id, photo) {
  const user = await applicationUserManager.getUser()
  return fetch(`${this.serviceUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(photo),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (user ? user.access_token : '')
    })
  })
}
```

The `deletePhoto` method becomes:

```js
async deletePhoto (id) {
  const user = await applicationUserManager.getUser()
  return fetch(`${this.serviceUrl}/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      'Authorization': 'Bearer ' + (user ? user.access_token : '')
    })
  })
}
```
This concludes this lab.

In the next step we'll use the Camera API to upload a picture of the photo.