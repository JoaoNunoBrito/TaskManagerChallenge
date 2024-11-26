using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerChallenge.Models
{
    public class TaskModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required DateTime DueDate { get; set; }

        public string? Description { get; set; }

        public bool? IsCompleted { get; set; }
    }
}
