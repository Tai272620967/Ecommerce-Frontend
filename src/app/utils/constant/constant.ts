export const AUTH_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD:
    "入力されたメールアドレスまたはパスワードが間違っています。もう一度お試しください。",
  LOGIN_FAILED: "ログインに失敗しました。再度お試しください。",
  ACCOUNT_LOCKED:
    "アカウントがロックされています。30分後に再度お試しください。",
  UNAUTHORIZED_ACCESS: "認証されていないアクセスです。",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "ログインに成功しました！",
  REGISTER_SUCCESS: "新規メンバー登録が成功しました。",
  PASSWORD_RESET_SUCCESS: "パスワードのリセットに成功しました。",
  EMAIL_SENT: "確認メールが送信されました。",
};

export const ERROR_MESSAGES = {
  SERVER_ERROR: "サーバーエラーが発生しました。後でもう一度お試しください。",
  NOT_FOUND: "リクエストされたリソースが見つかりません。",
  VALIDATION_ERROR: "入力情報に誤りがあります。ご確認ください。",
  REGISTER_ERROR: "新規メンバー登録が失敗しました。",
};

export const VALIDATE_MESSAGES = {
  VALID_EMAIL: "有効なメールアドレスを入力してください。",
  EMAIL_REQUIRED: "メールアドレスを入力してください。",
  PASSWORD_REQUIRED: "パスワードを入力して下さい。",
  FIELD_REQUIRED: "必須です。",
  POSTAL_CODE_REQUIRED: "郵便番号を入力してください",
  CONFIRM_PASSWORD_IS_NOT_MATCHED: "パスワードが一致しません",
}

export const COOKIE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  NETWORK_Error: 'networkError',
  IS_LOGGED_IN: 'isLoggedIn',
};
