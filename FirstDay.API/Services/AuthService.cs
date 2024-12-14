using Dapper;
using FirstDay.API.DTOs;
using Npgsql;

namespace FirstDay.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDTO?> AuthenticateUser(LoginRequestDTO loginRequest);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<LoginResponseDTO?> AuthenticateUser(LoginRequestDTO loginRequest)
        {
            using var connection = new NpgsqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            
            var sql = @"SELECT * FROM test.authenticate_user(@Username, @Password)";
            
            var result = await connection.QueryFirstOrDefaultAsync<LoginResponseDTO>(
                sql,
                new { Username = loginRequest.Username, Password = loginRequest.Password }
            );

            return result;
        }
    }
}