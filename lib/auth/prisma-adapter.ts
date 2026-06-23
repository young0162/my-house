import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Prisma, PrismaClient } from "@/app/generated/prisma";

type AuthAccount = AdapterAccount & {
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  id_token?: string;
  session_state?: string;
};

export const mapAuthAccountToPrismaAccount = (account: AuthAccount) => {
  const data: Prisma.AccountUncheckedCreateInput = {
    userId: account.userId,
    type: account.type,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
  };

  if (account.refresh_token !== undefined) data.refreshToken = account.refresh_token;
  if (account.access_token !== undefined) data.accessToken = account.access_token;
  if (account.expires_at !== undefined) data.expiresAt = account.expires_at;
  if (account.token_type !== undefined) data.tokenType = account.token_type;
  if (account.scope !== undefined) data.scope = account.scope;
  if (account.id_token !== undefined) data.idToken = account.id_token;
  if (account.session_state !== undefined) data.sessionState = account.session_state;

  return data;
};

export const createPrismaAdapter = (prisma: PrismaClient): Adapter => {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    linkAccount: async (account: AdapterAccount) => {
      await prisma.account.create({
        data: mapAuthAccountToPrismaAccount(account),
      });
    },
  };
};
