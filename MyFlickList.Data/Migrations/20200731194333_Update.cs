using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Data.Migrations
{
    public partial class Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlickCharacterEntity");

            migrationBuilder.DropTable(
                name: "FlickLinkEntity");

            migrationBuilder.DropTable(
                name: "FlickMemberEntity");

            migrationBuilder.AddColumn<string>(
                name: "Synopsis",
                table: "Flicks",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TagEntityId",
                table: "Flicks",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActorEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActorEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExternalResourceEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<Guid>(nullable: false),
                    Kind = table.Column<int>(nullable: false),
                    Url = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalResourceEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExternalResourceEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CharacterEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FlickId = table.Column<Guid>(nullable: false),
                    ActorId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CharacterEntity_ActorEntity_ActorId",
                        column: x => x.ActorId,
                        principalTable: "ActorEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CharacterEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagLinkEntity",
                columns: table => new
                {
                    FlickId = table.Column<Guid>(nullable: false),
                    TagId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagLinkEntity", x => new { x.FlickId, x.TagId });
                    table.ForeignKey(
                        name: "FK_TagLinkEntity_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagLinkEntity_TagEntity_TagId",
                        column: x => x.TagId,
                        principalTable: "TagEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Flicks_TagEntityId",
                table: "Flicks",
                column: "TagEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterEntity_ActorId",
                table: "CharacterEntity",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterEntity_FlickId",
                table: "CharacterEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalResourceEntity_FlickId",
                table: "ExternalResourceEntity",
                column: "FlickId");

            migrationBuilder.CreateIndex(
                name: "IX_TagLinkEntity_TagId",
                table: "TagLinkEntity",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flicks_TagEntity_TagEntityId",
                table: "Flicks",
                column: "TagEntityId",
                principalTable: "TagEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flicks_TagEntity_TagEntityId",
                table: "Flicks");

            migrationBuilder.DropTable(
                name: "CharacterEntity");

            migrationBuilder.DropTable(
                name: "ExternalResourceEntity");

            migrationBuilder.DropTable(
                name: "TagLinkEntity");

            migrationBuilder.DropTable(
                name: "ActorEntity");

            migrationBuilder.DropTable(
                name: "TagEntity");

            migrationBuilder.DropIndex(
                name: "IX_Flicks_TagEntityId",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "Synopsis",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "TagEntityId",
                table: "Flicks");

            migrationBuilder.CreateTable(
                name: "FlickLinkEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FlickId = table.Column<Guid>(type: "uuid", nullable: false),
                    Kind = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false)
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
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FlickId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
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
                name: "FlickCharacterEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ActorId = table.Column<Guid>(type: "uuid", nullable: false),
                    FlickId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
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
        }
    }
}
