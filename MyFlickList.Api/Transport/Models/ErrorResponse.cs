using System.Net;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Internal.Extensions;

namespace MyFlickList.Api.Transport.Models
{
    public static class ErrorResponse
    {
        public static IActionResult Create(HttpStatusCode statusCode, string title, string message) =>
            new ObjectResult(new ProblemDetails
            {
                Status = (int) statusCode,
                Title = title,
                Detail = message
            }) {StatusCode = (int) statusCode};

        public static IActionResult Create(HttpStatusCode statusCode, string message) =>
            Create(statusCode, statusCode.ToString().ToHumanWords(), message);
    }
}