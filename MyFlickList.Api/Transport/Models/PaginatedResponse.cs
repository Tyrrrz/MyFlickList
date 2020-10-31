using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyFlickList.Api.Transport.Models
{
    public class PaginatedResponse<T>
    {
        [Required]
        public IReadOnlyList<T> Items { get; }

        [Required]
        public int Page { get; }

        [Required]
        public int TotalPages { get; }

        public PaginatedResponse(IReadOnlyList<T> items, int page, int totalPages)
        {
            Items = items;
            Page = page;
            TotalPages = totalPages;
        }
    }

    public static class PaginatedResponse
    {
        public static PaginatedResponse<T> Create<T>(IReadOnlyList<T> items, int page, int totalPages) =>
            new PaginatedResponse<T>(items, page, totalPages);

        public static async Task<PaginatedResponse<T>> FromQueryAsync<T>(
            IQueryable<T> itemsQuery,
            int page, int itemsPerPage,
            CancellationToken cancellationToken = default)
        {
            var count = await itemsQuery.CountAsync(cancellationToken);
            var totalPages = (int) Math.Ceiling(1.0 * count / itemsPerPage);

            var items = await itemsQuery
                .Skip((page - 1) * itemsPerPage)
                .Take(itemsPerPage)
                .ToArrayAsync(cancellationToken);

            return Create(items, page, totalPages);
        }
    }
}