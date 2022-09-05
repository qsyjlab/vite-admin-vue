export interface UrlType {
  baseUrl: {
    system: string
  }
  fileUrl: {
    file: string
  }
}

export interface ReadOnlyConfig {
  readonly storage: {
    prefix: string
    expires: number
  }
  readonly axios: {
    headers: {
      Authorization: string
    }
  }
  readonly url: UrlType
}
