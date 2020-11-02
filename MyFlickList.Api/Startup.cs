using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyFlickList.Api.Database;
using MyFlickList.Api.Endpoints;
using MyFlickList.Api.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NSwag;
using NSwag.Generation.Processors.Security;

namespace MyFlickList.Api
{
    public class Startup
    {
        private const string ApplicationTitle = "MyFlickList API";

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) =>
            Configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            // Database
            services.AddDbContextPool<DatabaseContext>(o =>
            {
                o.UseNpgsql(Configuration.GetDatabaseConnectionString());
                o.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }, 20);

            // Infrastructure
            services.AddOpenApiDocument(o =>
            {
                o.Title = ApplicationTitle;
                o.RequireParametersWithoutDefault = true;

                o.AddSecurity("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Type = OpenApiSecuritySchemeType.ApiKey
                });

                o.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
            });

            services.AddHealthChecks().AddDbContextCheck<DatabaseContext>();
            services.AddAutoMapper(o => o.AddMaps(typeof(Startup).Assembly));
            services.AddHttpClient();

            // Request pipeline
            services.AddCors();
            services.AddResponseCaching();
            services.AddResponseCompression();

            services.AddControllers(o =>
            {
                o.ModelMetadataDetailsProviders.Add(new RequiredBindingMetadataProvider());
            }).AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.Converters.Add(new StringEnumConverter());
                o.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });

            // Auth
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = Configuration.GetJwtRequireHttps();
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = Configuration.GetJwtIssuer(),
                    ValidateAudience = true,
                    ValidAudience = Configuration.GetJwtIssuer(),
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Configuration.GetJwtSecret())
                };
            });

            services.AddAuthorization(o =>
            {
                o.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();
            app.UseCors(o =>
            {
                o.WithOrigins(Configuration.GetAllowedOrigins());
                o.AllowAnyHeader();
                o.AllowAnyMethod();
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseResponseCaching();
            app.UseResponseCompression();

            app.UseEndpoints(o =>
            {
                o.MapControllers();
                o.MapHealthChecks("/health");
            });

            app.UseOpenApi();
            app.UseSwaggerUi3(o => o.DocumentTitle = ApplicationTitle);
        }
    }
}