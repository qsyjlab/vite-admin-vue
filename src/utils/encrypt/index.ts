import JSEncrypt from 'jsencrypt'

// import publicKey from '~/public.pem?raw'
// import privateKey from '~/private.pem?raw'

/**
 * 公钥私钥仅做测试使用 ， 正式使用需要按需替换
 */
const jsEncryptInstance = new JSEncrypt()

// jsEncryptInstance.setPublicKey(publicKey)
// jsEncryptInstance.setPrivateKey(privateKey)

export function encrypt(text: string) {
  const encryptText = jsEncryptInstance.encrypt(text)
  return encryptText ? encryptText : ''
}

export function decrypt(text: string) {
  const decryptText = jsEncryptInstance.decrypt(text)
  return decryptText
}
