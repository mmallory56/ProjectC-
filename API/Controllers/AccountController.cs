using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            this.tokenService = tokenService;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this.userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email ==loginDto.Email);
 
            if (user == null) return Unauthorized();

            var result = await this.signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return Unauthorized();

        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await userManager.Users.AnyAsync(x=>x.Email ==registerDto.Email))
            {
                ModelState.AddModelError("email","Email taken");
                return ValidationProblem();
            }
            if(await userManager.Users.AnyAsync(x=>x.UserName ==registerDto.UserName))
            {
                ModelState.AddModelError("User Name", "Username Taken, Please enter another User Name");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                
            };

            var result = await userManager.CreateAsync(user,registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest(" didn't register");
        }
        [Authorize]
        [HttpGet]

        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x=> x.Email ==User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }
        private UserDto CreateUserObject(AppUser user)
        {
             return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image  = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user)
                
                };
        }
    }
}