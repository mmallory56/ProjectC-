using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;
        public IHostEnvironment Env { get; }
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            this.Env = env;
            this.logger = logger;
            this.next = next;

        }

        public async Task InvokeAsync(HttpContext context){
            try{
                await next(context);
            }
            catch(Exception ex)
            {
                logger.LogError(ex,ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError; 

                var response = Env.IsDevelopment()?
                new AppException(context.Response.StatusCode,ex.Message,ex.StackTrace?.ToString()):
                new AppException(context.Response.StatusCode,ex.Message,null);
                var options = new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response,options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}