using AutoMapper;
using MyFlickList.Api.Models.Catalog;
using MyFlickList.Data.Entities.Catalog;

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