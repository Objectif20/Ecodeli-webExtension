export interface AuthData {
  token: string;
  expiresAt: number;
  profile?: UserProfile;
  refreshToken?: string;
}

export class AuthManager {
  private static STORAGE_KEY = "auth";

  static async getAuth(): Promise<AuthData | null> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || null;
  }

  static async saveAuth(
    token: string,
    profile?: UserProfile,
    expiresInDays = 7
  ): Promise<void> {
    const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

    const authData: AuthData = {
      token,
      expiresAt,
      profile,
    };

    await chrome.storage.local.set({
      [this.STORAGE_KEY]: authData,
    });
  }

  static async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuth();
    return !!auth && auth.expiresAt > Date.now();
  }

  static async clearAuth(): Promise<void> {
    await chrome.storage.local.remove(this.STORAGE_KEY);
  }

  static async getToken(): Promise<string | null> {
    const auth = await this.getAuth();
    return auth?.token || null;
  }

  static async getProfile(): Promise<UserProfile | null> {
    const auth = await this.getAuth();
    return auth?.profile || null;
  }
}
