using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class SignUpRequest
    {
        [Required]
        [MinLength(3)]
        [MaxLength(48)]
        public string Username { get; set; } = default!;

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = default!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = default!;
    }
}