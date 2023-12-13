import lang from './lang'
import translations from './lang'

export function customTranslate(template, replacements?) {
  replacements = replacements || lang

  // Translate
  template = translations[template] || template

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}'
  })
}
