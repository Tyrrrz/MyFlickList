using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace MyFlickList.Api.Endpoints
{
    public class SuccessResponseAttribute : ProducesResponseTypeAttribute
    {
        [ExcludeFromCodeCoverage]
        public new Type Type => base.Type;

        public SuccessResponseAttribute(HttpStatusCode statusCode)
            : base((int) statusCode) {}
    }
}