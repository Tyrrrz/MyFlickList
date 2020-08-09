using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Models.Auth;
using MyFlickList.Api.Services;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<UserEntity> _signInManager;
        private readonly JwtProvider _jwtProvider;

        public AuthController(SignInManager<UserEntity> signInManager, JwtProvider jwtProvider)
        {
            _signInManager = signInManager;
            _jwtProvider = jwtProvider;
        }

        [HttpPost("register")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _signInManager.UserManager.CreateAsync(new UserEntity
            {
                UserName = request.UserName,
                Email = request.Email
            }, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Registration failed",
                    Detail = string.Join(Environment.NewLine, result.Errors.Select(e => e.Description))
                });
            }

            return CreatedAtAction(nameof(Login), null);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _signInManager.UserManager.FindByNameAsync(request.UserName);
            if (user == null)
                return BadRequest();

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return BadRequest();

            // TODO: add user claims
            var jwt = _jwtProvider.GenerateToken(user.Id.ToString(), user.NormalizedUserName);

            return Ok(new LoginResponse
            {
                Token = jwt
            });
        }
    }
}