const crypto = require("crypto");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function parseInitData(initDataString) {
  const params = Object.fromEntries(new URLSearchParams(initDataString));
  if (params.user) {
    try {
      params.user = JSON.parse(params.user);
    } catch {
      // если не удалось распарсить, оставим как есть
    }
  }
  return params;
}


function verifyTelegramInitData(initDataString) {
  const parsed = parseInitData(initDataString);

  const { hash, ...dataToCheck } = parsed;
  const keys = Object.keys(dataToCheck).sort();
  const dataCheckString = keys.map((key) => `${key}=${dataToCheck[key]}`).join("\n");

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (hmac !== hash) {
    throw new Error("Неверная подпись данных Telegram");
  }

  return {
    id: parseInt(parsed.user?.id || parsed.id, 10),
    username: parsed.user?.username || parsed.username,
    full_name: parsed.user?.first_name || "",
  };
}

module.exports = {
  verifyTelegramInitData,
};
