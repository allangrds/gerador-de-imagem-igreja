const BASE_NAME = 'gerador_imagem_igreja_'
const CHURCH_ADDRESS = `${BASE_NAME}church_address`

export function getChurchAddress () {
  return localStorage.getItem(CHURCH_ADDRESS)
}

export function setChurchAddress (value) {
  localStorage.setItem(CHURCH_ADDRESS, value)
}
