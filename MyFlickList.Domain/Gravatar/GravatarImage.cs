namespace MyFlickList.Domain.Gravatar
{
    public class GravatarImage
    {
        public byte[] Data { get; }

        public string ContentType { get; }

        public GravatarImage(byte[] data, string contentType)
        {
            Data = data;
            ContentType = contentType;
        }
    }
}