using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class SignUpRequest
    {
        [Required]
        [StringLength(48, MinimumLength = 3)]
        public string Username { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(1024, MinimumLength = 6)]
        public string Password { get; set; } = default!;
    }
}