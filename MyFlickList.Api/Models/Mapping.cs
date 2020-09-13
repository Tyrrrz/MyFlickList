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

            CreateMap<ProfileEntity, ProfileListingResponse>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username));

            CreateMap<ProfileEntity, ProfileResponse>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username))
                .ForMember(o => o.Role, x => x.MapFrom(o => o.User!.Role))
                .ForMember(o => o.FavoriteFlicks, x => x.Ignore()); // TODO
        }
    }
}