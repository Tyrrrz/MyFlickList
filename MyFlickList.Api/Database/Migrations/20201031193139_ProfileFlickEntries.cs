using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MyFlickList.Api.Database.Migrations
{
    public partial class ProfileFlickEntries : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfileFlickEntries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Created = table.Column<DateTimeOffset>(nullable: false),
                    Updated = table.Column<DateTimeOffset>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    EpisodeCount = table.Column<int>(nullable: true),
                    Rating = table.Column<double>(nullable: true),
                    Review = table.Column<string>(maxLength: 20000, nullable: true),
                    ProfileId = table.Column<int>(nullable: false),
                    FlickId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileFlickEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileFlickEntries_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileFlickEntries_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileFlickEntries_FlickId",
                table: "ProfileFlickEntries",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileFlickEntries_ProfileId",
                table: "ProfileFlickEntries",
                column: "ProfileId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileFlickEntries");
        }
    }
}
