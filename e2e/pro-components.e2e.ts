import { expect, test } from '@playwright/test'
import { collectPageErrors, loginAsAdmin } from './helpers/auth'

test.describe('Pro Components critical interactions', () => {
  test('local dark provider styles every teleported popup', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-config-provider')

    await page.locator('.component-page-header__actions .el-switch').click()
    await expect(page.locator('.pro-config-provider.dark')).toHaveCount(1)

    await page
      .locator('.el-form-item')
      .filter({ hasText: '项目成员' })
      .locator('.el-select__wrapper')
      .click()
    await expect(page.locator('.el-select__popper.pro-config-provider-popper--dark')).toBeVisible()
    await page.keyboard.press('Escape')

    await page
      .locator('.el-form-item')
      .filter({ hasText: '交付日期' })
      .locator('.el-date-editor')
      .click()
    await expect(page.locator('.el-picker__popper.pro-config-provider-popper--dark')).toBeVisible()
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: '表格密度' }).focus()
    await page.keyboard.press('Enter')
    await expect(
      page.locator('.el-dropdown__popper.pro-config-provider-popper--dark')
    ).toBeVisible()
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: '列设置' }).click()
    await expect(page.locator('.el-popover.pro-config-provider-popper--dark')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('card supports controlled collapse and loading', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-card')

    await page.getByRole('button', { name: '收起内容' }).click()
    await expect(page.getByRole('button', { name: '展开内容' })).toBeVisible()
    await expect(page.getByText('需求确认', { exact: true })).toBeHidden()

    await page.locator('.component-page-header > .el-switch').click()
    await expect(page.locator('.el-skeleton')).toHaveCount(4)
    expect(errors).toEqual([])
  })

  test('list keeps selection across pages and renders grid and empty states', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-list')

    await page.locator('.pro-list__checkbox[aria-label="选择第 1 项"]').click()
    await expect(page.getByText('已选择 1 项', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: '下一页' }).click()
    await expect(page.locator('.el-pager li.is-active')).toHaveText('2')
    await expect(page.getByText('已选择 1 项', { exact: true })).toBeVisible()

    await page
      .locator('.component-page-header__actions .el-segmented__item')
      .filter({ hasText: '网格' })
      .click()
    await expect(page.locator('.pro-list__items')).toHaveCSS('display', 'grid')

    await page
      .locator('.component-page-header__actions .el-segmented__item')
      .filter({ hasText: '空状态' })
      .click()
    await expect(page.getByText('暂无列表数据', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('table direct route exposes reload, density and column settings', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-table/pro-table-basic')

    await expect(page).toHaveURL(/\/components\/pro-table\/pro-table-basic(?:\?.*)?$/)
    await expect(page.getByText('订单列表', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: '表格密度' })).toBeVisible()
    await expect(page.getByRole('button', { name: '列设置' })).toBeVisible()
    const amountHeader = page.getByRole('columnheader', { name: '订单金额' })
    const amountSortControl = amountHeader.locator('.caret-wrapper')
    await expect(amountSortControl).toHaveCount(1)
    const ascendingCaret = amountSortControl.locator('.sort-caret.ascending')
    const descendingCaret = amountSortControl.locator('.sort-caret.descending')
    await expect(ascendingCaret).toHaveCount(1)
    await expect(descendingCaret).toHaveCount(1)
    await ascendingCaret.click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get('orders.sorter'))
      .toContain('ascending')
    await expect(page.locator('.el-table__body-wrapper tbody tr').first()).toContainText(
      '¥9,600.00'
    )
    await amountSortControl.click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get('orders.sorter'))
      .toContain('descending')
    await expect(page.locator('.el-table__body-wrapper tbody tr').first()).toContainText(
      '¥54,400.00'
    )
    expect(errors).toEqual([])
  })

  test('form loads async values and exposes dirty state', async ({ page }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/components/pro-form/ref')

    await expect(page.getByText('表单已同步', { exact: true })).toBeVisible()
    const input = page.getByRole('textbox', { name: /文本输入/ })
    await expect(input).toHaveValue('demo')
    await input.fill('changed')
    await expect(page.getByText('表单有未保存修改', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: '重新加载' }).click()
    await expect(input).toHaveValue('demo')
    await expect(page.getByText('表单已同步', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('dashboard retries request failures without narrow-screen overflow', async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.setViewportSize({ width: 600, height: 900 })
    await loginAsAdmin(page, '/examples/pro-components/dashboard-list')

    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
        )
      )
      .toBe(true)

    await expect(page.locator('.pro-list__item')).toHaveCount(4)
    await page.getByRole('button', { name: '模拟失败' }).click()
    const errorAlert = page.locator('.pro-list__error')
    await expect(errorAlert).toBeVisible()
    await expect(errorAlert).toContainText('模拟服务暂时不可用')
    await errorAlert.getByRole('button', { name: '重新加载' }).click()
    await expect(errorAlert).toBeHidden()
    await expect(page.locator('.pro-list__item')).toHaveCount(4)
    expect(errors).toEqual([])
  })
})
