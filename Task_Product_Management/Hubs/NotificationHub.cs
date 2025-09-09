using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Task_Product_Management.Api.Hubs;

[Authorize]
public class NotificationHub : Hub { }
