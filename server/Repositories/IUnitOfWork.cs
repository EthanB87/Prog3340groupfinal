
	namespace Prog3340GroupFinal.Repositories
	{
	    public interface IUnitOfWork
	    {
	        ITaskRepository Tasks { get; }
	        IUserRepository Users { get; }
	        Task<int> SaveChangesAsync();

	    }
	}
