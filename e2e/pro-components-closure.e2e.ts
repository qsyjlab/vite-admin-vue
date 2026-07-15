import { expect, test } from '@playwright/test'
import { collectPageErrors, loginAsAdmin } from './helpers/auth'

test.describe('Pro Components closure interactions', () => {
  test('check card supports keyboard navigation, validation and narrow dark layout', async ({
    page
  }) => {
    const errors = collectPageErrors(page)
    await page.setViewportSize({ width: 600, height: 900 })
    await loginAsAdmin(page, '/components/pro-check-card')
    await page.evaluate(() => document.documentElement.classList.add('dark'))

    const starter = page.getByRole('radio', { name: /基础版/ })
    const growth = page.getByRole('radio', { name: /成长版/ })
    await starter.focus()
    await page.keyboard.press('ArrowRight')
    await expect(growth).toBeFocused()
    await page.keyboard.press('Space')
    await expect(growth).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByText('成长版', { exact: true }).last()).toBeVisible()

    await page.getByRole('button', { name: '保存配置' }).click()
    await expect(page.getByText('至少开通一个业务模块')).toBeVisible()
    await page.getByRole('checkbox', { name: /数据分析/ }).click()
    await page.getByRole('button', { name: '保存配置' }).click()
    await expect(page.getByText('套餐配置已保存')).toBeVisible()
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
        )
      )
      .toBe(true)
    expect(errors).toEqual([])
  })

  test('tree select restores an async selected path and exposes reload actions', async ({
    page
  }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/tree/tree-select')

    await expect(page.getByText('赵敏 · 前端负责人', { exact: true }).first()).toBeVisible()
    await expect(page.getByText(/技术中心 \/ 赵敏 · 前端负责人/)).toBeVisible()
    await page.getByRole('button', { name: '刷新选中路径' }).click()
    await expect(page.getByText('success', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('tree preserves its error state and recovers through ProEmpty retry', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/tree/base')

    await expect(page.getByText('前端架构组', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: '模拟失败' }).click()
    await expect(page.getByText('组织服务暂时不可用', { exact: true })).toBeVisible()
    await page.locator('.pro-tree__error').getByRole('button', { name: '重新加载' }).click()
    await expect(page.getByText('前端架构组', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('modal and drawer protect dirty values before closing', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-form/modal')

    await page.getByRole('button', { name: '新建' }).click()
    const dialog = page.locator('.el-dialog')
    await dialog.locator('.el-input input').first().fill('尚未保存的合同')
    page.once('dialog', confirmation => confirmation.dismiss())
    await dialog.locator('.el-dialog__headerbtn').click()
    await expect(dialog).toBeVisible()
    page.once('dialog', confirmation => confirmation.accept())
    await dialog.locator('.el-dialog__headerbtn').click()
    await expect(dialog).toBeHidden()

    await page.goto('/components/pro-form/drawer')
    await page.getByRole('button', { name: '打开抽屉' }).click()
    const drawer = page.getByRole('dialog', { name: '编辑项目配置' })
    await drawer.locator('.el-input input').first().fill('尚未保存的项目')
    page.once('dialog', confirmation => confirmation.dismiss())
    await drawer.locator('.el-drawer__close-btn').click()
    await expect(drawer).toBeVisible()
    page.once('dialog', confirmation => confirmation.accept())
    await drawer.locator('.el-drawer__close-btn').click()
    await expect(drawer).toBeHidden()
    expect(errors).toEqual([])
  })

  test('table synchronizes pagination and sorter state to the URL', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-table')

    await expect.poll(() => new URL(page.url()).searchParams.get('orders.current')).toBe('1')
    await page.getByRole('button', { name: '下一页' }).click()
    await expect.poll(() => new URL(page.url()).searchParams.get('orders.current')).toBe('2')
    await expect(page.locator('html')).not.toHaveClass(/nprogress-busy/)
    await page
      .getByRole('columnheader', { name: '订单金额' })
      .locator('.sort-caret.ascending')
      .click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get('orders.sorter'))
      .toContain('amount')
    expect(errors).toEqual([])
  })

  test('result-backed error pages fill the viewport and expose recovery actions', async ({
    page
  }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/exception/403')

    const titles = { '403': '暂无访问权限', '404': '页面不存在', '500': '服务暂时不可用' }
    for (const status of ['403', '404', '500'] as const) {
      await page.goto(`/exception/${status}`)
      await expect(page.getByRole('status')).toBeVisible()
      await expect(page.getByRole('heading', { name: titles[status] })).toBeVisible()
      await expect
        .poll(() => page.locator('.error-page').evaluate(element => element.clientHeight))
        .toBeGreaterThan(400)
    }
    expect(errors).toEqual([])
  })
})
