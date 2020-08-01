using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
            throw new InvalidOperationException("Database connection string not set.");

        private string[] GetAllowedOrigins() =>
            Configuration.GetSection("AllowedOrigins").Get<string[]?>() ??
            throw new InvalidOperationException("Allowed origins not set.");

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContextPool<AppDbContext>(o => o.UseNpgsql(GetDatabaseConnectionString()));

            services.AddControllers().AddNewtonsoftJson();
            services.AddOpenApiDocument();

            services.AddCors();
            services.AddResponseCaching();
            services.AddResponseCompression();
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
            app.UseEndpoints(e => e.MapControllers());
            app.UseOpenApi();
            app.UseSwaggerUi3();
        }
    }
}