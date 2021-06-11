using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,int itemsPerpage,int totalItems,int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerpage,
                totalItems,
                totalPages
            };
            response.Headers.Add("Pagination",JsonSerializer.Serialize(paginationHeader));
            response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }
    }
}