using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MyFlickList.Api.Migrations
{
    public partial class SimplifyDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlickExternalLinks");

            migrationBuilder.DropTable(
                name: "FlickTags");

            migrationBuilder.DropColumn(
                name: "GitHubId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "InstagramId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "TwitterId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "WebsiteUrl",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "FinaleDate",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "PremiereDate",
                table: "Flicks");

            migrationBuilder.AddColumn<string[]>(
                name: "ExternalLinks",
                table: "Profiles",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "ExternalLinks",
                table: "Flicks",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "FirstAired",
                table: "Flicks",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastAired",
                table: "Flicks",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Tags",
                table: "Flicks",
                nullable: false,
                defaultValue: new string[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalLinks",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ExternalLinks",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "FirstAired",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "LastAired",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Flicks");

            migrationBuilder.AddColumn<string>(
                name: "GitHubId",
                table: "Profiles",
                type: "character varying(39)",
                maxLength: 39,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramId",
                table: "Profiles",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterId",
                table: "Profiles",
                type: "character varying(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebsiteUrl",
                table: "Profiles",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "FinaleDate",
                table: "Flicks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PremiereDate",
                table: "Flicks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FlickExternalLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FlickId = table.Column<int>(type: "integer", nullable: false),
                    Kind = table.Column<byte>(type: "smallint", nullable: false),
                    Url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false)
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
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FlickId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_FlickExternalLinks_FlickId_Url",
                table: "FlickExternalLinks",
                columns: new[] { "FlickId", "Url" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FlickTags_FlickId_Name",
                table: "FlickTags",
                columns: new[] { "FlickId", "Name" },
                unique: true);
        }
    }
}
