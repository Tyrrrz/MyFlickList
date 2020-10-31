using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Auth
{
    public class SignInResponse
    {
        [Required]
        public string Token { get; set; } = default!;
    }
}