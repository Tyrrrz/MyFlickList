using System;
using Microsoft.AspNetCore.Identity;

namespace MyFlickList.Api.Entities.Auth
{
    public class UserEntity : IdentityUser<Guid>
    {
    }
}