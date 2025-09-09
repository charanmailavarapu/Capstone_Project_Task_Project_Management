using Task_Product_Management.Api.DTOs.Notification;
namespace Task_Product_Management.Api.Services.Interfaces;
public interface INotificationService
{
    Task TriggerAsync(NotificationTriggerDto dto);
}
