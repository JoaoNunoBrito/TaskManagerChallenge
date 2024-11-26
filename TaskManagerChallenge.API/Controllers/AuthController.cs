using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManagerChallenge.Data;
using TaskManagerChallenge.DTOs.Auth;

namespace TaskManagerChallenge.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _appDbContext;

        public AuthController(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            var user = _appDbContext.Users.FirstOrDefault(u => u.Email == loginDTO.Email && u.Password == loginDTO.Password);

            if (user == null)
            {
                return Unauthorized();
            }

            IEnumerable<Claim> claims = [
                new("Id", user.Id.ToString()),
                new("FullName", user.FullName.ToString()),
                new("Role", user.Role.ToString()),
            ];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SecretKeyThatShouldNotBeHereNotInGitHub"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "Me",
                audience: "MyselfAndI",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}
