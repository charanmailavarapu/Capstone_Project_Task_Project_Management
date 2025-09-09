using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Task_Product_Management.Api.Data;
using Task_Product_Management.Api.Hubs;
using Task_Product_Management.Api.Models;
using Task_Product_Management.Api.Services;
using Task_Product_Management.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var cfg = builder.Configuration;

// Add controllers with custom JSON options
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = null;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Enable SignalR for real-time communication
builder.Services.AddSignalR();

// Add Swagger with JWT authentication support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TPM API", Version = "v1" });

    // Define JWT security scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter: Bearer {your token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    // Apply JWT requirement globally
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
            Array.Empty<string>()
        }
    });
});

// Configure allowed CORS origins
var allowedOrigins =
    cfg.GetSection("Cors:AllowedOrigins").Get<string[]>() ??
    new[]
    {
        "http://localhost:3000",
        "https://localhost:3000",
        "http://127.0.0.1:3000",
        "https://127.0.0.1:3000",
        "http://localhost:5173",
        "https://localhost:5173",
        "http://127.0.0.1:5173",
        "https://127.0.0.1:5173"
    };

const string DevCorsPolicy = "DevCors";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(DevCorsPolicy, policy =>
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

// Configure EF Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(cfg.GetConnectionString("TaskConnection")));

// Register application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Configure JWT authentication
var key = cfg["Jwt:Key"] ?? "CHANGE_THIS_IN_PROD_32+CHARS";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = cfg["Jwt:Issuer"] ?? "tpm.local",
            ValidAudience = cfg["Jwt:Audience"] ?? "tpm.local",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };

        // Custom JWT event handling
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"[JWT] Auth failed: {ctx.Exception.Message}");
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                Console.WriteLine($"[JWT] Challenge: {ctx.Error} - {ctx.ErrorDescription}");
                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                // Support JWT in SignalR query string
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ViewerOrHigher", p => p.RequireRole("Viewer", "TeamMember", "ProjectManager", "Admin"));
    options.AddPolicy("TeamMemberOrHigher", p => p.RequireRole("TeamMember", "ProjectManager", "Admin"));
    options.AddPolicy("ProjectManagerOrHigher", p => p.RequireRole("ProjectManager", "Admin"));
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
});

var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply middlewares
app.UseCors(DevCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Map controllers and SignalR hub
app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
