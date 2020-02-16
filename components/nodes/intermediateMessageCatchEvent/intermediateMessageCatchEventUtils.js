function isMessageElement(element) {
  return element.$type === 'bpmn:Message'
}

function toDropdownFormat(element) {
  return {
    value: element.get('id'),
    content: element.get('name')
  }
}

export function getMessagesList(store) {
  return this.$store.getters.rootElements
    .filter(isMessageElement)
    .map(toDropdownFormat)
}

export function getMessage(store, id) {
  return this.$store.getters.rootElements.find(
    (element) => element.get('id') === id
  )
}
