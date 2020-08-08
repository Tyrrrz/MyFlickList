using System;

namespace MyFlickList.Api.Exceptions
{
    public class ConfigurationException : Exception
    {
        public ConfigurationException(string message)
            : base(message)
        {
        }
    }
}