# MarketPlace Project

The goal of this workshop is to provide you with a starting point to understand how to build a WebApplication with a VueJs Frontend and a .Net Core WebApi Backend, using Duende Identity Server as Identity Provider.

We're going to build a simple web application where people can share their photos.
- Everyone may browse existing photos.
- Only authenticated users may add new photos.
- Only photo owners may edit or delete their photo.

We are going to build 3 projects. The FrontEnd project will be a Progressive Web Application built using Vuejs, Vue Router and Vuetify, while server side we are going to build two .NET Core 6.0 Web Applications using Visual Studio 2022: one will expose a REST API while the second will take care of Authentication, using Duende Identity Server.

1. FrontEnd Client
   - Javascript (ECMAScript 2015+)
   - HTML 5
   - CSS 3
   - Vue.js 3
   - Vue Router
   - Vuetify
   - Open Id Connect Client
   - Fetch API
   - Native Camera API

This project will interact with the user through a browser by dinamically constructing an HTML user interface and will talk to the server by using javascript and json.

2. REST Service 
   - .NET Core 6.0 Web API Controller
   - Entity Framework Core 6.0
   - Sql Server Database
   - Identity Server Client Authentication

This project will be responsible to store the data on the server and respond to the client requests through http and json.

3. Authentication Server
   - Duende Identity Server
   - Entity Framework Core

This project will take care of the authentication part. It will issue JWT tokens that will be used by the client application to gain access to the server.

## What you already need to know:
- C#
- Javascript (ECMAScript 2015+)
- HTML 5
- CSS 3

## What you're going to learn:
- What is REST
- What is .NET Core
- ASP.NET Core 
- What is a Web API Controller
- Kestrel
- Middleware
- Environment variables
- ASP.NET Core Configuration
- Dependency Injection
- Entity Framework Core
- PostMan
- CORS
- Vue.js
- Vue Router
- Fetch API
- WebPack
- Vuetify
- Authentication and Authorization
- OAuth 2 and Open Id Connect
- Duende Identity Server
- Resource Owner Authorization

## Before you begin, you need
- [Visual Studio 2022 (Community Edition is enough)](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=community) 

**Make sure you installed the workload ".NET Core cross-platform development". You can check and install workloads by launching the Visual Studio Installer.**

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node](https://nodejs.org/en/)

## For more information on the .NET Core installation

Please see [https://www.microsoft.com/net/download/windows](https://www.microsoft.com/net/download/windows)


---

# Our workflow

We are going to split our projects into simple steps. Each step will focus on one task and will build on top of the previous step. We will start with simple projects that will become more and more complex along the way. For example, we will not focus on authentication and authorization at first. We will add it at a later step.

This folder contains different subfolder. Each subfolder represents a phase in our project. "Start" folders are the starting points of each step. "Solution" folders are the final versions of each step, given to you just in case you want to check what your project is supposed to become at the end of each lab.
What you have to do is to open a start folder corresponding to the lab you want to try (for example `Lab01/Start` in order to begin) and follow the instructions you find on the `readme.md` file. When you are done, feel free to compare your work with the solution provided in the Solution folder.     

# To START

1. Open the Labs folder
2. Navigate to the Lab01 subfolder
3. Navigate to the Start subfolder
4. Follow the instructions contained in the readme.md file to continue


# If you want to see the final application

## Configure and start the Duende Identity Server Application

- Open `Lab08\Solution\MarketPlace\IdentityServer\IdentityServer.sln` in Visual Studio
- Build the project but do not start it from Visual Studio
- Open a command prompt under the `Lab08\Solution\MarketPlace\IdentityServer` folder
- Type `dotnet run /seed`
- Navigate to `http://localhost:5002` and ensure that the project is up and running

## Configure and start the REST Service

- Open `Lab08\Solution\MarketPlace\Marketplace\MarketPlace.sln` in Visual Studio
- Build the project and start it from Visual Studio

## Configure and start the Javascript client 

- Open `Lab08\Solution\MarketPlace\spaclient` in Visual Studio Code
- Open a terminal window
- Type `npm install`
- Type `npm run serve`

## To Logon

- Username: alice
- Password: Pass123$

