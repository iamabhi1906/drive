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
import { signupSchema, type SignUp } from "@/schema/auth/signup.schema";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { signup } from "@/features/auth/auth.action";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const submit = async (values: SignUp) => {
    const result = await dispatch(signup(values));
    if (result.meta.requestStatus === "fulfilled") router.push("/email-verify");
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            Create your account
          </Typography>
          <Typography color="text.secondary">
            Start organising your work in one focused place.
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
                label="Name"
                autoComplete="name"
                autoFocus
                fullWidth
                {...register("name")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                fullWidth
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                fullWidth
                {...register("password")}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Typography color="text.secondary">
          Already have an account?{" "}
          <Link component={NextLink} href="/login">
            Sign in
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
