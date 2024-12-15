using FirstDay.Admin.API.DTOs;
using FirstDay.Admin.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FirstDay.Admin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO loginRequest)
        {
            var response = await _authService.AuthenticateUser(loginRequest);
            
            if (response == null || !response.Authenticated)
            {
                return Unauthorized();
            }

            return Ok(response);
        }
    }
}