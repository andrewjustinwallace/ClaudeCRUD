using Microsoft.EntityFrameworkCore;
using FirstDay.Admin.API.Models;

namespace FirstDay.Admin.API.Data;

public class FirstDayContext : DbContext
{
    public FirstDayContext(DbContextOptions<FirstDayContext> options) : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<ITEmployee> ITEmployees { get; set; } = null!;
    public DbSet<ITSetupTask> ITSetupTasks { get; set; } = null!;
    public DbSet<NewHire> NewHires { get; set; } = null!;
    public DbSet<NewHireProgress> NewHireProgress { get; set; } = null!;
    public DbSet<NewHireSetupStatus> NewHireSetupStatus { get; set; } = null!;
    public DbSet<SetupType> SetupTypes { get; set; } = null!;
    public DbSet<UserType> UserTypes { get; set; } = null!;
    public DbSet<EmployeeCompanyAssignment> EmployeeCompanyAssignments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure ITEmployee
        modelBuilder.Entity<ITEmployee>(entity =>
        {
            entity.HasKey(e => e.ITEmployeeId);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.HireDate).IsRequired();
            entity.Property(e => e.CreatedDate).IsRequired();
            entity.Property(e => e.ModifiedDate).IsRequired();

            entity.HasOne(e => e.UserType)
                .WithMany()
                .HasForeignKey(e => e.UserTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure EmployeeCompanyAssignment
        modelBuilder.Entity<EmployeeCompanyAssignment>(entity =>
        {
            entity.HasKey(e => e.EmployeeCompanyAssignmentId);
            entity.Property(e => e.CreatedDate).IsRequired();
            entity.Property(e => e.ModifiedDate).IsRequired();

            entity.HasOne(e => e.ITEmployee)
                .WithMany(e => e.CompanyAssignments)
                .HasForeignKey(e => e.ITEmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Company)
                .WithMany()
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}