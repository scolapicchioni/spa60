# Backend: Web API with ASP.NET Core 60 and Visual Studio 2022

In this lab we're going to build a [REST](https://www.restapitutorial.com/lessons/whatisrest.html#) service using [ASP.NET Core 6.0 Web API](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0).

## Create a Web API with ASP.NET Core

Here is the API that you'll create:

| API                       | Description                | Request body           | Response body     |
| ------------------------- | -------------------------- | ---------------------- | ----------------- |
| GET /api/photos	        | Get all photos   	       | None	                  | Array of photos |
| GET /api/photos/{id}    | Get a photo by ID        | None                   | Photo           |
| POST /api/photos        | Add a new photo          | Photo                | Photo           |
| PUT /api/photos/{id}    | Update an existing photo | Photo                |                   |	
| DELETE /api/photos/{id} | Delete a photo           | None. No request body- | None              |

The client submits a request and receives a response from the application. Within the application we find the controller, the model, and the data access layer. The request comes into the application's controller, and read/write operations occur between the controller and the data access layer. The model is serialized and returned to the client in the response.

The **client** is whatever consumes the Web API (browser, mobile app, and so forth). We aren't writing a client in this tutorial. We'll use [Swagger](https://swagger.io/) to test the Backend. We will write the client in the following lab.

A **model** is an object that represents the data in your application. In this case, the only model is a Photo item. Models are represented as simple C# classes (POCOs).

A **controller** is an object that handles HTTP requests and creates the HTTP response. This app will have a single controller.

### Prerequisites
Install the following:

- [.NET Core 6 SDK](https://www.microsoft.com/net/core) or later.
- [Visual Studio 2022](https://www.visualstudio.com/downloads/) or later with the ASP.NET and web development workload.

### Create the project

- Open Visual Studio.
- In the `Create New Project` window, select the `ASP.NET Core Web Api` project template. 
    - Go to the folder `Lab04\Start\PhotoSharingApplication`.
    - Name the Solution `Backend`. 
    - Name the Project `Backend`
    - Select `Create`
- In the `Create a new ASP.NET Core Web Api` window:
    - Select `.NET 6.0`
    - In the `Authentication Type` select `None`. 
    - Ensure that the `Configure for Https` checkbox is selected
    - Do not check `Enable Docker`.
    - Ensure that `Use Controllers` is checked
    - Ensure that `Enable OpenAPI support` is checked
    - Do not check `Do not use top-level statement` 
    
    - Click on `Create`

### Add a model class

A **model** is an object that represents the data in your application. In this case, the only model is a `Photo` item, whose properties are `Id` *(int)*, `Title` *(string)* and `Description` *(string)*.

Add a folder named `Models`. 
- In `Solution Explorer`, right-click the project. 
- Select `Add` > `New Folder`. 
- Name the folder `Models`.

Note: You can put model classes anywhere in your project, but the `Models` folder is used by convention.

Add a `Photo` class. 
- Right-click the `Models` folder and
- Select `Add` > `Class`. 
- Name the class `Photo` 
- Select `Add`.

Replace the generated code with:

```cs
namespace Backend.Models; 
public class Photo {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
}
```

### Generate the Controller and the DbContext

Ensure that the project compiles first, then let the wizard generate the `Controller` and the `DbContext` for you.
- In `Solution Explorer`, right-click the `Controllers` folder. 
- Select `Add` > `Controller`. 
- Select  `API Controller with actions, using Entity Framework`
- Click `Add`
- As `Model class` select `Photo (Backend.Models)`
- As `Data context class`, click on the `+` button
- Name the context `Backend.Models.BackendContext`
- Name the Controller `PhotosController`
- Click `Add`

After a while you should see some new files. 

### The database context

The database context is the main class that coordinates [Entity Framework](https://docs.microsoft.com/en-us/ef/core/) functionality for a given data model. This class is created by deriving from the `Microsoft.EntityFrameworkCore.DbContext` class.

The wizard added a `Data` folder in which you can find the `BackendContext` class.

```cs
using Microsoft.EntityFrameworkCore;

namespace Backend.Models {
    public class BackendContext : DbContext {
        public BackendContext (DbContextOptions<BackendContext> options) : base(options) {
        }

        public DbSet<Backend.Models.Photo> Photo { get; set; }
    }
}
```

The wizard also configured the context and added it as a Service using the [Dependency Injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-6.0) features of `ASP.NET Core`.
Open the `Program.cs` file and you will see where this happens:

```cs
builder.Services.AddDbContext<BackendContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BackendContext") ?? throw new InvalidOperationException("Connection string 'BackendContext' not found.")));
```
The `BackendContext` connection string is [configured](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-6.0) in the `appsettings.json` file:

```json
"ConnectionStrings": {
    "BackendContext": "Server=(localdb)\\mssqllocaldb;Database=Backend.Data;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

### The Controller

The wizard took care of the [Api Controller]https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0) by generating a class that derives from [ControllerBase](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.controllerbase?view=aspnetcore-6.0), which provides many properties and methods that are useful for handling HTTP requests.

The `Microsoft.AspNetCore.Mvc` namespace provides attributes that can be used to configure the behavior of web API controllers and action methods.

The [ApiController](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#apicontroller-attribute) attribute was applied to the controller class to enable the following API-specific behaviors:
- [Attribute routing requirement](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#attribute-routing-requirement)
- [Automatic HTTP 400 responses](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#automatic-http-400-responses)
- [Binding source parameter inference](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#binding-source-parameter-inference)
- [Multipart/form-data request inference]https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#multipartform-data-request-inference)
- [Problem details for error status codes]https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-6.0#problem-details-for-error-status-codes) 

The controller and every action were mapped to a route through the use of [routing](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-6.0) system, in particular [attribute routing](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-6.0#attribute-routing-for-rest-apis).

The Controller makes use of the DI container by explicitly declaring its dependency on the `BackendContext` in its constructor.

```cs
[Route("api/[controller]")]
[ApiController]
public class PhotosController : ControllerBase
{
    private readonly BackendContext _context;

    public PhotosController(BackendContext context)
    {
        _context = context;
    }
    //code omitted for brevity
}
```

## Getting Photo items

We got two `GetPhoto` methods:

```cs
// GET: api/Photos
[HttpGet]
public async Task<ActionResult<IEnumerable<Photo>>> GetPhoto()
{
    return await _context.Photo.ToListAsync();
}

// GET: api/Photos/5
[HttpGet("{id}")]
public async Task<ActionResult<Photo>> GetPhoto(int id)
{
    var photo = await _context.Photo.FindAsync(id);

    if (photo == null)
    {
        return NotFound();
    }

    return photo;
}
```

It returns an `Task<ActionResult<IEnumerable<Photo>>>`. ASP.Net automatically serializes the list of `Photo` to JSON and writes the JSON into the body of the response message. The response code for this method is 200, assuming there are no unhandled exceptions. (Unhandled exceptions are translated into 5xx errors.)

Here is an example HTTP response for the first `GetPhoto()` method:

```
HTTP/1.1 200 OK
   Content-Type: application/json; charset=utf-8
   Server: Microsoft-IIS/10.0
   Date: Thu, 18 Jun 2015 20:51:10 GMT
   Content-Length: 82

   [{"Id":1,"Title":"Photo 1","Description":"First Sample Photo"}]
```

The second `GetPhoto(int id)` method returns a `Task<ActionResult<Photo>>` type:

- A 404 status code is returned when the photo represented by id doesn't exist in the underlying data store. The `NotFound` convenience method is invoked as shorthand for return `new NotFoundResult();`.
- A 200 status code is returned with the Photo object when the photo does exist. The `Ok` convenience method is invoked as shorthand for return `new OkObjectResult(photo);`.

### Create Action

As for REST standards, the action that adds a photo to the database is bound to the `POST http verb`.

```cs
// POST: api/Photos
// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
[HttpPost]
public async Task<ActionResult<Photo>> PostPhoto(Photo photo)
{
    _context.Photo.Add(photo);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetPhoto", new { id = photo.Id }, photo);
}
```

The `PostPhoto()` is an `HTTP POST` method, indicated by the `[HttpPost]` attribute. The `[ApiController]` attribute at the top of the controller declaration tells ASP.Net to get the value of the `Photo` item from the body of the HTTP request.

The `CreatedAtAction` method:

- Returns a 201 response. HTTP 201 is the standard response for an HTTP POST method that creates a new resource on the server.
- Adds a Location header to the response. The Location header specifies the URI of the newly created Photo item. See [10.2.2 201 Created](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
- Uses the `GetPhoto` named route to create the URL. The `GetPhoto` named route is defined in `GetPhoto(int id)`

Thanks to the `[ApiController]` attribute, the request is checked against the validation engine validation and in case of a BadRequest the default response type for an HTTP 400 response is ValidationProblemDetails. The following request body is an example of the serialized type:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "|7fb5e16a-4c8f23bbfc974667.",
  "errors": {
    "": [
      "A non-empty request body is required."
    ]
  }
}
```

The ValidationProblemDetails type:

- Provides a machine-readable format for specifying errors in web API responses.
- Complies with the RFC 7807 specification.

### Update

Update is similar to Create, but uses `HTTP PUT`. 

```cs
// PUT: api/Photos/5
// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
[HttpPut("{id}")]
public async Task<IActionResult> PutPhoto(int id, Photo photo)
{
    if (id != photo.Id)
    {
        return BadRequest();
    }

    _context.Entry(photo).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!PhotoExists(id))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }

    return NoContent();
}
```


The response is 204 (No Content). According to the HTTP spec, a PUT request requires the client to send the entire updated entity, not just the deltas. To support partial updates, use HTTP PATCH.

### Delete

The Delete uses `HTTP DELETE` verb and expects an `id` in the address. 

```cs
// DELETE: api/Photos/5
[HttpDelete("{id}")]
public async Task<IActionResult> DeletePhoto(int id)
{
    var photo = await _context.Photo.FindAsync(id);
    if (photo == null)
    {
        return NotFound();
    }

    _context.Photo.Remove(photo);
    await _context.SaveChangesAsync();

    return NoContent();
}
```

It returns 
- A 200 (Ok) with the deleted photo if successful
- A 404 (Not Found) if the id is not found in the database

### Generate migrations and database

The database has not been created. We're going to use [Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=vs) to generate the DB and update the schema on a later Lab.

To add an initial migration, run the following command.

```
Add-Migration InitialCreate
```

Three files are added to your project under the Migrations directory:

- XXXXXXXXXXXXXX_InitialCreate.cs--The main migrations file. Contains the operations necessary to apply the migration (in Up()) and to revert it (in Down()).
- XXXXXXXXXXXXXX_InitialCreate.Designer.cs--The migrations metadata file. Contains information used by EF.
- BackendContextModelSnapshot.cs--A snapshot of your current model. Used to determine what changed when adding the next migration.

The timestamp in the filename helps keep them ordered chronologically so you can see the progression of changes.

### Update the database
Next, apply the migration to the database to create the schema.

```
Update-Database
```

### Try the Actions of the controller

Because we checked `Enable OpenApi Support` when we created our project, the template added the [Swagger](https://learn.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-6.0) documentation and the UI to test our controller by using [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore).

In Visual Studio, press `F5` to launch the app. Visual Studio launches a browser and navigates to `https://localhost:{port}/swagger/index.html`, where port is a randomly chosen port number. 
On this page you can see the autogenerated [Swagger UI](https://swagger.io/tools/swagger-ui/).
Here, you can try each action of your controller by clicking on the links and buttons to invoke them passing parameters if necessary.

The two `GET` actions should not return anything yet, but if you add some data by selecting the `POST` action, you should be able to read the data back by going to the `GET` actions again. 

Our service is ready. In the next lab we will setup the client side. 

Go to `Labs/Lab05`, open the `readme.md` and follow the instructions thereby contained.   