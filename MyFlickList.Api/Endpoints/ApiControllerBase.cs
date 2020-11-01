using System.Net;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Internal.Extensions;

namespace MyFlickList.Api.Endpoints
{
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected ActionResult Error(HttpStatusCode statusCode, string title, string message) =>
            Problem(
                statusCode: (int) statusCode,
                title: title,
                detail: message
            );

        protected ActionResult Error(HttpStatusCode statusCode, string message) =>
            Error(statusCode, statusCode.ToString().ToHumanWords(), message);
    }
}