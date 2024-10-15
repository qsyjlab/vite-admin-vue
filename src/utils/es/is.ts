export function isEmptyValue(value: unknown) {
  return value === '' || value === null || value === undefined
}

/**
 * 是否是合法的 base64
 */
export function isValidBase64(str) {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,([a-z0-9\+\/]+=*)$/i
  return regex.test(str)
}
