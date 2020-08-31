namespace MyFlickList.Domain.Gravatar
{
    public class GravatarImage
    {
        public string Email { get; }

        public byte[] Content { get; }

        public string ContentType { get; }

        public GravatarImage(string email, byte[] content, string contentType)
        {
            Email = email;
            Content = content;
            ContentType = contentType;
        }
    }
}