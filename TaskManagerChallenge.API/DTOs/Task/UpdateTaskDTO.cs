using System.ComponentModel.DataAnnotations;

namespace TaskManagerChallenge.DTOs.Task
{
    public class UpdateTaskDTO
    {
        [Required]
        public required string Title { get; set; }

        [Required]
        public required DateTime DueDate { get; set; }

        public string? Description { get; set; }

        public bool? IsCompleted { get; set; }
    }
}
