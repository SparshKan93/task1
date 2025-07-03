// src/components/AuthCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import Input from "./Input";

const gradientStyle = {
  background:
    "linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(147,51,234,1) 50%, rgba(236,72,153,1) 100%)",
};

const AuthCard = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- form helpers ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clear field‑specific error once the user starts typing again
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (mode === "signup" && form.fullName.trim().length < 2) {
      err.fullName = "Please enter your name";
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      err.email = "Enter a valid email";
    }
    if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }
    return err;
  };

  /* ---------------- submit ---------------- */
  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { fullName: form.fullName, email: form.email, password: form.password };

      await api.post(endpoint, payload);
      toast.success(mode === "login" ? "Logged in successfully!" : "Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- google ---------------- */
  // const googleAuth = () => {
  //   window.location.href = `${api.defaults.baseURL}/auth/google`;
  // };

  /* ---------------- render ---------------- */
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={gradientStyle}>
      <div className="card shadow-lg" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">
            {mode === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>

          <form onSubmit={submit} className="vstack gap-3">
            {mode === "signup" && (
              <>
                <Input
                  placeholder="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "is-invalid" : ""}
                />
                {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
              </>
            )}
            <>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "is-invalid" : ""}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </>
            <>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "is-invalid" : ""}
              />
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="px-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          {/* --- OAuth Buttons -------------------------------------------------- */}
          <div className="vstack gap-2">
            {/* Google */}
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
              onClick={() => (window.location.href = `${api.defaults.baseURL}/auth/google`)}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 20 }} />
              Continue with Google
            </button>

            {/* Facebook 
            <button
              className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
              onClick={() => (window.location.href = `${api.defaults.baseURL}/auth/facebook`)}
            >
              <i className="bi bi-facebook"></i> 
              Continue with Facebook
            </button>
              uses Bootstrap‑icons CDN */}

            {/* GitHub */}
            <button
              className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
              onClick={() => (window.location.href = `${api.defaults.baseURL}/auth/github`)}
            >
              <i className="bi bi-github"></i>
              Continue with GitHub
            </button>
          </div>

          <p className="text-center mt-3 mb-0 small text-muted">
            {mode === "login" ? (
              <>
                Don&apos;t have an account? <a href="/signup">Sign up</a>
              </>
            ) : (
              <>
                Already registered? <a href="/login">Log in</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
