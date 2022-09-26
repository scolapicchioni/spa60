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
