using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.JwtBearer; // New using statement
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens; // New using statement
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Services; // New using statement
using System.Text; // New using statement

var builder = WebApplication.CreateBuilder(args);

// --- START: JWT Configuration Setup ---
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not found.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
// --- END: JWT Configuration Setup ---


builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("TaskDb"));
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();


// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// --- START: Authentication Configuration Update ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.AccessDeniedPath = "/api/auth/denied";

    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
})
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.Authority = "https://accounts.google.com";
    options.ResponseType = OpenIdConnectResponseType.Code;
    options.CallbackPath = "/signin-google";
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;

    options.Scope.Clear();
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => // Added JWT Bearer Scheme
{
    // Configuration for validating JWTs received from other services (optional for this API)
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = signingKey
    };
});
// --- END: Authentication Configuration Update ---

// --- START: Service Registration ---
// 1. Register your custom JWT service for creating tokens
builder.Services.AddScoped<JwtService>();

// 2. Register the ApiClient and configure its HttpClient
builder.Services.AddHttpClient<ApiClient>(client =>
{
    // Set the base address for the API client to call (e.g., another microservice)
    // NOTE: Update this URL to the actual internal API you intend to call.
    client.BaseAddress = new Uri(builder.Configuration["InternalApi:BaseAddress"] ?? "http://localhost:5000/");
});
// --- END: Service Registration ---


builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();