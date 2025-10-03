import { Button } from "@/components/ui/button";
import {
  Menu,
  Bell,
  Search as SearchIcon,
  School,
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "@/pages/SignUp";


const Header = () => {
  // ============================================================
  // 🔧 AUTHENTICATION SETUP WITH PERSISTENCE
  // ============================================================
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });

  const isLoading = false;

  // Handle login - persists to localStorage
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    // Navigate to dashboard after login
    navigate('/sign-up');
  };

  // Handle logout - removes from localStorage
  const handleLogoutTemp = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  // ============================================================

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Sample search data
  // Sample search data
  const searchData = [
    { id: 1, title: "Budget Planner", type: "career", url: "/budget-planner" },
    { id: 2, title: "Investments", type: "skill", url: "/investments" },
    { id: 3, title: "Resume Builder for Tech Jobs", type: "tool", url: "/resume-builder" },
    { id: 4, title: "Manage the budget", type: "planner", url: "/budget-planner" },
    { id: 5, title: "Investment Recommendations", type: "recommend", url: "/investments" },
    { id: 6, title: "Learning Hub", type: "learning", url: "/learning-hub" },
    { id: 7, title: "Dashboard Overview", type: "page", url: "/dashboard" },
    { id: 8, title: "Product Management Career", type: "career", url: "/career-paths/product-management" },
    { id: 9, title: "UX/UI Design Skills", type: "skill", url: "/skills-analysis/ux-design" },
    { id: 10, title: "Interview Preparation", type: "tool", url: "/interview-prep" },
  ];

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      title: "New Ivestment Idea",
      message: "Based on your profile, we found 3 new investments paths that match your financial score.",
      time: "5 minutes ago",
      type: "investments",
      read: false,
      actionUrl: "/investments",
    },
    {
      id: 2,
      title: "Budget Planning Session Scheduled",
      message: "Your session with Sarah Johnson is scheduled for tomorrow at 2:00 PM.",
      time: "1 hour ago",
      type: "budget-planner",
      read: false,
      actionUrl: "/budget-planner",
    },
    
    
  ];

  // Initialize notifications on component mount
  useEffect(() => {
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter((n) => !n.read).length);
  }, []);

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearchLoading(true);

    setTimeout(() => {
      const filteredResults = searchData
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);

      setSearchResults(filteredResults);
      setIsSearchLoading(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (url) => {
    navigate(url);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Search modal controls
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsNotificationOpen(false);
    setIsProfileMenuOpen(false);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Notification controls
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
    const deletedNotification = notifications.find((n) => n.id === notificationId);
    if (deletedNotification && !deletedNotification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    navigate(notification.actionUrl);
    setIsNotificationOpen(false);
  };

  // Profile menu controls
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsSearchOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    handleLogoutTemp();
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setIsProfileMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsProfileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }
        if (isNotificationOpen) setIsNotificationOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, isNotificationOpen, isProfileMenuOpen]);

  // Get icon for search result type
  // Get icon for search result type
  const getResultIcon = (type) => {
    switch (type) {
      case "career":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "skill":
        return <span className="material-icons text-base text-red-600">psychology</span>;
      case "tool":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "planner":
        return <span className="material-icons text-base text-purple-600">calendar_today</span>;
      case "recommend":
        return <span className="material-icons text-base text-orange-600">lightbulb</span>;
      case "learning":
        return <span className="material-icons text-base text-indigo-600">school</span>;
      case "page":
        return <LayoutDashboard className="h-4 w-4 text-gray-600" />;
      default:
        return <SearchIcon className="h-4 w-4 text-gray-500" />;
    }
  };


  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "career":
        return <span className="material-icons text-green-600 text-lg">trending_up</span>;
      case "learning-hub":
        return <span className="material-icons text-purple-600 text-lg">people</span>;
      case "analysis":
        return <span className="material-icons text-blue-600 text-lg">analytics</span>;
      case "investments":
        return <span className="material-icons text-red-600 text-lg">psychology</span>;
      default:
        return <span className="material-icons text-gray-600 text-lg">notifications</span>;
    }
  };

  return (
    <>
      {/* Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap"
        rel="stylesheet"
      />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 transition-all duration-300 hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <School className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-2xl font-medium text-gray-800"
                style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
              >
                FinZer
              </span>
              <span
                className="text-xs text-blue-600 -mt-1"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                Powered by AI
              </span>
            </div>
          </Link>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-4 font-bold">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/budget-planner"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Budget Planner</span>
              </Link>
              <Link
                to="/investments"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                <span className="material-icons text-base">psychology</span>
                <span>Investments</span>
              </Link>
              <Link
                to="/chatbot"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                <FileText className="h-4 w-4" />
                <span>ChatBot</span>
              </Link>
              <Link
                to="/learning-hub"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                <Users className="h-4 w-4" />
                <span>Learning Hub</span>
              </Link>
            </nav>
            
          )}
          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Search Button - Always visible */}
            <div className="google-material-button hidden sm:block">
              <button
                className="google-icon-button search-button"
                onClick={toggleSearch}
                title="Search"
                type="button"
              >
                <span className="material-icons">search</span>
                <div className="button-ripple"></div>
              </button>
            </div>

            {/* Conditional Authentication UI */}
            {!isLoading && (
              isAuthenticated ? (
                <>
                  {/* AUTHENTICATED - Show Notifications, Profile, Welcome */}
                  <div className="google-material-button hidden sm:block relative" ref={notificationRef}>
                    <button
                      className="google-icon-button notification-button"
                      onClick={toggleNotifications}
                      title="Notifications"
                      type="button"
                    >
                      <span className="material-icons">notifications</span>
                      {unreadCount > 0 && (
                        <div className="notification-badge">
                          <span className="notification-count">{unreadCount}</span>
                        </div>
                      )}
                      <div className="button-ripple"></div>
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationOpen && (
                      <div className="notification-dropdown">
                        <div className="notification-header">
                          <span
                            className="notification-title"
                            style={{ fontFamily: "Google Sans, sans-serif" }}
                          >
                            Notifications
                          </span>
                          <div className="notification-actions">
                            <button
                              className="mark-all-read-btn"
                              onClick={markAllAsRead}
                              disabled={unreadCount === 0}
                              style={{ fontFamily: "Roboto, sans-serif" }}
                              type="button"
                            >
                              Mark all read
                            </button>
                          </div>
                        </div>
                        <div className="notification-list">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`notification-item ${notification.read ? "read" : "unread"}`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="notification-icon">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                  <div
                                    className="notification-item-title"
                                    style={{ fontFamily: "Google Sans, sans-serif" }}
                                  >
                                    {notification.title}
                                  </div>
                                  <div
                                    className="notification-message"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                  >
                                    {notification.message}
                                  </div>
                                  <div
                                    className="notification-time"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                  >
                                    {notification.time}
                                  </div>
                                </div>
                                <button
                                  className="delete-notification-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  title="Delete notification"
                                  type="button"
                                >
                                  <span className="material-icons">close</span>
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="no-notifications">
                              <span className="material-icons">notifications_none</span>
                              <p style={{ fontFamily: "Roboto, sans-serif" }}>No notifications</p>
                            </div>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="notification-footer">
                            <Link
                              to="/notifications"
                              className="view-all-btn"
                              style={{ fontFamily: "Google Sans, sans-serif" }}
                              onClick={() => setIsNotificationOpen(false)}
                            >
                              View all notifications
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Menu */}
                  <div className="google-material-button hidden sm:block relative" ref={profileMenuRef}>
                    <button
                      className="google-profile-button"
                      onClick={toggleProfileMenu}
                      title="Account"
                      type="button"
                    >
                      <div className="profile-avatar">
                        <span
                          className="profile-initial"
                          style={{ fontFamily: "Google Sans, sans-serif" }}
                        >
                          U
                        </span>
                      </div>
                      <ChevronDown className={`profile-chevron ${isProfileMenuOpen ? "open" : ""}`} />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="profile-dropdown">
                        <div className="profile-info-section">
                          <div className="profile-avatar-large">
                            <span
                              className="profile-initial-large"
                              style={{ fontFamily: "Google Sans, sans-serif" }}
                            >
                              U
                            </span>
                          </div>
                          <div className="profile-details">
                            <div
                              className="profile-name"
                              style={{ fontFamily: "Google Sans, sans-serif" }}
                            >
                              User
                            </div>
                            <div
                              className="profile-email"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              user@example.com
                            </div>
                          </div>
                        </div>
                        <div className="profile-menu-divider"></div>
                        <div className="profile-menu-items">
                          <button className="profile-menu-item" onClick={handleProfile} type="button">
                            <span className="material-icons">person</span>
                            <span style={{ fontFamily: "Roboto, sans-serif" }}>My Profile</span>
                          </button>
                          <button className="profile-menu-item" onClick={handleSettings} type="button">
                            <span className="material-icons">settings</span>
                            <span style={{ fontFamily: "Roboto, sans-serif" }}>Settings</span>
                          </button>
                          <button
                            className="profile-menu-item logout-item"
                            onClick={handleLogout}
                            type="button"
                          >
                            <span className="material-icons">logout</span>
                            <span style={{ fontFamily: "Roboto, sans-serif" }}>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Welcome Message */}
                  <div className="hidden lg:flex items-center space-x-3 ml-4">
                    <div className="google-user-card">
                      <div className="user-avatar">
                        <span
                          className="user-initial"
                          style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 600 }}
                        >
                          U
                        </span>
                      </div>
                      <div className="user-info">
                        <span
                          className="user-greeting"
                          style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
                        >
                          Hello, User
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* UNAUTHENTICATED - Show  Get Started buttons */}

                 

                  {/* Get Started Button */}
                  <div className="gemini-border-wrapper hidden md:block">
                    <Button
                      className="gemini-gradient-border h-10 px-6 bg-white text-gray-700 rounded-full border-0 relative font-medium"
                      style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: '500' }}
                      onClick={handleLogin} // 🔥 CHANGED: Use handleLogin
                    >
                      Get Started
                    </Button>
                  </div>
                </>
              )
            )}

            {/* Mobile Menu Button */}
            <div className="google-material-button md:hidden">
              <button
                className="google-icon-button menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Menu"
                type="button"
              >
                <span className="material-icons">menu</span>
                <div className="button-ripple"></div>
              </button>
            </div>
          </div>


          {/* Mobile Navigation */}
          {isMenuOpen && (
            // Fixed positioning to cover the viewport for mobile menu
            <div className="md:hidden absolute top-16 left-0 w-full border-t border-gray-200 bg-white shadow-lg z-40">
              <nav className="flex flex-col p-4 space-y-1">
                {/* Mobile Search */}
                <div className="mb-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search careers, skills, tools..."
                      className="w-full h-12 pl-12 pr-4 text-sm border-2 border-gray-200 rounded-full focus:outline-none focus:ring-0 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-300"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      search
                    </span>
                  </form>
                </div>

                {/* Mobile Navigation Links - Only when authenticated */}
                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5 text-blue-600" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/budget-planner"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Budget Planner</span>
                    </Link>
                    <Link
                      to="/investments"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="material-icons text-lg text-red-600">psychology</span>
                      <span>Investments</span>
                    </Link>
                    <Link
                      to="/chatbot"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FileText className="h-5 w-5 text-yellow-600" />
                      <span>ChatBot</span>
                    </Link>
                    <Link
                      to="/learning-hub"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="h-5 w-5 text-purple-600" />
                      <span>Learning Hub</span>
                    </Link>
                  </>
                )}

                {/* Mobile Auth Section */}
                {!isLoading && (
                  isAuthenticated ? (
                    <div className="flex flex-col space-y-1 pt-4 border-t border-gray-200 mt-4">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="material-icons text-lg text-blue-600">account_circle</span>
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="material-icons text-lg text-gray-600">settings</span>
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 text-left"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        type="button"
                      >
                        <span className="material-icons text-lg text-red-600">logout</span>
                        <span>Sign Out</span>
                      </button>
                      <div className="px-4 py-3 mt-2">
                        <div className="google-user-card mobile">
                          <div className="user-avatar mobile">
                            <span
                              className="user-initial"
                              style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 600 }}
                            >
                              U
                            </span>
                          </div>
                          <div className="user-info mobile">
                            <span
                              className="user-greeting mobile"
                              style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
                            >
                              Welcome back!
                            </span>
                            <span
                              className="user-name mobile"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                              User
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="pt-4 border-t border-gray-200 mt-4">
                        <div className="gemini-border-wrapper">
                          <Button
                            className="gemini-gradient-border w-full h-10 bg-white text-gray-700 rounded-full border-0 relative font-medium"
                            style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: '500' }}
                            onClick={() => {
                              navigate('/sign-up'); // go to signup
                              setIsMenuOpen(false);
                            }}
                          >
                            Get Started
                          </Button>
                        </div>
                      </div>

                  )
                )}
              </nav>
            </div>
            
          )}
        </div>
      </header>

      {/* Search Modal - (keeping same as before, truncated for brevity) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search careers, skills, tools, and more..."
                    className="w-full h-12 pl-12 pr-12 text-lg border-0 focus:outline-none focus:ring-0"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <div className="google-material-button absolute right-2 top-1/2 transform -translate-y-1/2">
                    <button
                      type="button"
                      className="google-icon-button close-button"
                      onClick={toggleSearch}
                      title="Close"
                    >
                      <span className="material-icons">close</span>
                      <div className="button-ripple"></div>
                    </button>
                  </div>
                </form>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-8 text-center">
                    <div className="google-loading-spinner"></div>
                    <p
                      className="text-gray-500 mt-4"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      Searching...
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.url)}
                        className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 text-left"
                        type="button"
                      >
                        {getResultIcon(result.type)}
                        <div>
                          <div
                            className="font-medium text-gray-900"
                            style={{ fontFamily: "Google Sans, sans-serif", fontWeight: 500 }}
                          >
                            {result.title}
                          </div>
                          <div
                            className="text-sm text-gray-500 capitalize"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          >
                            {result.type}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-8 text-center">
                    <p
                      className="text-gray-500"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p
                      className="text-gray-500"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      Start typing to search for careers, skills, and tools
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles - same as before */}
      <style>{`
        :root {
          --google-blue: #4285f4;
          --google-red: #ea4335;
          --google-grey-600: #757575;
          --gemini-orange: #FF8A80;
          --gemini-pink: #FF80AB;
          --gemini-purple: #EA80FC;
          --gemini-blue: #8C9EFF;
          --gemini-cyan: #84FFFF;
          --gemini-green: #B9F6CA;
          --gemini-yellow: #FFFF8D;
        }

        .google-material-button {
          position: relative;
          display: inline-block;
        }

        .google-icon-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--google-grey-600);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .google-icon-button:hover {
          background-color: rgba(66, 133, 244, 0.08);
          color: var(--google-blue);
        }

        .google-icon-button:active {
          background-color: rgba(66, 133, 244, 0.12);
          transform: scale(0.95);
        }

        .google-icon-button .material-icons {
          font-size: 20px;
          user-select: none;
        }

        .google-profile-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          border-radius: 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .google-profile-button:hover {
          background-color: rgba(66, 133, 244, 0.08);
        }

        .profile-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--google-blue), #1976d2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-initial {
          color: white;
          font-size: 12px;
          font-weight: 600;
          user-select: none;
        }

        .profile-chevron {
          width: 18px;
          height: 18px;
          color: var(--google-grey-600);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .profile-chevron.open {
          transform: rotate(180deg);
          color: var(--google-blue);
        }

        .notification-button:hover {
          background-color: rgba(255, 193, 7, 0.08);
          color: #f57c00;
        }

        .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          min-width: 16px;
          height: 16px;
          background-color: var(--google-red);
          border-radius: 8px;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-count {
          color: white;
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          padding: 0 2px;
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          max-height: 480px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border: 1px solid #e8eaed;
          z-index: 1000;
          overflow: hidden;
          animation: dropdown-appear 0.2s ease-out;
        }

        @keyframes dropdown-appear {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e8eaed;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 500;
          color: #202124;
        }

        .mark-all-read-btn {
          background: none;
          border: none;
          color: var(--google-blue);
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .mark-all-read-btn:hover:not(:disabled) {
          background-color: rgba(66, 133, 244, 0.08);
        }

        .mark-all-read-btn:disabled {
          color: #9aa0a6;
          cursor: not-allowed;
        }

        .notification-list {
          max-height: 320px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          position: relative;
        }

        .notification-item:hover {
          background-color: #f8f9fa;
        }

        .notification-item.unread {
          background-color: #f0f4ff;
        }

        .notification-item.unread::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background-color: var(--google-blue);
          border-radius: 50%;
        }

        .notification-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(66, 133, 244, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-item-title {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 4px;
        }

        .notification-message {
          font-size: 13px;
          color: #5f6368;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .notification-time {
          font-size: 12px;
          color: #9aa0a6;
        }

        .delete-notification-btn {
          opacity: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
          color: #5f6368;
        }

        .notification-item:hover .delete-notification-btn {
          opacity: 1;
        }

        .delete-notification-btn:hover {
          background-color: rgba(234, 67, 53, 0.08);
          color: var(--google-red);
        }

        .notification-footer {
          padding: 12px 20px;
          border-top: 1px solid #e8eaed;
          text-align: center;
        }

        .view-all-btn {
          color: var(--google-blue);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
        }

        .view-all-btn:hover {
          background-color: rgba(66, 133, 244, 0.08);
        }

        .no-notifications {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          color: #9aa0a6;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border: 1px solid #e8eaed;
          z-index: 1000;
          animation: dropdown-appear 0.2s ease-out;
        }

        .profile-info-section {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .profile-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--google-blue), #1976d2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-initial-large {
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .profile-details {
          flex: 1;
        }

        .profile-name {
          font-size: 16px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 4px;
        }

        .profile-email {
          font-size: 14px;
          color: #5f6368;
        }

        .profile-menu-divider {
          height: 1px;
          background-color: #e8eaed;
          margin: 0 8px;
        }

        .profile-menu-items {
          padding: 8px;
        }

        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #202124;
          text-align: left;
        }

        .profile-menu-item:hover {
          background-color: #f8f9fa;
        }

        .profile-menu-item.logout-item:hover {
          background-color: rgba(234, 67, 53, 0.08);
          color: var(--google-red);
        }

        .profile-menu-item .material-icons {
          font-size: 20px;
          color: #5f6368;
        }

        .profile-menu-item.logout-item .material-icons {
          color: var(--google-red);
        }

        .button-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(66, 133, 244, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
          pointer-events: none;
        }

        .google-icon-button:active .button-ripple {
          width: 80px;
          height: 80px;
        }

        .google-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%);
          border: 1px solid #d2e3fc;
          border-radius: 24px;
          transition: all 0.3s ease;
        }

        .google-user-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        }

        .google-user-card.mobile {
          border-radius: 12px;
          padding: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--google-blue), #1976d2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar.mobile {
          width: 36px;
          height: 36px;
        }

        .user-initial {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-greeting {
          font-size: 14px;
          color: #616161;
        }

        .user-name {
          color: var(--google-blue);
          font-weight: 600;
        }

        .google-loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #eeeeee;
          border-top: 3px solid var(--google-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .gemini-border-wrapper {
          position: relative;
          padding: 2px;
          border-radius: 9999px;
          background: linear-gradient(
            45deg,
            var(--gemini-orange) 0%,
            var(--gemini-pink) 14%,
            var(--gemini-purple) 28%,
            var(--gemini-blue) 42%,
            var(--gemini-cyan) 57%,
            var(--gemini-green) 71%,
            var(--gemini-yellow) 85%,
            var(--gemini-orange) 100%
          );
          background-size: 400% 400%;
        }

        .gemini-border-wrapper:hover {
          animation: gradient-rotate 4s linear infinite;
        }

        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gemini-gradient-border {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          transition: all 0.3s ease;
        }

        .gemini-gradient-border:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default Header;