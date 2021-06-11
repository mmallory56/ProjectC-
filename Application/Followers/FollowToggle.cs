using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }

        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await context.Users.FirstOrDefaultAsync(x=>x.UserName==userAccessor.GetUserName());
                var target = await context.Users.FirstOrDefaultAsync(x=>x.UserName==request.TargetUsername);

                if(target ==null)return null;

                var following = await context.UserFollowing.FindAsync(observer.Id, target.Id);

                if(following == null){
                    following = new UserFollowing{
                        Observer = observer,
                        Target = target
                        
                    };
                    context.UserFollowing.Add(following);
                }
                else
                {
                    context.UserFollowing.Remove(following);
                }
                var success = await context.SaveChangesAsync()>0;

                if(success)return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to Follow for some Reason");
            }
        }
    }
}