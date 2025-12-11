using System.Linq.Expressions;

namespace Prog3340GroupFinal.Repositories
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[]? param);
        Task<T?> GetByIdAsync(int id, params Expression<Func<T, object>>[]? param);
        Task AddAsync(T objType);
        void Update(T objType);
        void Delete(T objType);
    }
}