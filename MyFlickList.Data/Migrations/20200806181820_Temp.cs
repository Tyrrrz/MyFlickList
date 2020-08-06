using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Data.Migrations
{
    public partial class Temp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Actors",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Flicks",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Kind = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: false),
                    PremiereDate = table.Column<DateTimeOffset>(nullable: true),
                    FinaleDate = table.Column<DateTimeOffset>(nullable: true),
                    Runtime = table.Column<TimeSpan>(nullable: true),
                    EpisodeCount = table.Column<int>(nullable: true),
                    ExternalRating = table.Column<double>(nullable: true),
                    Synopsis = table.Column<string>(nullable: true),
                    ImageId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flicks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Data = table.Column<byte[]>(nullable: false),
                    ContentType = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    FlickId = table.Column<string>(nullable: false),
                    ActorId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Characters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Characters_Actors_ActorId",
                        column: x => x.ActorId,
                        principalTable: "Actors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Characters_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExternalResources",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Kind = table.Column<int>(nullable: false),
                    Url = table.Column<string>(nullable: false),
                    FlickId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalResources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExternalResources_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListedFlickEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListedFlickEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListedFlickEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagLinks",
                columns: table => new
                {
                    FlickId = table.Column<string>(nullable: false),
                    TagName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagLinks", x => new { x.FlickId, x.TagName });
                    table.ForeignKey(
                        name: "FK_TagLinks_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagLinks_Tags_TagName",
                        column: x => x.TagName,
                        principalTable: "Tags",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Characters_ActorId",
                table: "Characters",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_FlickId",
                table: "Characters",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalResources_FlickId",
                table: "ExternalResources",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_ListedFlickEntity_FlickId",
                table: "ListedFlickEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_TagLinks_TagName",
                table: "TagLinks",
                column: "TagName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Characters");

            migrationBuilder.DropTable(
                name: "ExternalResources");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "ListedFlickEntity");

            migrationBuilder.DropTable(
                name: "TagLinks");

            migrationBuilder.DropTable(
                name: "Actors");

            migrationBuilder.DropTable(
                name: "Flicks");

            migrationBuilder.DropTable(
                name: "Tags");
        }
    }
}
