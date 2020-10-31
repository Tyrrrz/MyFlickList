using AutoMapper;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Database.Profiles;
using MyFlickList.Api.Transport.Models.Flicks;
using MyFlickList.Api.Transport.Models.Profiles;

namespace MyFlickList.Api.Transport.Models
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<FlickEntity, FlickListingResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.Tags));

            CreateMap<FlickEntity, FlickResponse>()
                .ForMember(o => o.Tags, x => x.MapFrom(o => o.Tags));

            CreateMap<ProfileEntity, ProfileListingResponse>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username));

            CreateMap<ProfileEntity, ProfileResponse>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username))
                .ForMember(o => o.Role, x => x.MapFrom(o => o.User!.Role));

            CreateMap<ProfileFlickEntryEntity, ProfileFlickEntryResponse>()
                .ForMember(o => o.FlickTitle, x => x.MapFrom(o => o.Flick!.Title))
                .ForMember(o => o.FlickCoverImageId, x => x.MapFrom(o => o.Flick!.CoverImageId));
        }
    }
}