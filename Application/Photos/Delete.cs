using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
            public Command(string id)
            {
                Id = id;
            }

            
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.photoAccessor = photoAccessor;
                this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserName==userAccessor.GetUserName());

                if(user ==null)return null;

                var photo = user.Photos.FirstOrDefault(x=>x.Id == request.Id);

                if(photo == null)return null;

                if(photo.IsMain) return Result<Unit>.Failure("You cannot delete your profile photo");

                var result = await photoAccessor.DeletePhoto(request.Id);

                if(result==null)return Result<Unit>.Failure("Failed to Delete Photo from cloudinary");
                user.Photos.Remove(photo);

                var success = await context.SaveChangesAsync()>0;
                if(!success) return Result<Unit>.Failure("Failed to remove database photo");

                return Result<Unit>.Success(Unit.Value);
                
            }
        }
    }
}