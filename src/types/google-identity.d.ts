interface GoogleCredentialResponse { credential: string }

interface GoogleIdentityApi {
  initialize(config: { client_id: string; callback: (response: GoogleCredentialResponse) => void; auto_select?: boolean }): void;
  renderButton(parent: HTMLElement, options: { theme?: string; size?: string; shape?: string; text?: string; width?: number }): void;
}

interface Window {
  google?: { accounts: { id: GoogleIdentityApi } };
  turnstile?: {
    render(container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void; theme: "light" | "dark" | "auto" }): string;
    reset(widgetId?: string): void;
  };
}
