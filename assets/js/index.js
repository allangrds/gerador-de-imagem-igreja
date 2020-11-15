import domtoimage from 'dom-to-image'

import {
  getChurchAddress,
  setChurchAddress,
} from './localStorage'
import churchLogo from '../images/comunidade_belem.png'

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
  if (content.message) {
    document.getElementsByClassName('message')[0].innerHTML = `"${content.message}"`
    document.getElementsByClassName('message')[0].style.display = 'block'
  } else {
    document.getElementsByClassName('message')[0].style.display = 'none'
  }

  document.getElementsByClassName('message-date')[0].innerHTML = `${content['message-date']}`
  document.getElementsByClassName('preacher')[0].innerHTML = `${content.preacher}`
  document.getElementsByClassName('preacher-image')[0].src = `${content['preacher-image']}`

  if (content['church-logo']) {
    document.getElementsByClassName('church-logo')[0].src = `${content['church-logo']}`
  } else {
    document.getElementsByClassName('church-logo')[0].src = churchLogo
  }

  if (content['church-address']) {
    document.getElementsByClassName('church-address')[0].innerHTML = `${content['church-address']}`
  } else {
    document.getElementsByClassName('church-address')[0].innerHTML = 'Rua Martim Affonso, 152 - Belenzinho, São Paulo - SP, 03057-050'
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
  const churchAddressInput = document.getElementById('church-address')

  if (churchAddress) {
    churchAddressInput.value = churchAddress
  }
}

function saveImage () {
  const button = document.getElementById('btn-save-image')
  const div = document.getElementById('generated-image')
  const options = {
    height: 550,
    width: 500,
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

document.addEventListener('DOMContentLoaded', () => {
  viewImage()
  saveImage()
  retrieveInputValues()
})
