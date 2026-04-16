using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.DTOs;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AccountController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.Users!.AnyAsync(u => u.Email == dto.Email)) return BadRequest("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                DefaultAddress = dto.Address,
                Role = "customer"
            };

            _context.Users!.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                Token = CreateToken(user),
                User = new UserDto { Id = user.Id, Name = user.FullName, Email = user.Email, Role = user.Role }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            try 
            {
                var email = dto.Email?.Trim();
                var password = dto.Password?.Trim();
                
                var user = await _context.Users!.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null || user.Password == null) return Unauthorized("Invalid email or password");
                
                bool isPasswordMatch = user.Password == password;
                if (!isPasswordMatch && user.Password.StartsWith("$2")) {
                    isPasswordMatch = BCrypt.Net.BCrypt.Verify(password, user.Password);
                }

                if (!isPasswordMatch) return Unauthorized("Invalid email or password");

                return Ok(new AuthResponseDto
                {
                    Token = CreateToken(user),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Name = user.FullName,
                        Email = user.Email,
                        Role = user.Role,
                        Avatar = user.Avatar
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("LOGIN EXCEPTION: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, ex.Message);
            }
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "SecretKeyVeryLongForProject"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new SecurityTokenDescriptor { Subject = new ClaimsIdentity(claims), Expires = DateTime.Now.AddDays(7), SigningCredentials = creds };
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}