using AutoMapper;
using MyFlickList.Api.Entities.Catalog;
using MyFlickList.Api.Models.Catalog;

namespace MyFlickList.Api.Models
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<FlickEntity, FlickListingResponse>();
            CreateMap<FlickEntity, FlickResponse>();
        }
    }
}