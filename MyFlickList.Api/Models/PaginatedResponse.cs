using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyFlickList.Api.Models
{
    public class PaginatedResponse<T>
    {
        [Required]
        public IReadOnlyList<T> Items { get; }

        [Required]
        public int Page { get; }

        [Required]
        public int TotalPageCount { get; }

        public PaginatedResponse(IReadOnlyList<T> items, int page, int totalPageCount)
        {
            Items = items;
            Page = page;
            TotalPageCount = totalPageCount;
        }
    }

    public static class PaginatedResponse
    {
        public static PaginatedResponse<T> Create<T>(IReadOnlyList<T> items, int page, int totalPageCount) =>
            new PaginatedResponse<T>(items, page, totalPageCount);

        public static async Task<PaginatedResponse<T>> CreateAsync<T>(IQueryable<T> itemsQuery, int page, int itemsPerPage)
        {
            var totalCount = await itemsQuery.CountAsync();
            var totalPageCount = (int) Math.Ceiling(1.0 * totalCount / itemsPerPage);

            var skip = (page - 1) * itemsPerPage;
            var take = itemsPerPage;

            var items = await itemsQuery.Skip(skip).Take(take).ToArrayAsync();

            return Create(items, page, totalPageCount);
        }
    }
}