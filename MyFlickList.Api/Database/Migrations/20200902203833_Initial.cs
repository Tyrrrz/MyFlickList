using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MyFlickList.Api.Database.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:unaccent", ",,");

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Data = table.Column<byte[]>(nullable: false),
                    ContentType = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Flicks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Kind = table.Column<byte>(nullable: false),
                    ImdbId = table.Column<string>(maxLength: 9, nullable: false),
                    Title = table.Column<string>(nullable: false),
                    OriginalTitle = table.Column<string>(nullable: true),
                    PremiereDate = table.Column<DateTimeOffset>(nullable: true),
                    FinaleDate = table.Column<DateTimeOffset>(nullable: true),
                    EpisodeCount = table.Column<int>(nullable: true),
                    Runtime = table.Column<TimeSpan>(nullable: true),
                    ExternalRating = table.Column<double>(nullable: true),
                    Synopsis = table.Column<string>(nullable: true),
                    Created = table.Column<DateTimeOffset>(nullable: false),
                    CoverImageId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flicks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(maxLength: 48, nullable: false),
                    Email = table.Column<string>(maxLength: 256, nullable: false),
                    IsEmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<byte[]>(nullable: false),
                    Created = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FlickExternalLinks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Kind = table.Column<byte>(nullable: false),
                    Url = table.Column<string>(maxLength: 2048, nullable: false),
                    FlickId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickExternalLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlickExternalLinks_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FlickTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: false),
                    FlickId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlickTags_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(maxLength: 48, nullable: false),
                    IsPublic = table.Column<bool>(nullable: false),
                    Bio = table.Column<string>(nullable: true),
                    AvatarImageId = table.Column<int>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlickExternalLinks_FlickId_Url",
                table: "FlickExternalLinks",
                columns: new[] { "FlickId", "Url" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Flicks_ImdbId",
                table: "Flicks",
                column: "ImdbId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FlickTags_FlickId_Name",
                table: "FlickTags",
                columns: new[] { "FlickId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "FlickExternalLinks");

            migrationBuilder.DropTable(
                name: "FlickTags");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.DropTable(
                name: "Flicks");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
