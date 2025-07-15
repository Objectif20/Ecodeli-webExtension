"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { OtpForm } from "./otp-form";

interface AuthScreenProps {
  onAuthSuccess: (token: string, profile: UserProfile) => void;
}

type AuthStep = "login" | "otp";

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("login");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleLoginSuccess = (token: string, profile: UserProfile) => {
    onAuthSuccess(token, profile);
  };

  const handleRequireOtp = (email: string, password: string) => {
    setUserEmail(email);
    setUserPassword(password);
    setCurrentStep("otp");
  };

  const handleOtpSuccess = (token: string, profile: UserProfile) => {
    onAuthSuccess(token, profile);
  };

  const handleBackToLogin = () => {
    setCurrentStep("login");
    setUserEmail("");
    setUserPassword("");
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-4">
      <div className="w-full h-full">
        {currentStep === "login" && (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onRequireOtp={handleRequireOtp}
          />
        )}

        {currentStep === "otp" && (
          <OtpForm
            email={userEmail}
            password={userPassword}
            onOtpSuccess={handleOtpSuccess}
            onBack={handleBackToLogin}
          />
        )}
      </div>
    </div>
  );
}
