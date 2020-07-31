﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyFlickList.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MyFlickList.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.ActorEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ActorEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.CharacterEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ActorId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("FlickId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ActorId");

                    b.HasIndex("FlickId");

                    b.ToTable("CharacterEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.ExternalResourceEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("FlickId")
                        .HasColumnType("uuid");

                    b.Property<int>("Kind")
                        .HasColumnType("integer");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("FlickId");

                    b.ToTable("ExternalResourceEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.FlickEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int?>("EpisodeCount")
                        .HasColumnType("integer");

                    b.Property<Guid>("ImageId")
                        .HasColumnType("uuid");

                    b.Property<string>("ImdbId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Kind")
                        .HasColumnType("integer");

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

                    b.HasIndex("ImageId");

                    b.ToTable("Flicks");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.ImageEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("blob");

                    b.HasKey("Id");

                    b.ToTable("ImageEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.TagEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("TagEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.TagLinkEntity", b =>
                {
                    b.Property<Guid>("FlickId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("TagId")
                        .HasColumnType("uuid");

                    b.HasKey("FlickId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("TagLinkEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Lists.ListedFlickEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("FlickId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("FlickId");

                    b.ToTable("ListedFlickEntity");
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.CharacterEntity", b =>
                {
                    b.HasOne("MyFlickList.Data.Entities.Catalog.ActorEntity", "Actor")
                        .WithMany("Characters")
                        .HasForeignKey("ActorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MyFlickList.Data.Entities.Catalog.FlickEntity", "Flick")
                        .WithMany("Characters")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.ExternalResourceEntity", b =>
                {
                    b.HasOne("MyFlickList.Data.Entities.Catalog.FlickEntity", "Flick")
                        .WithMany("Resources")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.FlickEntity", b =>
                {
                    b.HasOne("MyFlickList.Data.Entities.Catalog.ImageEntity", "Image")
                        .WithMany()
                        .HasForeignKey("ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Catalog.TagLinkEntity", b =>
                {
                    b.HasOne("MyFlickList.Data.Entities.Catalog.FlickEntity", "Flick")
                        .WithMany("TagLinks")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MyFlickList.Data.Entities.Catalog.TagEntity", "Tag")
                        .WithMany("TagLinks")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyFlickList.Data.Entities.Lists.ListedFlickEntity", b =>
                {
                    b.HasOne("MyFlickList.Data.Entities.Catalog.FlickEntity", "Flick")
                        .WithMany("Listed")
                        .HasForeignKey("FlickId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
