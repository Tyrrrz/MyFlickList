using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class SignInRequest
    {
        [Required(AllowEmptyStrings = false)]
        public string Username { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Password { get; set; } = default!;
    }
}