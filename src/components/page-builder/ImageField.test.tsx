import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageField } from './ImageField'

const photo = {
  src: 'data:image/png;base64,AA',
  name: 'culto.jpg',
  detail: '120 KB',
}

describe('ImageField', () => {
  it('offers a file picker when there is no image', () => {
    render(<ImageField label="Foto de fundo" value={null} onChange={vi.fn()} />)

    expect(
      screen.getByRole('group', { name: 'Foto de fundo' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Escolher imagem/ })
    ).toBeInTheDocument()
  })

  it('shows the chosen image and removes it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ImageField label="Foto de fundo" value={photo} onChange={onChange} />
    )

    expect(screen.getByText('culto.jpg')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Remover Foto de fundo' })
    )

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
