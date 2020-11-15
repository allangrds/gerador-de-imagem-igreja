import domtoimage from 'dom-to-image'

import {
  getChurchAddress,
  setChurchAddress,
} from '../../utils/localStorage'
import churchLogo from '../../../images/comunidade_belem.png'

function getContentFromForm (form) {
  const content = {}

  for (let i = 0; i < form.elements.length; i += 1) {
    const item = form.elements[i]

    if (item.value) {
      content[item.name] = item.value
    }
  }

  return content
}

function setElementValues (content) {
  if (content['preacher-message-title']) {
    document.getElementsByClassName('preacher-message-title')[0].innerHTML = `"${content['preacher-message-title']}"`
    document.getElementsByClassName('preacher-message-title')[0].style.display = 'block'
  } else {
    document.getElementsByClassName('preacher-message-title')[0].style.display = 'none'
  }

  document.getElementsByClassName('preacher-message-date')[0].innerHTML = content['preacher-message-date']
  document.getElementsByClassName('preacher-message-name')[0].innerHTML = content['preacher-name']
  document.getElementsByClassName('preacher-message-image')[0].src = content['preacher-image-url']

  if (content['church-logo-url']) {
    document.getElementsByClassName('preacher-message-church-logo')[0].src = `${content['church-logo-url']}`
  } else {
    document.getElementsByClassName('preacher-message-church-logo')[0].src = churchLogo
  }

  if (content['church-address']) {
    document.getElementsByClassName('preacher-message-church-address')[0].innerHTML = `${content['church-address']}`
  } else {
    document.getElementsByClassName('preacher-message-church-address')[0].innerHTML = 'Rua Martim Affonso, 152 - Belenzinho, São Paulo - SP, 03057-050'
  }
}

function viewImage () {
  const form = document.getElementById('form')

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const content = getContentFromForm(form)

    setElementValues(content)
  })
}

function saveChurchAddress (value) {
  setChurchAddress(value)
}

function retrieveChurchAddress () {
  const churchAddress = getChurchAddress()
  const churchAddressInput = document.getElementById('form-church-address')

  if (churchAddress) {
    churchAddressInput.value = churchAddress
  }
}

function saveImage () {
  const button = document.getElementById('btn-save-image')
  const div = document.getElementsByClassName('preacher-message-whatsapp')[0]
  const options = {
    height: 600,
    width: 400,
  }

  button.addEventListener('click', () => {
    domtoimage.toJpeg(div, options)
      .then((dataUrl) => {
        const form = document.getElementById('form')
        const content = getContentFromForm(form)

        saveChurchAddress(content['church-address'])

        const link = document.createElement('a')
        link.download = 'my-image-name.jpeg'
        link.href = dataUrl
        link.click()
      })
      .catch(() => alert('Erro ao gerar a imagem'))
  })
}

function retrieveInputValues () {
  retrieveChurchAddress()
}

function initScript () {
  viewImage()
  saveImage()
  retrieveInputValues()
}

export default initScript
