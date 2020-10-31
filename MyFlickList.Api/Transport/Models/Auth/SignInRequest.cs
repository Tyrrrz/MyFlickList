using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Auth
{
    public class SignInRequest
    {
        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;
    }
}