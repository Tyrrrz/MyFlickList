using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class RegisterRequest
    {
        [Required(AllowEmptyStrings = false)]
        public string UserName { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Email { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Password { get; set; } = default!;
    }
}