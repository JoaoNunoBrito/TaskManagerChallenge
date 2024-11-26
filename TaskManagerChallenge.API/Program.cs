using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TaskManagerChallenge.Data;
using TaskManagerChallenge.Models;

var builder = WebApplication.CreateBuilder(args);

// SQLite Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers Configuration
builder.Services.AddControllers();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Bearer Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SecretKeyThatShouldNotBeHereNotInGitHub")),
            ValidIssuer = "Me",
            ValidAudience = "MyselfAndI"
        };
    });

// Swagger/OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Automatically apply migrations during application startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();

    // Seed data
    if (!dbContext.Tasks.Any())
    {
        dbContext.Tasks.AddRange(
            new TaskModel { Title = "Initial Task 1", Description = "Description 1", DueDate = DateTime.Now.AddDays(7), IsCompleted = false },
            new TaskModel { Title = "Initial Task 2", Description = "Description 2", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 3", Description = "Description 3", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 4", Description = "Description 4", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 5", Description = "Description 5", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 6", Description = "Description 6", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 7", Description = "Description 7", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 8", Description = "Description 8", DueDate = DateTime.Now.AddDays(14), IsCompleted = true },
            new TaskModel { Title = "Initial Task 9", Description = "Description 9", DueDate = DateTime.Now.AddDays(14), IsCompleted = true }
        );

        dbContext.Users.AddRange(
            new UserModel { Email = "admin@email.com", Password = "password", FullName = "Alice Administrator", Role = "Administrator", CreatedAt = DateTime.Now },
            new UserModel { Email = "user@email.com", Password = "password", FullName = "Bob User", Role = "User", CreatedAt = DateTime.Now }
        );

        dbContext.SaveChanges();
    }
}

app.UseCors("AllowAnyOrigin");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
