import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  admin?: { id: number; email: string };
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "manarent-secret-key-change-in-production-32c",
  cookieName: "manarent_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
