using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyFlickList.Api.Internal.Extensions;
using MyFlickList.Data;

namespace MyFlickList.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) =>
            Configuration = configuration;

        private string GetDatabaseConnectionString() =>
            Configuration.GetConnectionString("Database") ??
            // The following is set by Heroku directly
            Environment.GetEnvironmentVariable("DATABASE_URL")?.Pipe(PostgresUrl.ToConnectionString!) ??
            throw new InvalidOperationException("Database connection string not set.");

        private string[] GetAllowedOrigins() =>
            Configuration.GetSection("AllowedOrigins").Get<string[]?>() ??
            throw new InvalidOperationException("Allowed origins not set.");

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContextPool<AppDbContext>(o => o.UseNpgsql(GetDatabaseConnectionString()), 20);
            services.AddCors();
            services.AddResponseCaching();
            services.AddResponseCompression();
            services.AddHealthChecks().AddDbContextCheck<AppDbContext>();
            services.AddControllers().AddNewtonsoftJson();
            services.AddOpenApiDocument();
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
            app.UseCors(c => c.WithOrigins(GetAllowedOrigins()));
            app.UseResponseCaching();
            app.UseResponseCompression();
            app.UseAuthorization();

            app.UseEndpoints(e =>
            {
                e.MapControllers();
                e.MapHealthChecks("/health");
            });

            app.UseOpenApi();
            app.UseSwaggerUi3();
        }
    }
}