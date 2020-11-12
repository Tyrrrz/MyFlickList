using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace MyFlickList.Api.Endpoints
{
    public class ValidationErrorResponseAttribute : ProducesResponseTypeAttribute
    {
        [ExcludeFromCodeCoverage]
        public new Type Type => base.Type;

        public ValidationErrorResponseAttribute(HttpStatusCode statusCode)
            : base(typeof(ValidationProblemDetails), (int) statusCode) {}
    }
}