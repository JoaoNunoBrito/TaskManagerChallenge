using System.ComponentModel.DataAnnotations;

namespace TaskManagerChallenge.DTOs.Auth
{
    public class LoginDTO
    {
        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}
