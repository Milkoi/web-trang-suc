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
            if (await _context.Users!.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Email already exists");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                Address = dto.Address,
                Role = "Customer"
            };

            _context.Users!.Add(user);
            await _context.SaveChangesAsync();

            // Create a cart for the new user
            var cart = new Cart { UserId = user.Id };
            _context.Carts!.Add(cart);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                Token = CreateToken(user),
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.Users!.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || user.Password == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            // Update login audit info
            user.LastLoginAt = DateTime.UtcNow;
            user.LoginIp = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                Token = CreateToken(user),
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    AvatarUrl = user.AvatarUrl
                }
            });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "Velmora_Secret_Key_2026_Project_Longer_Key_For_Security"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
