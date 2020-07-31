using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Flicks",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Kind = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: false),
                    PremiereDate = table.Column<DateTimeOffset>(nullable: true),
                    Runtime = table.Column<TimeSpan>(nullable: true),
                    EpisodeCount = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flicks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FlickLinkEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<Guid>(nullable: false),
                    Kind = table.Column<int>(nullable: false),
                    Url = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickLinkEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlickLinkEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FlickMemberEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Role = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickMemberEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlickMemberEntity_Flicks_FlickId",
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
                    FlickId = table.Column<Guid>(nullable: false)
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
                name: "FlickCharacterEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<Guid>(nullable: false),
                    ActorId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickCharacterEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlickCharacterEntity_FlickMemberEntity_ActorId",
                        column: x => x.ActorId,
                        principalTable: "FlickMemberEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FlickCharacterEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlickCharacterEntity_ActorId",
                table: "FlickCharacterEntity",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_FlickCharacterEntity_FlickId",
                table: "FlickCharacterEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_FlickLinkEntity_FlickId",
                table: "FlickLinkEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_FlickMemberEntity_FlickId",
                table: "FlickMemberEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_ListedFlickEntity_FlickId",
                table: "ListedFlickEntity",
                column: "FlickId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlickCharacterEntity");

            migrationBuilder.DropTable(
                name: "FlickLinkEntity");

            migrationBuilder.DropTable(
                name: "ListedFlickEntity");

            migrationBuilder.DropTable(
                name: "FlickMemberEntity");

            migrationBuilder.DropTable(
                name: "Flicks");
        }
    }
}
