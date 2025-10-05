import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  PawPrint, 
  BarChart3, 
  CreditCard, 
  FileText, 
  Bell, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Activity,
  TrendingUp,
  Download,
  Menu
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname + (location.hash || '');
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Pets", url: "/dashboard#pets", icon: PawPrint },
    { title: "Statistics", url: "/dashboard#stats", icon: BarChart3 },
    { title: "Subscription", url: "/dashboard#subscription", icon: CreditCard },
    { title: "Reports & History", url: "/dashboard#reports", icon: FileText },
    { title: "Notifications", url: "/dashboard#notifications", icon: Bell },
    { title: "Settings", url: "/dashboard#settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const location = useLocation();

  // Update active section based on hash
  useState(() => {
    const hash = location.hash.replace('#', '');
    if (hash) setActiveSection(hash);
  });

  const pets = [
    { id: 1, name: "Max", breed: "Golden Retriever", age: "3 years", weight: "32 kg", status: "Healthy" },
    { id: 2, name: "Luna", breed: "Siamese Cat", age: "2 years", weight: "4 kg", status: "Monitoring" }
  ];

  const toolUsageStats = [
    { name: "Symptom Checker", usage: 45, total: 50, percentage: 90 },
    { name: "Vaccination Tracker", usage: 12, total: 20, percentage: 60 },
    { name: "Nutrition Calculator", usage: 30, total: 40, percentage: 75 },
    { name: "Weight Monitor", usage: 25, total: 30, percentage: 83 }
  ];

  const savedReports = [
    { id: 1, title: "Max - Annual Health Report 2024", date: "2024-10-01", type: "Health" },
    { id: 2, title: "Luna - Symptom Analysis", date: "2024-09-28", type: "Symptom" },
    { id: 3, title: "Max - Vaccination Records", date: "2024-09-15", type: "Vaccination" },
    { id: 4, title: "Luna - Weight Tracking Report", date: "2024-09-10", type: "Weight" }
  ];

  const notifications = [
    { id: 1, title: "Max's vaccination due", message: "Annual vaccination coming up on Oct 25", time: "2 hours ago", read: false },
    { id: 2, title: "Luna's weight update", message: "Time to log Luna's weekly weight", time: "1 day ago", read: false },
    { id: 3, title: "Premium feature unlocked", message: "You now have access to AI health insights", time: "3 days ago", read: true }
  ];

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's your pet health overview</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">Being tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedReports.length}</div>
            <p className="text-xs text-muted-foreground">Saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest health tracking updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { pet: "Max", action: "Symptom logged", time: "2 hours ago", icon: Activity },
              { pet: "Luna", action: "Weight recorded", time: "5 hours ago", icon: TrendingUp },
              { pet: "Max", action: "Vet appointment scheduled", time: "1 day ago", icon: Calendar }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <activity.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.pet}: {activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Pet
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Log Symptom
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">My Pets</h2>
          <p className="text-muted-foreground">Manage your pet profiles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Pet
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {pet.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </div>
                </div>
                <Badge variant={pet.status === "Healthy" ? "default" : "secondary"}>
                  {pet.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{pet.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{pet.weight}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Pet</CardTitle>
          <CardDescription>Create a profile for your new companion</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name</Label>
                <Input id="petName" placeholder="Enter pet name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" placeholder="Enter breed" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" placeholder="e.g., 3 years" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" placeholder="e.g., 25 kg" />
              </div>
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Tool Usage Statistics</h2>
        <p className="text-muted-foreground">Track your tool usage and limits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage Overview</CardTitle>
          <CardDescription>Your tool usage this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {toolUsageStats.map((tool, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{tool.name}</span>
                <span className="text-sm text-muted-foreground">
                  {tool.usage} / {tool.total}
                </span>
              </div>
              <Progress value={tool.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{tool.percentage}% used</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Most Used Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Symptom Checker</p>
            <p className="text-sm text-muted-foreground">45 uses this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tool Uses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">112</p>
            <p className="text-sm text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">88</p>
            <p className="text-sm text-muted-foreground">Renews in 15 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Subscription Status</h2>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Premium Plan</CardTitle>
              <CardDescription>All features unlocked</CardDescription>
            </div>
            <Badge className="text-lg px-4 py-2">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Plan Price</p>
              <p className="text-3xl font-bold">$8.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Next Billing Date</p>
              <p className="text-xl font-semibold">November 5, 2025</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Your Premium Features</h4>
            <ul className="space-y-2">
              {[
                "All 14 Tools Unlimited",
                "Advanced AI Features",
                "Priority Support",
                "5 Pet Profiles",
                "Comprehensive Reports",
                "Ad-free Experience"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">Change Plan</Button>
            <Button variant="outline" className="flex-1">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Oct 5, 2025", amount: "$8.99", status: "Paid" },
              { date: "Sep 5, 2025", amount: "$8.99", status: "Paid" },
              { date: "Aug 5, 2025", amount: "$8.99", status: "Paid" }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium">{transaction.date}</p>
                  <p className="text-sm text-muted-foreground">Premium subscription</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{transaction.amount}</p>
                  <Badge variant="outline">{transaction.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Reports & History</h2>
          <p className="text-muted-foreground">Access your saved reports and data</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>All your generated health reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with important alerts</p>
        </div>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{notification.title}</CardTitle>
                    <CardDescription>{notification.message}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
                {!notification.read && (
                  <Badge>New</Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings & Preferences</h2>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what updates you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Email notifications", description: "Receive email updates about your pets" },
            { title: "Vaccination reminders", description: "Get notified about upcoming vaccinations" },
            { title: "Health alerts", description: "Important health updates and insights" },
            { title: "Marketing emails", description: "News and special offers" }
          ].map((pref, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">{pref.title}</p>
                <p className="text-sm text-muted-foreground">{pref.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>Manage your data and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    const hash = location.hash.replace('#', '') || 'overview';
    switch (hash) {
      case 'pets': return renderPets();
      case 'stats': return renderStats();
      case 'subscription': return renderSubscription();
      case 'reports': return renderReports();
      case 'notifications': return renderNotifications();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-6 gap-4 sticky top-0 z-10">
            <SidebarTrigger className="lg:hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">ThePetHealthLab Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
          </header>

          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
