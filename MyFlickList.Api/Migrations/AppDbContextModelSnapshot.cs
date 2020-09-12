﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyFlickList.Api;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MyFlickList.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:PostgresExtension:unaccent", ",,")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("MyFlickList.Api.Entities.Auth.UserEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("character varying(256)")
                        .HasMaxLength(256);

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<byte>("Role")
                        .HasColumnType("smallint");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("character varying(48)")
                        .HasMaxLength(48);

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Files.FileEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.HasKey("Id");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Flicks.FlickEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int?>("CoverImageId")
                        .HasColumnType("integer");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("EpisodeCount")
                        .HasColumnType("integer");

                    b.Property<double?>("ExternalRating")
                        .HasColumnType("double precision");

                    b.Property<DateTimeOffset?>("FinaleDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ImdbId")
                        .IsRequired()
                        .HasColumnType("character varying(9)")
                        .HasMaxLength(9);

                    b.Property<byte>("Kind")
                        .HasColumnType("smallint");

                    b.Property<string>("OriginalTitle")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset?>("PremiereDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<TimeSpan?>("Runtime")
                        .HasColumnType("interval");

                    b.Property<string>("Synopsis")
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ImdbId")
                        .IsUnique();

                    b.ToTable("Flicks");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Flicks.FlickExternalLinkEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("FlickId")
                        .HasColumnType("integer");

                    b.Property<byte>("Kind")
                        .HasColumnType("smallint");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("character varying(2048)")
                        .HasMaxLength(2048);

                    b.HasKey("Id");

                    b.HasIndex("FlickId", "Url")
                        .IsUnique();

                    b.ToTable("FlickExternalLinks");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Flicks.FlickTagEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("FlickId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("FlickId", "Name")
                        .IsUnique();

                    b.ToTable("FlickTags");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Profiles.ProfileEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int?>("AvatarImageId")
                        .HasColumnType("integer");

                    b.Property<string>("Bio")
                        .HasColumnType("text");

                    b.Property<string>("GitHubId")
                        .HasColumnType("character varying(39)")
                        .HasMaxLength(39);

                    b.Property<string>("InstagramId")
                        .HasColumnType("character varying(30)")
                        .HasMaxLength(30);

                    b.Property<bool>("IsPublic")
                        .HasColumnType("boolean");

                    b.Property<string>("Location")
                        .HasColumnType("text");

                    b.Property<string>("TwitterId")
                        .HasColumnType("character varying(15)")
                        .HasMaxLength(15);

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<string>("WebsiteUrl")
                        .HasColumnType("character varying(2048)")
                        .HasMaxLength(2048);

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Profiles");
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Flicks.FlickExternalLinkEntity", b =>
                {
                    b.HasOne("MyFlickList.Api.Entities.Flicks.FlickEntity", "Flick")
                        .WithMany("ExternalLinks")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Flicks.FlickTagEntity", b =>
                {
                    b.HasOne("MyFlickList.Api.Entities.Flicks.FlickEntity", "Flick")
                        .WithMany("Tags")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Api.Entities.Profiles.ProfileEntity", b =>
                {
                    b.HasOne("MyFlickList.Api.Entities.Auth.UserEntity", "User")
                        .WithOne("Profile")
                        .HasForeignKey("MyFlickList.Api.Entities.Profiles.ProfileEntity", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
