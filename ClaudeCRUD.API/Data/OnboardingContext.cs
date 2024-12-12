using Microsoft.EntityFrameworkCore;
using ClaudeCRUD.API.Models;

namespace ClaudeCRUD.API.Data;

public class OnboardingContext : DbContext
{
    public OnboardingContext(DbContextOptions<OnboardingContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; }
    public DbSet<ITEmployee> ITEmployees { get; set; }
    public DbSet<NewHire> NewHires { get; set; }
    public DbSet<SetupType> SetupTypes { get; set; }
    public DbSet<ITSetupTask> ITSetupTasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Set default schema
        modelBuilder.HasDefaultSchema("test");

        // Configure lowercase table names
        modelBuilder.Entity<Company>().ToTable("companies");
        modelBuilder.Entity<ITEmployee>().ToTable("itemployees");
        modelBuilder.Entity<NewHire>().ToTable("newhires");
        modelBuilder.Entity<SetupType>().ToTable("setuptypes");
        modelBuilder.Entity<ITSetupTask>().ToTable("itsettasks");
    }
}