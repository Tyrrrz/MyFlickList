using AutoMapper;
using MyFlickList.Api.Entities.Catalog;
using MyFlickList.Api.Models.Catalog;

namespace MyFlickList.Api.Models
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<TagEntity, string>()
                .ConvertUsing(o => o.Name);

            CreateMap<FlickTagEntity, string>()
                .ConvertUsing(o => o.TagName);

            CreateMap<FlickEntity, FlickListingResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.FlickTags));

            CreateMap<FlickEntity, FlickResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.FlickTags));
        }
    }
}