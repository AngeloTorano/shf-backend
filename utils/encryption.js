const crypto = require("crypto")

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)
const IV_LENGTH = 16

class EncryptionUtil {
  static encrypt(text) {
    try {
      const iv = crypto.randomBytes(IV_LENGTH)
      const cipher = crypto.createCipher("aes-256-cbc", ENCRYPTION_KEY)
      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")
      return iv.toString("hex") + ":" + encrypted
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Encryption failed")
    }
  }

  static decrypt(text) {
    try {
      const textParts = text.split(":")
      const iv = Buffer.from(textParts.shift(), "hex")
      const encryptedText = textParts.join(":")
      const decipher = crypto.createDecipher("aes-256-cbc", ENCRYPTION_KEY)
      let decrypted = decipher.update(encryptedText, "hex", "utf8")
      decrypted += decipher.final("utf8")
      return decrypted
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Decryption failed")
    }
  }

  static encryptObject(obj) {
    try {
      const jsonString = JSON.stringify(obj)
      return this.encrypt(jsonString)
    } catch (error) {
      console.error("Object encryption error:", error)
      throw new Error("Object encryption failed")
    }
  }

  static decryptObject(encryptedText) {
    try {
      const decryptedString = this.decrypt(encryptedText)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error("Object decryption error:", error)
      throw new Error("Object decryption failed")
    }
  }

  static hashData(data) {
    return crypto.createHash("sha256").update(data).digest("hex")
  }
}

module.exports = EncryptionUtil
