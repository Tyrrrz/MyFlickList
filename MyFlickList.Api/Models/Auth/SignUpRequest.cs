using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class SignUpRequest
    {
        [Required(AllowEmptyStrings = false)]
        public string Username { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Email { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Password { get; set; } = default!;
    }
}