"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { clearAuthError } from "@/features/auth/auth.slice";
import { loginSchema, type Login } from "@/schema/auth/login.schema";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { login } from "@/features/auth/auth.action";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const submit = async (values: Login) => {
    const result = await dispatch(login(values));
    if (result.meta.requestStatus === "fulfilled") router.push("/");
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            Welcome back
          </Typography>
          <Typography color="text.secondary">
            Sign in to manage your tasks.
          </Typography>
        </Stack>
        <Card variant="outlined">
          <CardContent>
            <Stack
              component="form"
              spacing={3}
              onSubmit={handleSubmit(submit)}
              noValidate
            >
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                autoFocus
                fullWidth
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                fullWidth
                {...register("password")}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Typography color="text.secondary">
          <Link component={NextLink} href="/signup">
            Create an account
          </Link>
        </Typography>
      </Stack>
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
