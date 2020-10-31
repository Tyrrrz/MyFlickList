using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Api.Database.Migrations
{
    public partial class ExtendProfile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GitHubId",
                table: "Profiles",
                maxLength: 39,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramId",
                table: "Profiles",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Profiles",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterId",
                table: "Profiles",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebsiteUrl",
                table: "Profiles",
                maxLength: 2048,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GitHubId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "InstagramId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "TwitterId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "WebsiteUrl",
                table: "Profiles");
        }
    }
}
