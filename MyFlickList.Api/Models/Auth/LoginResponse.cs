using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Auth
{
    public class LoginResponse
    {
        [Required]
        public string Token { get; set; } = default!;
    }
}