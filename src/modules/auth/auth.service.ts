import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import jwt from "jsonwebtoken";

export const loginWithGoogle = async (token: string) => {
  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!googleResponse.ok) {
    throw new AppError("Token Google tidak valid atau sudah kedaluwarsa", 401);
  }

  const profile = await googleResponse.json();
  const { sub: googleId, email, name } = profile;

  if (!email) {
    throw new AppError("Email tidak ditemukan dari akun Google ini", 400);
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || "Google User",
        email,
        googleId,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId },
    });
  }

  const appToken = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: appToken,
  };
};
