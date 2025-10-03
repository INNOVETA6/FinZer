// components/SimpleProfilePage.tsx
import React, { useState } from 'react';
import Header from '@/components/Navbar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Settings,
  Bell,
  Shield,
  Edit3,
  Save,
  Mail,
  Phone,
  MapPin,
  Star,
  Check,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

// Simple form schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional()
});

// Simple types
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  joinDate: Date;
  isVerified: boolean;
  accountType: 'free' | 'premium';
  financialScore: number;
}

const SimpleProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Financial enthusiast learning to build wealth and achieve financial freedom.',
    avatar: '/avatars/john-doe.jpg',
    joinDate: new Date('2024-01-15'),
    isVerified: true,
    accountType: 'premium',
    financialScore: 72
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Simple notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    budgetAlerts: true,
    weeklyReports: false
  });

  // Form setup
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone || '',
      bio: userProfile.bio || ''
    }
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    setUserProfile({ ...userProfile, ...data });
    setIsEditing(false);
    // Add success notification here
  };

  // Get account badge
  const getAccountBadge = () => {
    return userProfile.accountType === 'premium' ? (
      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
        Premium
      </Badge>
    ) : (
      <Badge variant="secondary">Free</Badge>
    );
  };

  return (
    <>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and preferences
          </p>
        </header>

        {/* Profile Card */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={userProfile.avatar} alt={`${userProfile.firstName} ${userProfile.lastName}`} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10">
                    {userProfile.firstName[0]}{userProfile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      {userProfile.firstName} {userProfile.lastName}
                    </h2>
                    {userProfile.isVerified && (
                      <Check className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{userProfile.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    {getAccountBadge()}
                    <Badge variant="outline">
                      Member since {userProfile.joinDate.getFullYear()}
                    </Badge>
                  </div>
                </div>

                {/* Financial Score */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Financial Literacy Score</span>
                    <span className="text-2xl font-bold text-primary">{userProfile.financialScore}/100</span>
                  </div>
                  <Progress value={userProfile.financialScore} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {userProfile.financialScore >= 70 ? 'Great job! Keep learning.' : 'Complete more modules to improve your score.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Update your basic information</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" placeholder="Optional" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Tell us about yourself..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Full Name</Label>
                          <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-muted-foreground">Email</Label>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{userProfile.email}</p>
                            {userProfile.isVerified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {userProfile.phone && (
                          <div>
                            <Label className="text-sm text-muted-foreground">Phone</Label>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{userProfile.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-sm text-muted-foreground">Account Type</Label>
                          <div className="mt-1">
                            {getAccountBadge()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {userProfile.bio && (
                      <div>
                        <Label className="text-sm text-muted-foreground">About Me</Label>
                        <p className="font-medium text-sm leading-relaxed mt-1">{userProfile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Notifications</span>
                  </CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Budget Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify when approaching budget limits</p>
                    </div>
                    <Switch
                      checked={notifications.budgetAlerts}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, budgetAlerts: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly financial summary</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

             
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Password & Security</span>
                  </CardTitle>
                  <CardDescription>Keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed 2 weeks ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Account Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Export My Data
                  </Button>
                  
                  <Separator />
                  
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This action cannot be undone
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        
      </div>
    </div>
    </>
  );
};

export default SimpleProfilePage;
