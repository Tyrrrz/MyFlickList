using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Api.Migrations
{
    public partial class AddTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagLinks");

            migrationBuilder.CreateTable(
                name: "FlickTags",
                columns: table => new
                {
                    FlickId = table.Column<string>(nullable: false),
                    TagName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlickTags", x => new { x.FlickId, x.TagName });
                    table.ForeignKey(
                        name: "FK_FlickTags_Flicks_FlickId",
                        column: x => x.FlickId,
                        principalTable: "Flicks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FlickTags_Tags_TagName",
                        column: x => x.TagName,
                        principalTable: "Tags",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlickTags_TagName",
                table: "FlickTags",
                column: "TagName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlickTags");

            migrationBuilder.CreateTable(
                name: "TagLinks",
                columns: table => new
                {
                    FlickId = table.Column<string>(type: "text", nullable: false),
                    TagName = table.Column<string>(type: "text", nullable: false)
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
                name: "IX_TagLinks_TagName",
                table: "TagLinks",
                column: "TagName");
        }
    }
}
