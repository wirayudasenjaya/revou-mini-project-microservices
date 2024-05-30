import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET || 'secret'

export function generateJwtToken(userId: number, role: string) {
  return new Promise<string>((resolve, reject) => {
    const currentDate = new Date();
    const expTime = currentDate.setMinutes(
      currentDate.getMinutes() + 60
    );

    const payload = {
      sub: userId,
      role: role,
      exp: Math.floor(expTime / 1000),
    };

    jwt.sign(payload, jwt_secret, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token as string);
    });
  });
}

export function verifyJwtToken(token: string) {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, jwt_secret, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(payload);
    });
  });
}
