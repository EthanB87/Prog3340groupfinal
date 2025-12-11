
using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;

namespace Prog3340GroupFinal.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        //private IRepository<Customer>? _customers;
       

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        //public IRepository<Customer> Customers
        //{
        //    get
        //    {
        //        if (_customers == null)
        //        {
        //            _customers = new Repository<Customer>(_context);
        //        }
        //        return _customers;
        //    }
        //}

        
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}