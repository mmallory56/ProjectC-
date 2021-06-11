using System;

namespace Application.Activities
{
    public class ActivityParams
    {
        public bool IsGoing { get; set; }

        public bool IsHost { get; set; }

        public DateTime StartDate { get; set; }= DateTime.UtcNow;
            private const int MaxPageSize = 50;

        public int PageNumber { get; set; }=1;

        private int _pageSize=2;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value>MaxPageSize)?MaxPageSize:value;
        }
        
    }
}