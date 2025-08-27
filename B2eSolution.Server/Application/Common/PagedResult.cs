namespace B2eSolution.Api.Application.Common
{
    public class PagedResult<T>
    {
        public int Total { get; set; }
        public IReadOnlyList<T> Itens { get; set; } = Array.Empty<T>();
    }
}
