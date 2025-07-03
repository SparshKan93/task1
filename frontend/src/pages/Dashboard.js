// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const AUTH_STORAGE_KEY = "websphere:user";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (user) return;
    api
      .get("/auth/me")
      .then(({ data }) => {
        console.log("User data:", data.user);
        setUser(data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
      })
      .catch(() => navigate("/login"));
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header / Branding */}
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            {/* Placeholder for Logo */}
            <div
              className="rounded-circle bg-white d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              <span className="text-primary fw-bold">W</span>
            </div>
            <h5 className="mb-0 fw-semibold">Websphere Technology Pvt. Ltd.</h5>
          </div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => {
              localStorage.removeItem(AUTH_STORAGE_KEY);
              api.post("/auth/logout").finally(() => navigate("/login"));
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card shadow-sm p-4" style={{ maxWidth: 500, width: "90%" }}>
          <div className="text-center">
            <h2 className="fw-bold mb-3 text-primary">Welcome, {user.fullName || "User"}!</h2>
            <div className="alert alert-info">
              <strong>Email:</strong> {user.email}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-3 border-top small text-muted">
        &copy; {new Date().getFullYear()} Websphere Technology Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
