using AutoMapper;
using MyFlickList.Api.Responses.Catalog;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Api.Models
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<FlickEntity, FlickResponse>();
        }
    }
}