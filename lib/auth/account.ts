type LinkedAccount = {
  provider: string;
};

export const hasLinkedProvider = (accounts: LinkedAccount[], provider: string) => {
  return accounts.some((account) => account.provider === provider);
};

export const hasPasswordLogin = (passwordHash: string | null | undefined) => {
  return Boolean(passwordHash);
};

export const getRegisterConflictMessage = (params: {
  passwordHash: string | null;
  accounts: LinkedAccount[];
}) => {
  if (hasLinkedProvider(params.accounts, "kakao") && !hasPasswordLogin(params.passwordHash)) {
    return "이미 카카오로 가입된 이메일입니다. 카카오로 로그인해주세요.";
  }

  return "이미 가입된 이메일입니다.";
};
