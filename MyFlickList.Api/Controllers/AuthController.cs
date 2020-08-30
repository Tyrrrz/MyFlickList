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

        [HttpPost("signup")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SignUp(SignUpRequest request)
        {
            var result = await _signInManager.UserManager.CreateAsync(new UserEntity
            {
                UserName = request.Username,
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

            return CreatedAtAction(nameof(SignIn), null);
        }

        [HttpPost("signin")]
        [ProducesResponseType(typeof(SignInResponse), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SignIn(SignInRequest request)
        {
            var user = await _signInManager.UserManager.FindByNameAsync(request.Username);
            if (user == null)
                return BadRequest();

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return BadRequest();

            // TODO: add user claims
            var jwt = _jwtProvider.GenerateToken(user.Id.ToString(), user.UserName);

            return Ok(new SignInResponse
            {
                Token = jwt
            });
        }
    }
}