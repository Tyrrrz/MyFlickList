using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace MyFlickList.Api.Endpoints
{
    internal class RequiredBindingMetadataProvider : IBindingMetadataProvider
    {
        public void CreateBindingMetadata(BindingMetadataProviderContext context)
        {
            // Make sure that properties marked as [Required] are actually required to be bound
            // on top of just not being null.
            if (context.PropertyAttributes is not null && context.PropertyAttributes.OfType<RequiredAttribute>().Any())
            {
                context.BindingMetadata.IsBindingRequired = true;
            }
        }
    }
}