import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";

import { Lock, Mail, AlertCircle } from "lucide-react";

import "../styles/login.css";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <Lock className="login-logo-icon" />
          </div>

          <h1 className="login-title">PayrollPro</h1>

          <p className="login-subtitle">
            Admin Payroll Management System
          </p>
        </div>

        {/* Card */}
        <Card className="login-card">
          <CardHeader className="login-card-header">
            <h2 className="login-card-title">
              Sign in to your account
            </h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="login-form">

              {error && (
                <div className="login-error">
                  <AlertCircle className="login-error-icon" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="login-field">
                <Label htmlFor="email">Email</Label>

                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <Label htmlFor="password">Password</Label>

                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" />

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </form>
          </CardContent>
        </Card>

        <p className="login-footer-text">
          Contact your system administrator for access
        </p>
      </div>
    </div>
  );
}