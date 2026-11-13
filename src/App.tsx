import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home/Home'
import { BulletinEditor } from './tools/bulletin/Editor'
import { ThumbnailEditor } from './tools/youtube-thumbnail/Editor'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="thumbnail-youtube" element={<ThumbnailEditor />} />
        <Route path="boletim" element={<BulletinEditor />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
