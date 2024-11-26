using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerChallenge.Data;
using TaskManagerChallenge.DTOs.Task;
using TaskManagerChallenge.Models;

namespace TaskManagerChallenge.Controllers1
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _appDbContext;
        public TasksController(ApplicationDbContext AppDbContext)
        {
            _appDbContext = AppDbContext;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskModel>>> GetTasksAsync()
        {
            if (_appDbContext.Tasks == null)
            {
                return NotFound();
            }

            return await _appDbContext.Tasks.ToListAsync();
        }

        // GET api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskModel>> GetTask(Guid id)
        {
            if (_appDbContext.Tasks is null)
            {
                return NotFound();
            }

            var task = await _appDbContext.Tasks.FindAsync(id);
            if (task is null)
            {
                return NotFound();
            }

            return task;
        }

        // POST api/tasks
        [HttpPost]
        public async Task<ActionResult> CreateTask(CreateTaskDTO taskDTO)
        {
            var taskEntity = new TaskModel
            {
                Title = taskDTO.Title,
                Description = taskDTO.Description,
                DueDate = taskDTO.DueDate,
                IsCompleted = taskDTO.IsCompleted
            };

            _appDbContext.Tasks.Add(taskEntity);
            await _appDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTask), new { id = taskEntity.Id }, taskEntity);
        }

        // PUT api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(Guid id, UpdateTaskDTO taskDTO)
        {
            var existingTask = await _appDbContext.Tasks.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Title = taskDTO.Title;
            existingTask.Description = taskDTO.Description;
            existingTask.DueDate = taskDTO.DueDate;
            existingTask.IsCompleted = taskDTO.IsCompleted;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            if (_appDbContext.Tasks is null)
            {
                return NotFound();
            }

            var task = await _appDbContext.Tasks.FindAsync(id);
            if (task is null)
            {
                return NotFound();
            }

            _appDbContext.Tasks.Remove(task);
            await _appDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
