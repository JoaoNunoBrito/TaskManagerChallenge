using System.ComponentModel.DataAnnotations;

namespace TaskManagerChallenge.DTOs.Task
{
    public class TaskDTO
    {
        [Required]
        public required Guid Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required DateTime DueDate { get; set; }

        public string? Description { get; set; }

        public bool? IsCompleted { get; set; }
    }
}
