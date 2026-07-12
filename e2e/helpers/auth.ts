import type { Page } from '@playwright/test'

export async function loginAsAdmin(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`)
  await page.getByPlaceholder('请输入用户名').fill('admin')
  await page.getByPlaceholder('请输入密码').fill('123456')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await page.waitForURL(
    url => url.pathname === redirect || url.pathname.startsWith(`${redirect}/`),
    { timeout: 20_000 }
  )
}

export function collectPageErrors(page: Page) {
  const errors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}
