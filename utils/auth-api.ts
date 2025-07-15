import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  profile?: UserProfile;
  requiresOtp?: boolean;
  message?: string;
}

export interface OtpRequest {
  email: string;
  password: string;
  code: string;
}

export interface OtpResponse {
  success: boolean;
  token?: string;
  profile?: UserProfile;
  message?: string;
}

export interface UserProfile {
  provider: boolean;
  merchant: boolean;
  client: boolean;
  deliveryman: boolean;
}

export interface ApiLoginResponse {
  access_token: string;
  profile: UserProfile;
}

export interface ApiErrorResponse {
  message: string;
}

export class AuthApi {
  private static readonly BASE_URL = "http://localhost:3001";
  private static axiosInstance = axios.create({
    baseURL: this.BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  private static hasExtensionAccess(profile: UserProfile): boolean {
    return profile.client || profile.merchant;
  }

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post<
        ApiLoginResponse | ApiErrorResponse
      >("/client/auth/extension/login", credentials);

      const data = response.data;

      if ("message" in data) {
        if (data.message.includes("2FA") || data.message.includes("OTP")) {
          return {
            success: false,
            requiresOtp: true,
            message:
              "Veuillez entrer votre code d'authentification à deux facteurs",
          };
        }

        return {
          success: false,
          message: data.message,
        };
      }

      // Si c'est un succès avec token
      if ("access_token" in data) {
        // Vérifier si l'utilisateur a accès à l'extension
        if (!this.hasExtensionAccess(data.profile)) {
          return {
            success: false,
            message:
              "Accès refusé. Cette extension est réservée aux clients et commerçants.",
          };
        }

        return {
          success: true,
          token: data.access_token,
          profile: data.profile,
        };
      }

      return {
        success: false,
        message: "Réponse inattendue du serveur",
      };
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: "Email ou mot de passe incorrect",
          };
        }

        if (error.response?.status === 403) {
          return {
            success: false,
            requiresOtp: true,
            message: "Authentification à deux facteurs requise",
          };
        }

        if (error.code === "ECONNREFUSED") {
          return {
            success: false,
            message: "Impossible de se connecter au serveur",
          };
        }
      }

      return {
        success: false,
        message: "Erreur de connexion. Veuillez réessayer.",
      };
    }
  }

  static async verifyOtp(otpData: OtpRequest): Promise<OtpResponse> {
    try {
      const response = await this.axiosInstance.post<
        ApiLoginResponse | ApiErrorResponse
      >("/client/auth/extension/a2f/login", {
        email: otpData.email,
        password: otpData.password,
        code: otpData.code,
      });

      const data = response.data;

      if ("message" in data) {
        return {
          success: false,
          message:
            data.message === "Invalid OTP code"
              ? "Code d'authentification invalide"
              : data.message,
        };
      }

      if ("access_token" in data) {
        if (!this.hasExtensionAccess(data.profile)) {
          return {
            success: false,
            message:
              "Accès refusé. Cette extension est réservée aux clients et commerçants.",
          };
        }

        return {
          success: true,
          token: data.access_token,
          profile: data.profile,
        };
      }

      return {
        success: false,
        message: "Réponse inattendue du serveur",
      };
    } catch (error) {
      console.error("Erreur lors de la vérification OTP:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: "Code d'authentification invalide",
          };
        }

        if (error.code === "ECONNREFUSED") {
          return {
            success: false,
            message: "Impossible de se connecter au serveur",
          };
        }
      }

      return {
        success: false,
        message: "Erreur de vérification. Veuillez réessayer.",
      };
    }
  }
}
