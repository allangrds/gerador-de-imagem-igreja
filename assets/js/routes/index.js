import {
  newThumbnailYoutube,
  preacher,
  thumbnailYoutube,
  thumbnailYoutubeEsJovem,
} from '../pages'

const routes = {}

function route (path, template) {
  routes[path] = template
}

function resolveRoute (selectedRoute) {
  try {
    return routes[selectedRoute]
  } catch (error) {
    throw new Error('The route is not defined')
  }
}

function router () {
  const url = window.location.pathname
  const routeResolved = resolveRoute(url)

  if (routeResolved) {
    routeResolved()
  }
}

route('/pages/pregacao.html', preacher)
route('/pages/thumbnail-youtube.html', thumbnailYoutube)
route('/pages/new-thumbnail-youtube.html', newThumbnailYoutube)
route('/pages/thumbnail-youtube-es-jovem.html', thumbnailYoutubeEsJovem)

window.addEventListener('load', router)
window.addEventListener('hashchange', router)
