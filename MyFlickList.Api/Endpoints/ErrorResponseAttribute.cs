using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace MyFlickList.Api.Endpoints
{
    public class ErrorResponseAttribute : ProducesResponseTypeAttribute
    {
        [ExcludeFromCodeCoverage]
        public new Type Type => base.Type;

        public ErrorResponseAttribute(HttpStatusCode statusCode)
            : base(typeof(ProblemDetails), (int) statusCode) {}
    }
}