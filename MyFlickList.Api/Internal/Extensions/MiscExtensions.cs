using System;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class MiscExtensions
    {
        public static TOut Pipe<TIn, TOut>(this TIn input, Func<TIn, TOut> transform) => transform(input);
    }
}