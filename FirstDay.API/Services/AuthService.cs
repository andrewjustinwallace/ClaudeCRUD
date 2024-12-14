using FirstDay.API.DTOs;
using Dapper;
using Npgsql;
using System.Data;

namespace FirstDay.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<LoginResponseDTO> AuthenticateUser(LoginRequestDTO request)
        {
            using var connection = new NpgsqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));

            var authResult = await connection.QueryFirstOrDefaultAsync<LoginResponseDTO>(
                @"SELECT 
                    authenticated, 
                    employeeid as EmployeeId,
                    firstname as FirstName,
                    lastname as LastName,
                    usertype as UserType
                FROM test.get_authenticated_user(@Username, @Password)",
                new { Username = request.Username, Password = request.Password });

            if (authResult != null && authResult.Authenticated)
            {
                var companies = await connection.QueryAsync<CompanyDTO>(
                    @"SELECT 
                        companyid as CompanyId,
                        companyname as CompanyName
                    FROM test.get_employee_companies(@EmployeeId)",
                    new { EmployeeId = authResult.EmployeeId });

                authResult.Companies = companies.ToList();
            }

            return authResult;
        }
    }

    public interface IAuthService
    {
        Task<LoginResponseDTO> AuthenticateUser(LoginRequestDTO request);
    }
}