using Microsoft.EntityFrameworkCore.Migrations;

namespace MyFlickList.Api.Database.Migrations
{
    public partial class AddStaticUserRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Profiles");

            migrationBuilder.AddColumn<byte>(
                name: "Role",
                table: "Users",
                nullable: false,
                defaultValue: (byte)0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Profiles",
                type: "character varying(48)",
                maxLength: 48,
                nullable: false,
                defaultValue: "");
        }
    }
}
