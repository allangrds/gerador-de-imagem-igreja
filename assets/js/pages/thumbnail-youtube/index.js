import domtoimage from 'dom-to-image'

const loadFont = (url) => {
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url, true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let css = xhr.responseText
      css = css.replace(/}/g, 'font-display: swap; }')

      const head = document.getElementsByTagName('head')[0]
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(css))
      head.appendChild(style)
    }
  }

  xhr.send()
}

loadFont('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Lato:wght@100;300;400;700&family=Merriweather:wght@400&display=swap')

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

function getMessageDate (val) {
  let dt = 'culto de '

  if (val === 'sabado') {
    dt = `${dt} sábado`
  } else {
    dt = `${dt} ${val}`
  }

  return dt
}

function setElementValues (content) {
  document.getElementsByClassName('preacher-message-title')[0].innerHTML = content['preacher-message-title']
  document.getElementsByClassName('preacher-message-name')[0].innerHTML = content['preacher-name']
  document.getElementsByClassName('preacher-message-date')[0].innerHTML = getMessageDate(content['preacher-message-date'])

  if (content['preacher-image-url']) {
    document.getElementsByClassName('preacher-message-image')[0].src = content['preacher-image-url']
  } else if (content['preacher-image-input'] && content['preacher-image-input'][0]) {
    const reader = new FileReader()
    reader.onload = function () {
      document.getElementsByClassName('preacher-message-image')[0].src = reader.result
    }
    reader.readAsDataURL(content['preacher-image-input'][0])
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

function saveThumbnailYoutubeImage () {
  const div = document.getElementsByClassName('thumb')[0]

  domtoimage.toJpeg(div, { width: 1280, height: 720 })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = 'thumb.jpeg'
      link.href = dataUrl
      link.click()
    })
    .catch(() => alert('Erro ao gerar a imagem'))
}

function handleOnSave () {
  const button = document.getElementById('btn-save-image')

  button.addEventListener('click', () => {
    saveThumbnailYoutubeImage()
  })
}

function initScript () {
  viewImage()
  handleOnSave()
}

export default initScript
