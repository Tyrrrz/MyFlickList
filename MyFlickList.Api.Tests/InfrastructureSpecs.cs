using AutoMapper;
using Xunit;

namespace MyFlickList.Api.Tests
{
    public class InfrastructureSpecs
    {
        [Fact]
        public void Mapping_should_be_configured_correctly_for_all_models()
        {
            // Arrange
            var mapper = new Mapper(new MapperConfiguration(c => c.AddMaps(typeof(Startup).Assembly)));

            // Act & assert
            mapper.ConfigurationProvider.AssertConfigurationIsValid();
        }
    }
}