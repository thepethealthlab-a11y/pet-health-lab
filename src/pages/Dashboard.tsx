import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, FileText, Heart, Bell, Settings } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your pet health overview.</p>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Being tracked</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Total entries</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Reminders</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pets">My Pets</TabsTrigger>
              <TabsTrigger value="records">Health Records</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest health tracking entries and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { pet: "Max", action: "Symptom logged", time: "2 hours ago", icon: Activity },
                    { pet: "Luna", action: "Medication administered", time: "5 hours ago", icon: Heart },
                    { pet: "Max", action: "Vet appointment scheduled", time: "1 day ago", icon: Calendar },
                    { pet: "Luna", action: "Health record updated", time: "2 days ago", icon: FileText }
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
                  <CardTitle>Upcoming Reminders</CardTitle>
                  <CardDescription>Don't miss these important dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { pet: "Max", event: "Annual checkup", date: "Mar 25, 2024" },
                    { pet: "Luna", event: "Vaccination due", date: "Mar 28, 2024" },
                    { pet: "Max", event: "Medication refill", date: "Apr 2, 2024" }
                  ].map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {reminder.pet.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reminder.pet}</p>
                          <p className="text-sm text-muted-foreground">{reminder.event}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{reminder.date}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pets">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Max", breed: "Golden Retriever", age: "3 years", status: "Healthy" },
                  { name: "Luna", breed: "Siamese Cat", age: "2 years", status: "Monitoring" }
                ].map((pet, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                            {pet.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{pet.name}</CardTitle>
                          <CardDescription>{pet.breed} • {pet.age}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <span className="text-sm font-medium">{pet.status}</span>
                        </div>
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <CardTitle>Health Records</CardTitle>
                  <CardDescription>All health tracking entries for your pets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Health records feature coming soon. Track symptoms, medications, and more.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Reminders</CardTitle>
                  <CardDescription>Set up and manage reminders for your pets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Reminder management feature coming soon. Never miss important appointments.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
