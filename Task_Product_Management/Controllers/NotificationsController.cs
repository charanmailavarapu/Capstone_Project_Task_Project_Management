using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_Product_Management.Api.DTOs.Notification;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "TeamMemberOrHigher")]
public class NotificationsController(INotificationService svc) : ControllerBase
{
    private readonly INotificationService _svc = svc;

    [HttpPost]
    public async Task<IActionResult> Trigger(NotificationTriggerDto dto)
    {
        await _svc.TriggerAsync(dto);
        return Accepted();
    }

}
