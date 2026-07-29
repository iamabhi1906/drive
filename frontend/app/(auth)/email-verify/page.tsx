"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Link,
  Stack,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import api from "@/lib/api";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/navigation";
import axios from "axios";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const { email: storedEmail } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (storedEmail) {
      setEmail(storedEmail as string);
    }
  }, [storedEmail]);

  const handleChange = (value: string) => {
    setOtp(value);
    if (error) setError("");
  };

  const handleVerify = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the complete verification code.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/verification/verify-otp", {
        email,
        otp,
      });
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return setError(error.response?.data?.message ?? error.message);
      }
      if (error instanceof Error) {
        return setError(error.message);
      }
      return setError("Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email first.");
      return;
    }
    try {
      setOtp("");
      setError("");
      await api.post("/verification/resend-otp", { email });
    } catch {
      setError("Unable to resend OTP.");
    }
  };

  if (!isMounted) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Verify OTP</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Verify OTP</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the 6-digit code sent to your email.
          </Typography>
        </Stack>

        {!storedEmail && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />
        )}

        <MuiOtpInput
          value={otp}
          onChange={handleChange}
          length={OTP_LENGTH}
          autoFocus
          validateChar={(character: string) => /^[0-9]$/.test(character)}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading}
          onClick={handleVerify}
        >
          Verify OTP
        </Button>

        <Typography variant="body2">
          Didn&apos;t receive the code?{" "}
          <Link component="button" underline="hover" onClick={handleResend}>
            Resend OTP
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
}
