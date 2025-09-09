using Microsoft.AspNetCore.SignalR;
using Task_Product_Management.Api.DTOs.Notification;
using Task_Product_Management.Api.Hubs;
using Task_Product_Management.Api.Services.Interfaces;

namespace Task_Product_Management.Api.Services;

public class NotificationService(IHubContext<NotificationHub> hub) : INotificationService
{
    private readonly IHubContext<NotificationHub> _hub = hub;

    public async Task TriggerAsync(NotificationTriggerDto dto)
    {

        await _hub.Clients.All.SendAsync("receiveNotification", new { dto.UserId, dto.Message, At = DateTime.UtcNow });
    }
}
