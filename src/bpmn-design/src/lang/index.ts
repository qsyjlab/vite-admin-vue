import lang from './lang'

export function customTranslate(template, replacements?) {
  replacements = replacements || {}

  const translations = lang

  // Translate
  template = translations[template] || template

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements![key] || '{' + key + '}'
  })
}
