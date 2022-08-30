export interface JwtToken {
    isAuthenticated: boolean | null;
    token: string | null;
}