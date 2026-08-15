import { expect, test } from '@playwright/test'
import { collectPageErrors, loginAsAdmin } from './helpers/auth'

test.describe.serial('Order CRUD workflow', () => {
  test('queries, opens details, edits, validates creation and deletes an order', async ({
    page
  }) => {
    const errors = collectPageErrors(page)
    await loginAsAdmin(page, '/examples/pro-components/order-crud')
    await expect(page.getByRole('heading', { name: '订单管理' })).toBeVisible()

    const orderNo = 'SO-2026-00048'
    await page.getByPlaceholder('支持模糊查询').fill(orderNo)
    await page.getByRole('button', { name: '查询', exact: true }).click()

    const orderRow = page.locator('.el-table__body-wrapper tbody tr').filter({ hasText: orderNo })
    await expect(orderRow).toHaveCount(1)

    await orderRow.getByRole('button', { name: '查看', exact: true }).click()
    const detailDrawer = page.locator('.order-detail-drawer')
    await expect(detailDrawer).toBeVisible()
    await expect(detailDrawer.locator('.order-detail-drawer__heading small')).toHaveText(orderNo)
    await detailDrawer.locator('.el-drawer__close-btn').click()

    await orderRow.getByRole('button', { name: '编辑', exact: true }).click()
    const editDrawer = page.locator('.el-drawer').filter({ hasText: `编辑订单 ${orderNo}` })
    await expect(editDrawer).toBeVisible()
    const addressField = editDrawer.locator('.el-form-item').filter({ hasText: '收货地址' })
    await addressField.locator('textarea').fill('上海市浦东新区发布路 48 号')
    await editDrawer.getByRole('button', { name: '提交', exact: true }).click()
    await expect(page.getByText(`订单 ${orderNo} 更新成功`, { exact: true })).toBeVisible()
    await expect(editDrawer).toBeHidden()

    await page.getByRole('button', { name: '新建订单', exact: true }).click()
    const createDialog = page.getByRole('dialog').filter({ hasText: '新建订单' })
    await expect(createDialog).toBeVisible()
    await createDialog.getByRole('button', { name: '提交', exact: true }).click()
    await expect(createDialog.getByText('请选择客户', { exact: true })).toBeVisible()
    await page.keyboard.press('Escape')

    await orderRow.getByRole('button', { name: '删除', exact: true }).click()
    const popconfirm = page
      .locator('.el-popconfirm')
      .filter({ hasText: `确定删除订单 ${orderNo}？` })
    await popconfirm.getByRole('button', { name: '确定', exact: true }).click()
    await expect(page.getByText(`订单 ${orderNo} 已删除`, { exact: true })).toBeVisible()
    await expect(orderRow).toHaveCount(0)
    expect(errors).toEqual([])
  })
})
