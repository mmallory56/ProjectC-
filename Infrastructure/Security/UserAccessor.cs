using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor contextAccessor;
        public UserAccessor(IHttpContextAccessor contextAccessor)
        {
            this.contextAccessor = contextAccessor;
        }

        string IUserAccessor.GetUserName()
        {
           return contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}