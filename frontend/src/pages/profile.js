import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        name: formData.name,
        email: formData.email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Personal Information
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mr-4"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
              />
              <Input
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
