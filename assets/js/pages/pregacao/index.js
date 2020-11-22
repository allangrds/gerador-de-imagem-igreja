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
      if (item.type === 'file') {
        content[item.name] = item.files
      } else {
        content[item.name] = item.value
      }
    }
  }

  return content
}

function setElementValues (content) {
  if (content['preacher-message-title']) {
    document.getElementsByClassName('preacher-message-title')[0].innerHTML = `"${content['preacher-message-title']}"`
    document.getElementsByClassName('preacher-message-title')[1].innerHTML = `"${content['preacher-message-title']}"`
    document.getElementsByClassName('preacher-message-title')[2].innerHTML = `"${content['preacher-message-title']}"`
    document.getElementsByClassName('preacher-message-title')[0].style.display = 'block'
    document.getElementsByClassName('preacher-message-title')[1].style.display = 'block'
    document.getElementsByClassName('preacher-message-title')[2].style.display = 'block'
  } else {
    document.getElementsByClassName('preacher-message-title')[0].style.display = 'none'
    document.getElementsByClassName('preacher-message-title')[1].style.display = 'none'
    document.getElementsByClassName('preacher-message-title')[2].style.display = 'none'
  }

  document.getElementsByClassName('preacher-message-date')[0].innerHTML = content['preacher-message-date']
  document.getElementsByClassName('preacher-message-date')[1].innerHTML = content['preacher-message-date']
  document.getElementsByClassName('preacher-message-date')[2].innerHTML = content['preacher-message-date']
  document.getElementsByClassName('preacher-message-name')[0].innerHTML = content['preacher-name']
  document.getElementsByClassName('preacher-message-name')[1].innerHTML = content['preacher-name']
  document.getElementsByClassName('preacher-message-name')[2].innerHTML = content['preacher-name']

  if (content['preacher-image-url']) {
    document.getElementsByClassName('preacher-message-image')[0].src = content['preacher-image-url']
    document.getElementsByClassName('preacher-message-image')[1].src = content['preacher-image-url']
    document.getElementsByClassName('preacher-message-image')[2].src = content['preacher-image-url']
  } else if (content['preacher-image-input'] && content['preacher-image-input'][0]) {
    const reader = new FileReader()
    reader.onload = function () {
      document.getElementsByClassName('preacher-message-image')[0].src = reader.result
      document.getElementsByClassName('preacher-message-image')[1].src = reader.result
      document.getElementsByClassName('preacher-message-image')[2].src = reader.result
    }
    reader.readAsDataURL(content['preacher-image-input'][0])
  }

  if (content['church-logo-url']) {
    document.getElementsByClassName('preacher-message-church-logo')[0].src = `${content['church-logo-url']}`
    document.getElementsByClassName('preacher-message-church-logo')[1].src = `${content['church-logo-url']}`
    document.getElementsByClassName('preacher-message-church-logo')[2].src = `${content['church-logo-url']}`
  } else {
    document.getElementsByClassName('preacher-message-church-logo')[0].src = churchLogo
    document.getElementsByClassName('preacher-message-church-logo')[1].src = churchLogo
    document.getElementsByClassName('preacher-message-church-logo')[2].src = churchLogo
  }

  if (content['church-address']) {
    document.getElementsByClassName('preacher-message-church-address')[0].innerHTML = `${content['church-address']}`
    document.getElementsByClassName('preacher-message-church-address')[1].innerHTML = `${content['church-address']}`
    document.getElementsByClassName('preacher-message-church-address')[2].innerHTML = `${content['church-address']}`
  } else {
    document.getElementsByClassName('preacher-message-church-address')[0].innerHTML = 'Rua Martim Affonso, 152 - Belenzinho, São Paulo - SP, 03057-050'
    document.getElementsByClassName('preacher-message-church-address')[1].innerHTML = 'Rua Martim Affonso, 152 - Belenzinho, São Paulo - SP, 03057-050'
    document.getElementsByClassName('preacher-message-church-address')[2].innerHTML = 'Rua Martim Affonso, 152 - Belenzinho, São Paulo - SP, 03057-050'
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

function saveImage (type, options) {
  const div = document.getElementsByClassName(`preacher-message ${type}`)[0]

  domtoimage.toJpeg(div, options)
    .then((dataUrl) => {
      const form = document.getElementById('form')
      const content = getContentFromForm(form)

      saveChurchAddress(content['church-address'])

      const link = document.createElement('a')
      link.download = `pregacao-${type}.jpeg`
      link.href = dataUrl
      link.click()
    })
    .catch(() => alert('Erro ao gerar a imagem'))
}

function saveWhatsappImage () {
  const options = {
    height: 600,
    width: 400,
  }
  const type = 'whatsapp'

  saveImage(type, options)
}

function saveInstagramImage () {
  const options = {
    height: 1080,
    width: 1080,
  }
  const type = 'instagram'

  saveImage(type, options)
}

function saveFacebookImage () {
  const options = {
    height: 1200,
    width: 1200,
  }
  const type = 'facebook'

  saveImage(type, options)
}

function handleOnSave () {
  const button = document.getElementById('btn-save-image')

  button.addEventListener('click', () => {
    saveWhatsappImage()
    saveInstagramImage()
    saveFacebookImage()
  })
}

function retrieveInputValues () {
  retrieveChurchAddress()
}

function initScript () {
  viewImage()
  handleOnSave()
  retrieveInputValues()
}

export default initScript
