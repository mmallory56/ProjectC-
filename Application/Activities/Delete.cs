using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity =  await this.context.Activities.FindAsync(request.Id);
                if(activity==null) return null;
                 context.Remove(activity);
                 var result = await context.SaveChangesAsync()>0;
                 if(!result)Result<Unit>.Failure("Failed to Delete");
                 return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}