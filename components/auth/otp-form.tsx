"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { AuthApi, UserProfile } from "../../utils/auth-api";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpFormProps {
  email: string;
  password: string;
  onOtpSuccess: (token: string, profile: UserProfile) => void;
  onBack: () => void;
}

export function OtpForm({
  email,
  password,
  onOtpSuccess,
  onBack,
}: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await AuthApi.verifyOtp({ email, password, code: otp });

      if (response.success && response.token && response.profile) {
        onOtpSuccess(response.token, response.profile);
      } else {
        setError(response.message || "Code OTP invalide");
      }
    } catch (error) {
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 6);
    setOtp(sanitized);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-center">
              Vérification
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center">
          Un code de vérification a été envoyé à<br />
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-center">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="otp">Code de vérification</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <InputOTPGroup className="justify-center" data-testid="otp-group">
                <InputOTP
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  disabled={loading}
                  className="tracking-widest"
                  containerClassName="gap-2"
                >
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTP>
              </InputOTPGroup>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Entrez le code à 6 chiffres reçu par email
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Vérifier le code"
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" className="text-sm" disabled={loading}>
              Renvoyer le code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
