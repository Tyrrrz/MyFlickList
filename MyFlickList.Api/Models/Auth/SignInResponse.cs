using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class SignInResponse
    {
        [Required]
        public string Token { get; set; } = default!;
    }
}