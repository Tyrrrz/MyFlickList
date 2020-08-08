using System;

namespace MyFlickList.Api.Exceptions
{
    public enum StatusCodeHint
    {
        InternalServerError,
        NotFound,
        Conflict
    }

    public class DomainException : Exception
    {
        public StatusCodeHint StatusCodeHint { get; }

        public DomainException(string message, StatusCodeHint statusCodeHint = StatusCodeHint.InternalServerError)
            : base(message)
        {
            StatusCodeHint = statusCodeHint;
        }
    }
}