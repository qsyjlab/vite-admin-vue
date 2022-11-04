import { MailOutlined } from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMatches, useNavigate } from 'react-router-dom'
import { Logo } from '../../logo'
import { Pushpin } from '../icon'
import { routes } from '@/router'

import './mix-menu.less'
import { RouteRecordRaw } from '@/router/types'

interface IProps {
  menuWidth?: number
  headerHeight?: number
  theme?: MenuProps['theme']
  routes?: RouteRecordRaw[]
  fixedEvent?: (fixed: boolean) => void
}

export type MixMenuProps = Pick<IProps, 'fixedEvent'>

function MixMenu(props: IProps) {
  const { menuWidth = 240, headerHeight = 56, theme, routes = [] } = props

  const menuItems = routes
  const activeColor = '#1890ff'

  const [activeKey, setActiveKey] = useState('')
  const [activeChildren, setActiveChildren] = useState<RouteRecordRaw[]>([])
  const [showChildren, setShowChildren] = useState(false)
  const [fixed, setFixed] = useState(false)

  const matches = useMatches()
  const navigate = useNavigate()

  function transformRoutes(routes: RouteRecordRaw[]): any[] {
    const menuItems: MenuProps['items'] = []
    routes.forEach((item, index) => {
      menuItems.push({
        label: item.meta?.title || '',
        key: item.path || '',
        children:
          item?.children && Array.isArray(item.children)
            ? transformRoutes(item.children)
            : undefined
      })
    })
    return menuItems
  }
  const onClickMenu = (item: RouteRecordRaw) => {
    if (!item.id && !item.path) return

    item.id && setActiveKey(item.id)
    if (!item.children || !Array.isArray(item.children)) {
      // TODO: 利用id 或 增加一个name做跳转
      item.path && navigate(item.path)
      return
    }
    setActiveChildren(item?.children || [])
    setShowChildren(item.id ? true : false)
  }

  const onClickAntdMenu: MenuProps['onClick'] = parameter => {
    console.log('parameter', parameter)

    navigate(parameter.key)
  }

  const onClickFixedEventHandler = () => {
    setFixed(val => {
      props?.fixedEvent && props?.fixedEvent(!val)
      return !val
    })
  }

  const showChildrenHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log('event')
    e.preventDefault()
    !fixed && setShowChildren(false)
  }

  return (
    <div className="basic-layout-mix-menu">
      <div className="basic-layout-mix-menu-logo">
        <Logo width={showChildren ? menuWidth : 80} />
      </div>
      <div className="basic-layout-mix-menu-module">
        {menuItems?.map(item => {
          if (!item) return null
          return (
            <div
              className="basic-layout-mix-menu-module__item"
              key={item.id}
              onClick={() => onClickMenu(item)}
            >
              <div className="basic-layout-mix-menu-module__icon">
                <MailOutlined
                  style={{
                    color: item && item.id === activeKey ? activeColor : ''
                  }}
                />
              </div>
              <div
                className="basic-layout-mix-menu-module__label"
                style={{
                  color: item && item.id === activeKey ? activeColor : ''
                }}
              >
                {item.meta?.title}
              </div>

              {item.id === activeKey ? (
                <div
                  className="basic-layout-mix-menu-module__line"
                  style={{
                    backgroundColor: activeColor
                  }}
                />
              ) : null}
            </div>
          )
        })}
      </div>

      <div
        className="basic-layout-mix-menu-children"
        style={{
          width: fixed ? `${menuWidth}px` : '0px'
        }}
      >
        <div
          className="basic-layout-mix-menu-children__mask"
          style={{
            display: !fixed && showChildren ? 'block' : 'none'
          }}
          onMouseMove={showChildrenHandler}
        />
        <div
          className="basic-layout-mix-menu-children__content"
          style={{
            width: showChildren ? `${menuWidth}px` : '0px'
          }}
        >
          <div
            className="basic-layout-mix-menu-children-header"
            style={{
              backgroundColor: '#f7f8fa',
              height: headerHeight + 'px'
            }}
          >
            <div className="basic-layout-mix-menu-children-title">React Admin</div>
            <div
              className="basic-layout-mix-menu-children-header-icon"
              style={{
                color: 'rgba(0, 0, 0, 0.35)'
              }}
              onClick={onClickFixedEventHandler}
            >
              <Pushpin />
            </div>
          </div>

          <Menu
            selectedKeys={matches.map(item => item.pathname)}
            defaultOpenKeys={matches.map(item => item.pathname)}
            theme={theme}
            onClick={onClickAntdMenu}
            mode="inline"
            items={transformRoutes(activeChildren)}
          />
        </div>
      </div>
    </div>
  )
}

export default MixMenu
