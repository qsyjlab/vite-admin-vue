import type { JSON2SheetOpts, WritingOptions, WorkBook, WorkSheet } from 'xlsx'
import * as xlsx from 'xlsx'
import { fileReader } from '../file'
import { dayJsFormatDate } from '../date'

/**
 * @fork https://github.com/vbenjs/vue-vben-admin
 */
const { writeFile, utils, read } = xlsx

const DEFAULT_SHEET_NAME = 'sheet'

export interface ExcelData<T = any> {
  header: string[]
  results: T[]
  meta: { sheetName: string }
}

export interface AoAToSheet<T = any> {
  data: T[][]
  header?: T[]
  merges?: any[]
  filename?: string
  sheetName?: string
  write2excelOpts?: WritingOptions
}

export interface JsonToSheet<T = any> {
  data: T[]
  header?: T
  filename?: string
  sheetName?: string
  merges?: any[]
  json2sheetOpts?: JSON2SheetOpts
  write2excelOpts?: WritingOptions
}

export interface JsonToMultipleSheet<T = any> {
  sheetList: JsonToSheet<T>[]
  filename?: string
  write2excelOpts?: WritingOptions
}

export interface AoaToMultipleSheet<T = any> {
  sheetList: AoAToSheet<T>[]
  filename?: string
  write2excelOpts?: WritingOptions
}

// json 数据导出
export function jsonToSheetXlsx<T = any>({
  data,
  header,
  merges = [],
  filename = `${new Date().getTime()}.xlsx`,
  sheetName = DEFAULT_SHEET_NAME,
  json2sheetOpts = {},
  write2excelOpts = { bookType: 'xlsx' }
}: JsonToSheet<T>) {
  const arrData = [...data]
  if (header) {
    arrData.unshift(header)
    json2sheetOpts.skipHeader = true
  }
  const worksheet = xlsx.utils.json_to_sheet(arrData, json2sheetOpts)
  worksheet['!merges'] = merges
  setColumnWidth(arrData, worksheet)
  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: worksheet
    }
  }
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts)
  /* at this point, out.xlsb will have been downloaded */
}

// 纯数组导出
export function aoaToSheetXlsx<T = any>({
  data,
  header,
  merges = [],
  filename = `${new Date().getTime()}.xlsx`,
  write2excelOpts = { bookType: 'xlsx' }
}: AoAToSheet<T>) {
  const arrData = [...data]
  if (header) {
    arrData.unshift(header)
  }

  const worksheet = utils.aoa_to_sheet(arrData)
  worksheet['!merges'] = merges

  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: worksheet
    }
  }
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts)
  /* at this point, out.xlsb will have been downloaded */
}

export function jsonToMultipleSheetXlsx<T = any>({
  sheetList,
  filename = `${new Date().getTime()}.xlsx`,
  write2excelOpts = { bookType: 'xlsx' }
}: JsonToMultipleSheet<T>) {
  const workbook: WorkBook = {
    SheetNames: [],
    Sheets: {}
  }
  sheetList.forEach((p, index) => {
    const arrData = [...p.data]
    if (p.header) {
      arrData.unshift(p.header)
      p.json2sheetOpts = p.json2sheetOpts || {}
      p.json2sheetOpts.skipHeader = true
    }

    const worksheet = utils.json_to_sheet(arrData, p.json2sheetOpts)
    setColumnWidth(arrData, worksheet)

    p.sheetName = p.sheetName || `${DEFAULT_SHEET_NAME}${index}`
    workbook.SheetNames.push(p.sheetName)
    workbook.Sheets[p.sheetName] = worksheet
  })
  writeFile(workbook, filename, write2excelOpts)
}

export function aoaToMultipleSheetXlsx<T = any>({
  sheetList,
  filename = `${new Date().getTime()}.xlsx`,
  write2excelOpts = { bookType: 'xlsx' }
}: AoaToMultipleSheet<T>) {
  const workbook: WorkBook = {
    SheetNames: [],
    Sheets: {}
  }
  sheetList.forEach((p, index) => {
    const arrData = [...p.data]
    if (p.header) {
      arrData.unshift(p.header)
    }
    const worksheet = utils.aoa_to_sheet(arrData)

    p.sheetName = p.sheetName || `${DEFAULT_SHEET_NAME}${index}`
    workbook.SheetNames.push(p.sheetName)
    workbook.Sheets[p.sheetName] = worksheet
  })
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts)
  /* at this point, out.xlsb will have been downloaded */
}

function setColumnWidth(data, worksheet, min = 3) {
  const obj = {}
  worksheet['!cols'] = []
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      const cur = item[key]
      const length = cur?.length ?? min
      obj[key] = Math.max(length, obj[key] ?? min)
    })
  })
  Object.keys(obj).forEach(key => {
    worksheet['!cols'].push({
      wch: obj[key]
    })
  })
}

export function getExcelData(
  workbook: xlsx.WorkBook,
  options?: { timeZone: any; dateFormat: string }
) {
  const { timeZone, dateFormat } = options || {}
  const excelData: ExcelData[] = []

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const header: string[] = getHeaderRow(worksheet)
    let results = utils.sheet_to_json(worksheet, {
      raw: true
    }) as object[]
    results = results.map((row: object) => {
      for (const field in row) {
        if (row[field] instanceof Date) {
          if (timeZone === 8) {
            row[field].setSeconds(row[field].getSeconds() + 43)
          }
          if (dateFormat) {
            row[field] = dayJsFormatDate(row[field], dateFormat)
          }
        }
      }
      return row
    })

    excelData.push({
      header,
      results,
      meta: {
        sheetName
      }
    })
  }
  return excelData
}

function getHeaderRow(sheet: WorkSheet) {
  if (!sheet || !sheet['!ref']) return []
  const headers: string[] = []
  // A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
  const range: xlsx.Range = utils.decode_range(sheet['!ref'])
  // shapeWorkSheel(sheet, range)
  const R = range.s.r
  /* start in the first row */
  for (let C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = '' // <-- replace with your desired default
    if (cell && cell.t) hdr = utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

export async function xlsxFileReader(rawFile: File) {
  try {
    const result = await fileReader(rawFile)
    const workbook = read(result, { type: 'array', cellDates: true })

    const excelData = getExcelData(workbook)
    return excelData
  } catch (error) {
    return []
  }
}
