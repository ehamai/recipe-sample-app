using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RecipeApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? returnUrl = null)
    {
        // In development, redirect back to the Vite dev server
        var redirectUri = returnUrl ?? (
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" 
                ? "http://localhost:5173" 
                : "/"
        );
        
        var properties = new AuthenticationProperties
        {
            RedirectUri = redirectUri
        };
        return Challenge(properties, "GitHub");
    }

    [HttpGet("user")]
    public IActionResult GetUser()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            Id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Login = User.FindFirstValue("urn:github:login") ?? User.FindFirstValue(ClaimTypes.Name),
            Name = User.FindFirstValue(ClaimTypes.Name),
            AvatarUrl = User.FindFirstValue("urn:github:avatar")
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }
}
