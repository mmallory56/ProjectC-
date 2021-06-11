using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PageList<ActivityDto>>> {

            public ActivityParams Params { get; set; }
         }

        public class Handler : IRequestHandler<Query, Result<PageList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query =  _context.Activities
                .Where(d =>d.Date>=request.Params.StartDate)
                .OrderBy(d=>d.Date)
                  .ProjectTo<ActivityDto>(mapper.ConfigurationProvider,new{currentUsername=userAccessor.GetUserName()})
                  .AsQueryable();

                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x=>x.Attendees.Any(a=>a.Username==userAccessor.GetUserName()));
                }
                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query =  query.Where(x=>x.HostUsername==userAccessor.GetUserName());
                }
               
                return Result<PageList<ActivityDto>>.Success(
                    await PageList<ActivityDto>.CreateAsync(query,request.Params.PageNumber,request.Params.PageSize)
                );
            }
        }
    }
}