using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Exceptions;

namespace MyFlickList.Api.Controllers
{
    public abstract class ControllerBase : Microsoft.AspNetCore.Mvc.ControllerBase
    {
        protected async Task<IActionResult> WrapAsync(Func<Task<IActionResult>> executeAsync)
        {
            try
            {
                return await executeAsync();
            }
            catch (DomainException ex)
            {
                var statusCode = ex.StatusCodeHint switch
                {
                    StatusCodeHint.InternalServerError => 500,
                    StatusCodeHint.NotFound => 404,
                    StatusCodeHint.Conflict => 409,
                    _ => 500
                };

                return Problem(ex.Message, statusCode: statusCode, title: "Error");
            }
        }
    }
}