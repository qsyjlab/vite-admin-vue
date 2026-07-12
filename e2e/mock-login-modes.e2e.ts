import { expect, test } from '@playwright/test'
import { collectPageErrors } from './helpers/auth'

/**
 * 三种权限模式模拟登录验证
 *
 * 1. ROUTE_MAPPING（路由 name 映射）：按用户拥有的路由 name 列表过滤
 * 2. ROLE（角色映射）：按路由 meta.roles 过滤
 * 3. BACKED（菜单映射）：后端返回菜单树，前端渲染
 *
 * 每种模式验证 admin / editor / viewer 三个账号的菜单差异化。
 */

async function selectMode(page: import('@playwright/test').Page, modeLabel: string) {
  // 页面有两个 select（账号 + 权限模式），权限模式是第二个
  await page.locator('.el-select__wrapper').nth(1).click()
  await page.getByRole('option', { name: modeLabel }).click()
}

async function loginWith(page: import('@playwright/test').Page, username: string) {
  await page.getByPlaceholder('用户名').fill(username)
  await page.getByPlaceholder('密码').fill('123456')
  await page.getByRole('button', { name: '登录', exact: true }).click()
}

async function getMenuTexts(page: import('@playwright/test').Page) {
  return page.locator('.el-menu-item, .el-sub-menu__title').allTextContents()
}

test.describe.serial('三种权限模式模拟登录', () => {
  test('ROUTE_MAPPING 模式 - admin 可看到全部菜单', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '路由 name 映射')
    await loginWith(page, 'admin')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('组件'))).toBeTruthy()
    expect(menus.some(t => t.includes('功能'))).toBeTruthy()
    expect(menus.some(t => t.includes('ECharts'))).toBeTruthy()
    expect(menus.some(t => t.includes('菜单管理'))).toBeTruthy()
    expect(menus.some(t => t.includes('外部页面'))).toBeTruthy()
    expect(menus.some(t => t.includes('示例中心'))).toBeTruthy()
    expect(menus.some(t => t.includes('文档'))).toBeTruthy()
    expect(menus.some(t => t.includes('异常页面'))).toBeTruthy()
    expect(menus.some(t => t.includes('关于'))).toBeTruthy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('ROUTE_MAPPING 模式 - editor 仅看到部分菜单', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '路由 name 映射')
    await loginWith(page, 'editor')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    // editor 有权限的
    expect(menus.some(t => t.includes('工作台'))).toBeTruthy()
    expect(menus.some(t => t.includes('ECharts'))).toBeTruthy()
    expect(menus.some(t => t.includes('组件'))).toBeTruthy()
    // editor 无权限的
    expect(menus.some(t => t.includes('菜单管理'))).toBeFalsy()
    expect(menus.some(t => t.includes('外部页面'))).toBeFalsy()
    expect(menus.some(t => t.includes('示例中心'))).toBeFalsy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('ROUTE_MAPPING 模式 - viewer 仅看到工作台和ECharts', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '路由 name 映射')
    await loginWith(page, 'viewer')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('工作台'))).toBeTruthy()
    expect(menus.some(t => t.includes('ECharts'))).toBeTruthy()
    // viewer 无权限的
    expect(menus.some(t => t.includes('组件'))).toBeFalsy()
    expect(menus.some(t => t.includes('功能'))).toBeFalsy()
    expect(menus.some(t => t.includes('菜单管理'))).toBeFalsy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('ROLE 模式 - admin(super) 可访问菜单管理', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '角色映射')
    await loginWith(page, 'admin')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('菜单管理'))).toBeTruthy()
    expect(menus.some(t => t.includes('组件'))).toBeTruthy()
    expect(menus.some(t => t.includes('功能'))).toBeTruthy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('ROLE 模式 - editor 不可访问菜单管理', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '角色映射')
    await loginWith(page, 'editor')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('菜单管理'))).toBeFalsy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('BACKED 模式 - admin 渲染完整后端菜单', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '菜单映射（后端菜单）')
    await loginWith(page, 'admin')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('工作台'))).toBeTruthy()
    expect(menus.some(t => t.includes('ECharts'))).toBeTruthy()
    expect(menus.some(t => t.includes('组件'))).toBeTruthy()
    expect(menus.some(t => t.includes('功能'))).toBeTruthy()
    expect(menus.some(t => t.includes('示例中心'))).toBeTruthy()
    expect(menus.some(t => t.includes('菜单管理'))).toBeTruthy()
    expect(menus.some(t => t.includes('外部页面'))).toBeTruthy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })

  test('BACKED 模式 - viewer 仅渲染工作台和ECharts', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto('/login')
    await selectMode(page, '菜单映射（后端菜单）')
    await loginWith(page, 'viewer')
    await page.waitForURL(/\/welcome/, { timeout: 20_000 })

    const menus = await getMenuTexts(page)
    expect(menus.some(t => t.includes('工作台'))).toBeTruthy()
    expect(menus.some(t => t.includes('ECharts'))).toBeTruthy()
    expect(menus.some(t => t.includes('功能'))).toBeFalsy()
    expect(menus.some(t => t.includes('组件'))).toBeFalsy()
    expect(menus.some(t => t.includes('菜单管理'))).toBeFalsy()
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([])
  })
})
