using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace ReactjsMVC.Controllers
{
    public partial class HomeController : Controller
    {
        public ActionResult ReactMvcDemo() => View();

        public string AppUsers() => JsonConvert.SerializeObject(GetUsers(), Formatting.None);

        [HttpPost]
        public string UpdateUser(User editedUser)
        {
            var existingUsers = GetUsers();
            existingUsers.Remove(existingUsers.FirstOrDefault(usr => usr.UserName == editedUser.UserName));
            existingUsers.Add(editedUser);
            return JsonConvert.SerializeObject(existingUsers, Formatting.None);
        }

        private List<User> GetUsers()
        {
            return new List<User>
            {
                    new User { UserName = "Paul@paulhjlogan.com", DisplayName = "Paul", Enabled = false },
                    new User { UserName = "Tara@paulhjlogan.com", DisplayName = "Tara", Enabled = true },
                    new User { UserName = "Xavier@paulhjlogan.com", DisplayName = "Xavier", Enabled = true },
                    new User { UserName = "Ayla@paulhjlogan.com", DisplayName = "Ayla", Enabled = true }
            };
        }
    }
}