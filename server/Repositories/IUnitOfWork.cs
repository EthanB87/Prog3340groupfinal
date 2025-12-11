
namespace Prog3340GroupFinal.Repositories
{
    public interface IUnitOfWork
    {
        //IRepository<Customer> Customers { get; }
       
        Task<int> SaveChangesAsync();

    }
}
