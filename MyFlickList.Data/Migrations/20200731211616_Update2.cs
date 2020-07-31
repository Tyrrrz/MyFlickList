using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Data.Migrations
{
    public partial class Update2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flicks_TagEntity_TagEntityId",
                table: "Flicks");

            migrationBuilder.DropIndex(
                name: "IX_Flicks_TagEntityId",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "TagEntityId",
                table: "Flicks");

            migrationBuilder.AddColumn<Guid>(
                name: "ImageId",
                table: "Flicks",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ImdbId",
                table: "Flicks",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ImageEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Data = table.Column<byte[]>(type: "blob", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageEntity", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Flicks_ImageId",
                table: "Flicks",
                column: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flicks_ImageEntity_ImageId",
                table: "Flicks",
                column: "ImageId",
                principalTable: "ImageEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flicks_ImageEntity_ImageId",
                table: "Flicks");

            migrationBuilder.DropTable(
                name: "ImageEntity");

            migrationBuilder.DropIndex(
                name: "IX_Flicks_ImageId",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Flicks");

            migrationBuilder.DropColumn(
                name: "ImdbId",
                table: "Flicks");

            migrationBuilder.AddColumn<Guid>(
                name: "TagEntityId",
                table: "Flicks",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Flicks_TagEntityId",
                table: "Flicks",
                column: "TagEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flicks_TagEntity_TagEntityId",
                table: "Flicks",
                column: "TagEntityId",
                principalTable: "TagEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
