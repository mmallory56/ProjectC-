using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        public IConfiguration Config { get; set; }
        public TokenService(IConfiguration config)
        {
            this.Config = config;
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>{
               new Claim(ClaimTypes.Name,user.UserName),
               new Claim(ClaimTypes.NameIdentifier,user.Id),
               new Claim(ClaimTypes.Email,user.Email)
           };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}