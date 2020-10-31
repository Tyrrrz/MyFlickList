using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Auth
{
    public class SignUpRequest
    {
        [Required]
        [RegularExpression("^[a-zA-Z0-9_\\-]+$")]
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