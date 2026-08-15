import { ElInputNumber } from 'element-plus'
import {
  ProSelect,
  type ProDescriptionColumns,
  type ProFieldValueEnum,
  type ProFormSchema,
  type ProTableColumns,
  type ProTableRenderScope
} from '@framebase/element-plus-pro-components'
import type {
  OrderDetail,
  OrderFormModel,
  OrderItem,
  OrderMeta,
  OrderQuery,
  OrderRecord
} from '@/api/order'

export interface OrderSearchModel extends OrderQuery {
  createdRange?: string[]
}

export const orderStatusValueEnum = {
  pending: { text: '待处理', type: 'warning' },
  processing: { text: '处理中', type: 'primary' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'info' }
} as const satisfies ProFieldValueEnum

export const orderPriorityValueEnum = {
  normal: { text: '普通', type: 'info' },
  high: { text: '高', type: 'warning' },
  urgent: { text: '紧急', type: 'danger' }
} as const satisfies ProFieldValueEnum

export const orderDescriptionGroupTitles = {
  basic: '基础信息',
  delivery: '履约信息',
  system: '系统信息'
} as const

export const tableColumns: ProTableColumns<OrderRecord> = [
  {
    key: 'order-number',
    dataIndex: 'orderNo',
    title: '订单编号',
    width: 164,
    fixed: 'left'
  },
  {
    key: 'customer-name',
    dataIndex: ['customer', 'name'],
    title: '客户名称',
    minWidth: 180
  },
  {
    key: 'owner',
    dataIndex: 'owner',
    title: '负责人',
    width: 112
  },
  {
    key: 'priority',
    dataIndex: 'priority',
    title: '优先级',
    width: 96,
    valueType: 'status',
    valueEnum: orderPriorityValueEnum
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 104,
    valueType: 'status',
    valueEnum: orderStatusValueEnum
  },
  {
    key: 'order-amount',
    dataIndex: 'amount',
    title: '订单金额',
    width: 136,
    align: 'right',
    valueType: { type: 'money', currency: 'CNY' }
  },
  {
    key: 'item-count',
    dataIndex: 'itemCount',
    title: '商品数',
    width: 92,
    align: 'right',
    formatter: value => `${Number(value) || 0} 项`
  },
  {
    key: 'progress',
    dataIndex: 'progress',
    title: '履约进度',
    width: 148,
    valueType: 'progress',
    fieldProps: { strokeWidth: 8 }
  },
  {
    key: 'expected-delivery-date',
    dataIndex: 'expectedDeliveryDate',
    title: '预计交付',
    width: 124,
    valueType: 'date'
  },
  {
    key: 'created-at',
    dataIndex: 'createdAt',
    title: '创建时间',
    width: 176,
    valueType: 'datetime'
  },
  {
    key: 'operation',
    title: '操作',
    width: 168,
    fixed: 'right'
  }
]

export const searchFields = (meta?: OrderMeta): ProFormSchema<OrderSearchModel> => [
  {
    key: 'search-order-number',
    name: 'orderNo',
    label: '订单编号',
    valueType: 'text',
    fieldProps: { clearable: true, placeholder: '支持模糊查询' },
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'search-customer-name',
    name: 'customerName',
    label: '客户名称',
    valueType: 'text',
    fieldProps: { clearable: true, placeholder: '输入客户名称' },
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'search-owner',
    name: 'owner',
    label: '负责人',
    valueType: 'select',
    options: meta?.owners ?? [],
    fieldProps: { clearable: true, filterable: true },
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'search-status',
    name: 'status',
    label: '订单状态',
    valueType: 'select',
    valueEnum: orderStatusValueEnum,
    fieldProps: { clearable: true },
    col: { span: 8, xs: 24, sm: 12, md: 8 }
  },
  {
    key: 'search-created-range',
    name: 'createdRange',
    label: '创建日期',
    valueType: 'date',
    fieldProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      unlinkPanels: true
    },
    col: { span: 16, xs: 24, sm: 24, md: 16 }
  }
]

export const formFields = (meta?: OrderMeta): ProFormSchema<OrderFormModel> => [
  {
    key: 'customer-field',
    name: 'customerId',
    label: '客户',
    valueType: 'select',
    options: meta?.customers ?? [],
    required: true,
    requiredMessage: '请选择客户',
    fieldProps: { filterable: true, clearable: true },
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'owner-field',
    name: 'owner',
    label: '负责人',
    valueType: 'select',
    options: meta?.owners ?? [],
    required: true,
    requiredMessage: '请选择负责人',
    fieldProps: { filterable: true, clearable: true },
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'status-field',
    name: 'status',
    label: '订单状态',
    valueType: 'radio',
    valueEnum: orderStatusValueEnum,
    required: true,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'priority-field',
    name: 'priority',
    label: '优先级',
    valueType: 'radio',
    valueEnum: orderPriorityValueEnum,
    required: true,
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'delivery-date-field',
    name: 'expectedDeliveryDate',
    label: '预计交付',
    valueType: 'date',
    required: true,
    requiredMessage: '请选择预计交付日期',
    fieldProps: { clearable: true },
    col: { span: 12, xs: 24, sm: 12 }
  },
  {
    key: 'shipping-address-field',
    name: 'shippingAddress',
    label: '收货地址',
    valueType: 'textarea',
    required: true,
    requiredMessage: '请输入收货地址',
    normalize: value => String(value ?? '').trimStart(),
    fieldProps: { rows: 2, maxlength: 160, showWordLimit: true },
    col: { span: 24 }
  },
  {
    key: 'items-field',
    name: 'items',
    label: '订单明细',
    rules: [
      {
        type: 'array',
        required: true,
        min: 1,
        message: '至少添加一条订单明细'
      }
    ],
    col: { span: 24 }
  },
  {
    key: 'remark-field',
    name: 'remark',
    label: '订单备注',
    valueType: 'textarea',
    normalize: value => String(value ?? '').trimStart(),
    fieldProps: { rows: 3, maxlength: 300, showWordLimit: true },
    col: { span: 24 }
  }
]

export const descriptionColumns: ProDescriptionColumns<OrderDetail> = [
  {
    key: 'description-order-number',
    dataIndex: 'orderNo',
    label: '订单编号',
    group: 'basic',
    copyable: true
  },
  {
    key: 'description-customer-name',
    dataIndex: ['customer', 'name'],
    label: '客户名称',
    group: 'basic'
  },
  {
    key: 'description-customer-contact',
    dataIndex: ['customer', 'contact'],
    label: '联系人',
    group: 'basic'
  },
  {
    key: 'description-customer-phone',
    dataIndex: ['customer', 'phone'],
    label: '联系电话',
    group: 'basic',
    copyable: true
  },
  {
    key: 'description-owner',
    dataIndex: 'owner',
    label: '负责人',
    group: 'basic'
  },
  {
    key: 'description-priority',
    dataIndex: 'priority',
    label: '优先级',
    group: 'basic',
    valueType: 'status',
    valueEnum: orderPriorityValueEnum
  },
  {
    key: 'description-status',
    dataIndex: 'status',
    label: '订单状态',
    group: 'delivery',
    valueType: 'status',
    valueEnum: orderStatusValueEnum
  },
  {
    key: 'description-progress',
    dataIndex: 'progress',
    label: '履约进度',
    group: 'delivery',
    valueType: 'progress',
    fieldProps: { strokeWidth: 8 }
  },
  {
    key: 'description-delivery-date',
    dataIndex: 'expectedDeliveryDate',
    label: '预计交付',
    group: 'delivery',
    valueType: 'date'
  },
  {
    key: 'description-item-count',
    dataIndex: 'itemCount',
    label: '商品数量',
    group: 'delivery',
    formatter: value => `${Number(value) || 0} 项`
  },
  {
    key: 'description-amount',
    dataIndex: 'amount',
    label: '订单金额',
    group: 'delivery',
    valueType: { type: 'money', currency: 'CNY' }
  },
  {
    key: 'description-shipping-address',
    dataIndex: 'shippingAddress',
    label: '收货地址',
    group: 'delivery',
    span: { xs: 1, sm: 2, md: 2 },
    copyable: true
  },
  {
    key: 'description-created-at',
    dataIndex: 'createdAt',
    label: '创建时间',
    group: 'system',
    valueType: 'datetime'
  },
  {
    key: 'description-updated-at',
    dataIndex: 'updatedAt',
    label: '更新时间',
    group: 'system',
    valueType: 'datetime'
  },
  {
    key: 'description-remark',
    dataIndex: 'remark',
    label: '订单备注',
    group: 'system',
    span: { xs: 1, sm: 2, md: 2 },
    emptyText: '无'
  }
]

export const itemColumns = (meta?: OrderMeta): ProTableColumns<OrderItem> => {
  const products = meta?.products ?? []
  const productValueEnum = Object.fromEntries(
    products.map(product => [product.value, { text: product.label }])
  ) satisfies ProFieldValueEnum

  return [
    {
      key: 'item-product',
      dataIndex: 'productId',
      title: '商品',
      minWidth: 184,
      valueType: 'select',
      valueEnum: productValueEnum,
      editable: true,
      editableRules: [{ required: true, message: '请选择商品' }],
      rowComponent: {
        el: ProSelect,
        props: scope => ({
          options: products,
          filterable: true,
          clearable: true,
          placeholder: '选择商品',
          onChange: (productId?: string) => {
            applyOrderProduct(resolveEditingItem(scope), productId, meta)
          }
        })
      }
    },
    {
      key: 'item-sku',
      dataIndex: 'sku',
      title: 'SKU',
      width: 132,
      emptyText: '-',
      editable: false
    },
    {
      key: 'item-quantity',
      dataIndex: 'quantity',
      title: '数量',
      width: 124,
      align: 'right',
      valueType: 'number',
      editable: true,
      editableRules: [
        {
          validator: value => Number(value) > 0 || '数量必须大于 0'
        }
      ],
      rowComponent: createNumberEditor('quantity', { min: 1, max: 9999, precision: 0 })
    },
    {
      key: 'item-unit-price',
      dataIndex: 'unitPrice',
      title: '单价',
      width: 144,
      align: 'right',
      valueType: { type: 'money', currency: 'CNY' },
      editable: true,
      editableRules: [
        {
          validator: value => Number(value) >= 0 || '单价不能小于 0'
        }
      ],
      rowComponent: createNumberEditor('unitPrice', {
        min: 0,
        max: 9999999,
        precision: 2,
        step: 100
      })
    },
    {
      key: 'item-discount-rate',
      dataIndex: 'discountRate',
      title: '折扣',
      width: 128,
      align: 'right',
      valueType: 'percent',
      editable: true,
      editableRules: [
        {
          validator: value => {
            const rate = Number(value)
            return (rate >= 0 && rate <= 100) || '折扣应在 0 到 100 之间'
          }
        }
      ],
      rowComponent: createNumberEditor('discountRate', {
        min: 0,
        max: 100,
        precision: 2
      })
    },
    {
      key: 'item-line-amount',
      dataIndex: 'lineAmount',
      title: '小计',
      width: 148,
      align: 'right',
      valueType: { type: 'money', currency: 'CNY' },
      editable: false
    }
  ]
}

export function normalizeOrderSearch(values: OrderSearchModel): OrderQuery {
  const { createdRange, ...query } = values
  return {
    ...query,
    createdFrom: createdRange?.[0] || undefined,
    createdTo: createdRange?.[1] || undefined
  }
}

export function createOrderFormModel(detail?: OrderDetail): OrderFormModel {
  if (!detail) {
    return {
      customerId: '',
      owner: '',
      status: 'pending',
      priority: 'normal',
      expectedDeliveryDate: '',
      shippingAddress: '',
      remark: '',
      items: []
    }
  }

  return {
    id: detail.id,
    orderNo: detail.orderNo,
    customerId: detail.customer.id,
    owner: detail.owner,
    status: detail.status,
    priority: detail.priority,
    expectedDeliveryDate: detail.expectedDeliveryDate,
    shippingAddress: detail.shippingAddress,
    remark: detail.remark,
    items: detail.items.map(normalizeOrderItem)
  }
}

let newItemSequence = 0

export function createOrderItem(): OrderItem {
  newItemSequence += 1
  return {
    id: `new-item-${Date.now()}-${newItemSequence}`,
    productId: '',
    productName: '',
    sku: '',
    quantity: 1,
    unitPrice: 0,
    discountRate: 0,
    lineAmount: 0
  }
}

export function normalizeOrderItem(item: OrderItem): OrderItem {
  const quantity = Math.max(1, Math.trunc(toFiniteNumber(item.quantity)))
  const unitPrice = Math.max(0, roundMoney(toFiniteNumber(item.unitPrice)))
  const discountRate = Math.min(100, Math.max(0, roundMoney(toFiniteNumber(item.discountRate))))
  return {
    ...item,
    quantity,
    unitPrice,
    discountRate,
    lineAmount: calculateOrderLineAmount({ quantity, unitPrice, discountRate })
  }
}

export function calculateOrderLineAmount(
  item: Pick<OrderItem, 'quantity' | 'unitPrice' | 'discountRate'>
) {
  return roundMoney(item.quantity * item.unitPrice * (1 - item.discountRate / 100))
}

export function calculateOrderAmount(items: OrderItem[]) {
  return roundMoney(items.reduce((total, item) => total + normalizeOrderItem(item).lineAmount, 0))
}

function applyOrderProduct(item: OrderItem, productId: string | undefined, meta?: OrderMeta) {
  const product = meta?.products.find(option => option.value === productId)
  item.productId = product?.value ?? ''
  item.productName = product?.label ?? ''
  item.sku = product?.sku ?? ''
  item.unitPrice = product?.unitPrice ?? 0
  recalculateOrderItem(item)
}

function createNumberEditor(
  field: 'quantity' | 'unitPrice' | 'discountRate',
  props: Record<string, unknown>
) {
  return {
    el: ElInputNumber,
    props: (scope: ProTableRenderScope<OrderItem>) => ({
      ...props,
      controlsPosition: 'right',
      onChange: (value?: number) => {
        const item = resolveEditingItem(scope)
        item[field] = toFiniteNumber(value)
        recalculateOrderItem(item)
      }
    })
  }
}

function resolveEditingItem(scope: ProTableRenderScope<OrderItem>) {
  return scope.editableState?.data ?? scope.row
}

function recalculateOrderItem(item: OrderItem) {
  Object.assign(item, normalizeOrderItem(item))
}

function toFiniteNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}
