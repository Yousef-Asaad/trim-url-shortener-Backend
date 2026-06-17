import Link from "../models/Link";

const BASE62_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 7;

const randomBase62 = (length: number): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS.charAt(
      Math.floor(Math.random() * BASE62_CHARS.length)
    );
  }
  return result;
};

export const generateShortCode = async (): Promise<string> => {
  let code = randomBase62(CODE_LENGTH);
  let existing = await Link.findOne({ shortCode: code });

  while (existing) {
    code = randomBase62(CODE_LENGTH);
    existing = await Link.findOne({ shortCode: code });
  }

  return code;
};
