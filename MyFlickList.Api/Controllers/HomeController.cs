using Microsoft.AspNetCore.Mvc;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("/")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index() => Redirect("swagger/");
    }
}