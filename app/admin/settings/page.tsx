"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, Shield, User } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/constants/auth";

interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const changeUserPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type ChangeUserPasswordFormValues = z.infer<typeof changeUserPasswordSchema>;

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([]);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showUserNewPassword, setShowUserNewPassword] = React.useState(false);
  const [showUserConfirmPassword, setShowUserConfirmPassword] = React.useState(false);

  const [isChangingOwnPassword, setIsChangingOwnPassword] = React.useState(false);
  const [isChangingUserPassword, setIsChangingUserPassword] = React.useState(false);
  const [ownPasswordError, setOwnPasswordError] = React.useState("");
  const [ownPasswordSuccess, setOwnPasswordSuccess] = React.useState("");
  const [userPasswordError, setUserPasswordError] = React.useState("");
  const [userPasswordSuccess, setUserPasswordSuccess] = React.useState("");

  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  const ownPasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const userPasswordForm = useForm<ChangeUserPasswordFormValues>({
    resolver: zodResolver(changeUserPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch current user
  React.useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchCurrentUser();
  }, []);

  // Fetch admin users if current user is 'admin'
  React.useEffect(() => {
    async function fetchAdminUsers() {
      if (currentUser?.username !== "admin") return;

      setIsLoadingUsers(true);
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          // Filter to only show ulaw-admin for password management
          const ulawAdmin = data.users.find((u: AdminUser) => u.username === "ulaw-admin");
          if (ulawAdmin) {
            setAdminUsers([ulawAdmin]);
            setSelectedUserId(ulawAdmin.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    fetchAdminUsers();
  }, [currentUser]);

  async function onChangeOwnPassword(data: ChangePasswordFormValues) {
    setIsChangingOwnPassword(true);
    setOwnPasswordError("");
    setOwnPasswordSuccess("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setOwnPasswordSuccess("Password changed successfully!");
        ownPasswordForm.reset();
      } else {
        setOwnPasswordError(result.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setOwnPasswordError("An error occurred. Please try again.");
    } finally {
      setIsChangingOwnPassword(false);
    }
  }

  async function onChangeUserPassword(data: ChangeUserPasswordFormValues) {
    if (!selectedUserId) {
      setUserPasswordError("Please select a user");
      return;
    }

    setIsChangingUserPassword(true);
    setUserPasswordError("");
    setUserPasswordSuccess("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserPasswordSuccess(result.message || "Password changed successfully!");
        userPasswordForm.reset();
      } else {
        setUserPasswordError(result.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Change user password error:", error);
      setUserPasswordError("An error occurred. Please try again.");
    } finally {
      setIsChangingUserPassword(false);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isMainAdmin = currentUser?.username === "admin";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and security settings</p>
      </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>Your current account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Username:</span>
              <span className="text-sm text-muted-foreground">{currentUser?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Role:</span>
              <span className="text-sm text-muted-foreground capitalize">{currentUser?.role?.toLowerCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Own Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={ownPasswordForm.handleSubmit(onChangeOwnPassword)}>
            <FieldSet>
              <FieldGroup>
                {ownPasswordError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{ownPasswordError}</div>
                )}
                {ownPasswordSuccess && (
                  <div className="rounded-md bg-green-600/10 p-3 text-sm text-green-600 dark:text-green-500">
                    {ownPasswordSuccess}
                  </div>
                )}

                <Controller
                  name="currentPassword"
                  control={ownPasswordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          disabled={isChangingOwnPassword}
                          autoComplete="current-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isChangingOwnPassword}
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="newPassword"
                  control={ownPasswordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          disabled={isChangingOwnPassword}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isChangingOwnPassword}
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={ownPasswordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          disabled={isChangingOwnPassword}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isChangingOwnPassword}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Button type="submit" variant="ulaw" disabled={isChangingOwnPassword}>
                  {isChangingOwnPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>

      {/* Admin: Manage Other Users' Passwords */}
      {isMainAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Manage User Passwords</CardTitle>
            </div>
            <CardDescription>As the main admin, you can reset passwords for other admin users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : adminUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No other admin users found.</p>
            ) : (
              <form onSubmit={userPasswordForm.handleSubmit(onChangeUserPassword)}>
                <FieldSet>
                  <FieldGroup>
                    {userPasswordError && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {userPasswordError}
                      </div>
                    )}
                    {userPasswordSuccess && (
                      <div className="rounded-md bg-green-600/10 p-3 text-sm text-green-600 dark:text-green-500">
                        {userPasswordSuccess}
                      </div>
                    )}

                    <Field>
                      <FieldLabel>User</FieldLabel>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="text-sm font-medium">ulaw-admin</span>
                        <span className="text-xs text-muted-foreground ml-2">(Admin)</span>
                      </div>
                    </Field>

                    <Controller
                      name="newPassword"
                      control={userPasswordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="user-new-password">New Password</FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="user-new-password"
                              type={showUserNewPassword ? "text" : "password"}
                              placeholder="Enter new password for user"
                              disabled={isChangingUserPassword}
                              autoComplete="new-password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowUserNewPassword(!showUserNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isChangingUserPassword}
                              tabIndex={-1}
                            >
                              {showUserNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={userPasswordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="user-confirm-password">Confirm New Password</FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="user-confirm-password"
                              type={showUserConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              disabled={isChangingUserPassword}
                              autoComplete="new-password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowUserConfirmPassword(!showUserConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isChangingUserPassword}
                              tabIndex={-1}
                            >
                              {showUserConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Button type="submit" variant="ulaw" disabled={isChangingUserPassword || !selectedUserId}>
                      {isChangingUserPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        "Change User Password"
                      )}
                    </Button>
                  </FieldGroup>
                </FieldSet>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
