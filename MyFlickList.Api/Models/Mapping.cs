using AutoMapper;
using MyFlickList.Api.Entities.Flicks;
using MyFlickList.Api.Entities.Profiles;
using MyFlickList.Api.Models.Flicks;
using MyFlickList.Api.Models.Profiles;

namespace MyFlickList.Api.Models
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<FlickTagEntity, string>()
                .ConvertUsing(o => o.Name);

            CreateMap<FlickEntity, FlickListingResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.Tags));

            CreateMap<FlickEntity, FlickResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.Tags));

            CreateMap<ProfileEntity, ProfileResponse>()
                .ForMember(o => o.FavoriteFlicks, x => x.Ignore()); // temp
        }
    }
}