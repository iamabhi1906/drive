"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { updateProfile, uploadAvatar } from "@/features/auth/auth.action";
import { clearAuthError } from "@/features/auth/auth.slice";
import type { AuthUser } from "@/features/auth/auth.types";
import { profileSchema, type ProfileInput } from "@/schema/auth/profile.schema";
import styles from "./profile-page.module.css";
import { avatarUrl } from "@/lib/avatar";

export default function ProfilePage({
  initialUser,
}: {
  initialUser: AuthUser;
}) {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = user ?? initialUser;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentUser.name, avatar: currentUser.avatar ?? "" },
  });
  const avatar = watch("avatar");
  const avatarSource = useMemo(() => avatarUrl(avatar?.trim()), [avatar]);

  useEffect(() => {
    reset({ name: currentUser.name, avatar: currentUser.avatar ?? "" });
  }, [currentUser.name, currentUser.avatar, reset]);

  const submit = async (values: ProfileInput) => {
    const result = await dispatch(
      updateProfile({
        ...values,
        name: values.name.trim(),
        avatar: values.avatar.trim(),
      }),
    );
    if (result.meta.requestStatus === "fulfilled") setSaved(true);
  };

  const selectAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (
      !["image/gif", "image/jpeg", "image/png", "image/webp"].includes(
        file.type,
      ) ||
      file.size > 2 * 1024 * 1024
    ) {
      dispatch(clearAuthError());
      setPendingAvatar(null);
      event.target.value = "";
      return;
    }
    setPendingAvatar(file);
  };

  const uploadSelectedAvatar = async () => {
    if (!pendingAvatar) return;
    const result = await dispatch(uploadAvatar(pendingAvatar));
    if (result.meta.requestStatus === "fulfilled") {
      setPendingAvatar(null);
      if (inputRef.current) inputRef.current.value = "";
      setSaved(true);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h3">
            Profile
          </Typography>
          <Typography color="text.secondary">
            Manage how your account appears in Drive.
          </Typography>
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Stack
              component="form"
              spacing={3}
              onSubmit={handleSubmit(submit)}
              noValidate
            >
              <Box className={styles.identity}>
                <Avatar
                  className={styles.avatar}
                  alt={currentUser.name}
                  src={avatarSource}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{currentUser.name}</Typography>
                  <Typography color="text.secondary">
                    {currentUser.email}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <TextField
                label="Name"
                autoComplete="name"
                fullWidth
                {...register("name")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
              <Stack spacing={1}>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  hidden
                  onChange={selectAvatar}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<UploadRoundedIcon />}
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                  >
                    Choose avatar
                  </Button>
                  {pendingAvatar && (
                    <Button
                      variant="contained"
                      onClick={uploadSelectedAvatar}
                      disabled={loading}
                    >
                      Upload avatar
                    </Button>
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {pendingAvatar
                    ? pendingAvatar.name
                    : "PNG, JPEG, WebP, or GIF up to 2 MB."}
                </Typography>
              </Stack>
              <TextField
                label="Avatar image URL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                fullWidth
                {...register("avatar")}
                error={Boolean(errors.avatar)}
                helperText={
                  errors.avatar?.message ??
                  "Or use a public image URL. Leave empty to use your initial."
                }
              />
              <TextField
                label="Email"
                value={currentUser.email}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
                helperText="Your email address cannot be changed here."
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !isDirty}
                className={styles.saveButton}
              >
                {loading ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <Snackbar
        open={saved}
        autoHideDuration={4000}
        onClose={() => setSaved(false)}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Profile updated successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => dispatch(clearAuthError())}
      >
        <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
