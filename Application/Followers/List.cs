using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }

            public string Username { get; set; }


        }
        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper mapper;
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        {
                            profiles = await context.UserFollowing.Where(x => x.Target.UserName == request.Username)
                         .Select(x => x.Observer)
                         .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider,new{currentUsername=userAccessor.GetUserName()})
                         .ToListAsync();
                            break;
                        }
                    case "following":
                        {
                            profiles = await context.UserFollowing.Where(x => x.Observer.UserName == request.Username)
                         .Select(x => x.Target)
                         .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider,new{currentUsername=userAccessor.GetUserName()})
                         .ToListAsync();
                            break;
                        }

                }
                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}