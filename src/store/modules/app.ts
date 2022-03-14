/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 10:51:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 16:03:37
 */
// import { storage } from '@plugins/methods'

import type { Module } from 'vuex'

const appMoudle: Module<VStoreRoot.app.appRootState, VStoreRoot.rootState> = {
    namespaced: true,
    state: {
        keepAliveList: {},
        layoutConfig: {
            // 是否折叠 菜单栏
            isCollapse: false,
            themeColor: '#409eff'
            // keepAliveList: ['']
        }
    },
    mutations: {
        // 折叠菜单栏
        collapseMenu(state) {
            state.layoutConfig.isCollapse = !state.layoutConfig.isCollapse
        },
        // 设置
        setLayoutConfig(state, val) {
            state.layoutConfig = { ...state.layoutConfig, ...val }

            const getThemeCluster = (themeColor: any): any => {
                const theme = themeColor.replace(/#/, '')

                const tintColor = (color: any, tint: any): any => {
                    let red: any = parseInt(color.slice(0, 2), 16)
                    let green: any = parseInt(color.slice(2, 4), 16)
                    let blue: any = parseInt(color.slice(4, 6), 16)

                    if (tint === 0) {
                        // when primary color is in its rgb space
                        return [red, green, blue].join(',')
                    } else {
                        red += Math.round(tint * (255 - red))
                        green += Math.round(tint * (255 - green))
                        blue += Math.round(tint * (255 - blue))

                        red = red.toString(16)
                        green = green.toString(16)
                        blue = blue.toString(16)

                        return `#${red}${green}${blue}`
                    }
                }

                const shadeColor = (color: any, shade: any): any => {
                    let red: any = parseInt(color.slice(0, 2), 16)
                    let green: any = parseInt(color.slice(2, 4), 16)
                    let blue: any = parseInt(color.slice(4, 6), 16)

                    red = Math.round((1 - shade) * red)
                    green = Math.round((1 - shade) * green)
                    blue = Math.round((1 - shade) * blue)

                    red = red.toString(16)
                    green = green.toString(16)
                    blue = blue.toString(16)

                    return `#${red}${green}${blue}`
                }

                const clusters = [themeColor]
                for (let i = 1; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
                }
                clusters.push(shadeColor(theme, 0.1))
                return clusters
            }
            const updateElementStyle = (colorList: string[]): void => {
                // document.documentElement is global
                const el = document.documentElement
                // set css var
                el.style.setProperty('--el-color-primary', colorList[0])
                // el.style.setProperty('--el-button-bg-color', colorList[0])
                el.style.setProperty('--el-button-active-bg-color', colorList[10])
                el.style.setProperty('--el-button-active-border-color', colorList[10])

                for (let index = 1; index <= 9; index++) {
                    el.style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
                }
            }
            updateElementStyle(getThemeCluster(state.layoutConfig.themeColor))

            // $storage.set('layoutConfig', state.layoutConfig)
        },
        addAlive(state, { page, name = 'default', alive }: { page: string; name: string; alive: string }) {
            if (!state.keepAliveList[page]) {
                state.keepAliveList = {
                    ...state.keepAliveList,
                    [page]: { [name]: [alive] }
                }
                return
            }
            if (!Array.isArray(state.keepAliveList[page][name])) {
                state.keepAliveList[page] = {
                    ...state.keepAliveList[page],
                    [name]: [alive]
                }

                return
            }
            if (!state.keepAliveList[page][name].includes(alive)) {
                state.keepAliveList[page][name].push(alive)
            }

            console.log('keepAliveList', state.keepAliveList)
        }
    },
    getters: {
        getAlive:
            ({ keepAliveList }) =>
            (page: any, name = 'default'): string[] => {
                const list = keepAliveList[page]?.[name]
                return Array.isArray(list) ? list : []
            }
    },
    actions: {}
}

export default appMoudle
