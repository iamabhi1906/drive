import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthUser, LoginInput, UpdateProfileInput } from "./auth.types";
import api from "@/lib/api";
import { SignupInput } from "./auth.types";
import axios from "axios";

export const signup = createAsyncThunk<
  string,
  SignupInput,
  { rejectValue: string }
>("auth/signup", async (payload: SignupInput, { rejectWithValue }) => {
  try {
    await api.post("/auth/signup", payload);
    return payload.email;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message);
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unable to create your account.");
  }
});

export const login = createAsyncThunk<
  AuthUser,
  LoginInput,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data.user as AuthUser;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message ?? error.message);
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unable to sign in.");
  }
});

export const fetchUser = createAsyncThunk<
  AuthUser,
  null,
  { rejectValue: string }
>("auth/fetch/user", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data as AuthUser;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to sign in.",
    );
  }
});

export const logout = createAsyncThunk<void, null, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  },
);

export const updateProfile = createAsyncThunk<
  AuthUser,
  UpdateProfileInput,
  { rejectValue: string }
>("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch("/users/me", payload);
    return data as AuthUser;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      return rejectWithValue(
        Array.isArray(message) ? message[0] : (message ?? error.message),
      );
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to update your profile.",
    );
  }
});

export const uploadAvatar = createAsyncThunk<
  AuthUser,
  File,
  { rejectValue: string }
>("auth/uploadAvatar", async (avatar, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const { data } = await api.post("/users/me/avatar", formData);
    return data as AuthUser;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      return rejectWithValue(
        Array.isArray(message) ? message[0] : (message ?? error.message),
      );
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to upload your avatar.",
    );
  }
});
