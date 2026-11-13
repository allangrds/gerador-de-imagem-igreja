import { ButtonLink } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { tools } from '../../tools/registry'
import { ThumbnailArt } from '../../tools/youtube-thumbnail/ThumbnailArt'
import { SAMPLE_THUMBNAIL } from '../../tools/youtube-thumbnail/sample'
import styles from './Home.module.css'
import { ToolCard } from './ToolCard'

const COUNT_WORDS = ['Nenhuma', 'Uma', 'Duas', 'Três', 'Quatro', 'Cinco']

const steps = [
  {
    title: 'Escolha a ferramenta',
    text: 'Cada ferramenta já vem com o layout oficial da igreja. Não é preciso saber design.',
  },
  {
    title: 'Preencha os dados',
    text: 'Título, pregador e foto. A arte se atualiza enquanto você digita.',
  },
  {
    title: 'Baixe e publique',
    text: 'Um clique gera o JPG no tamanho exato, pronto para subir no YouTube.',
  },
]

export function Home() {
  const available = tools.filter((tool) => tool.status === 'available').length
  const soon = tools.length - available

  return (
    <main>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Ferramentas de comunicação</span>
            <h1 className={styles.heroTitle}>
              As artes da igreja, prontas em minutos.
            </h1>
            <p className={styles.lead}>
              Preencha os dados, veja a arte se montando na hora e baixe no
              tamanho certo. Feito para a equipe de mídia da IASD Belém manter
              a mesma identidade em tudo o que publica.
            </p>
            <div className={styles.actions}>
              <ButtonLink to="/thumbnail-youtube">
                Criar thumbnail
                <Icon name="arrowRight" />
              </ButtonLink>
              <ButtonLink to="#como-funciona" variant="secondary">
                Como funciona
              </ButtonLink>
            </div>
          </div>
          <figure className={styles.heroArt}>
            <div className={styles.heroFrame}>
              <ThumbnailArt {...SAMPLE_THUMBNAIL} />
            </div>
            <figcaption className={styles.caption}>
              Exemplo feito com a ferramenta Thumbnail para YouTube.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="ferramentas" className={styles.tools}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Ferramentas</h2>
              <p className={styles.muted}>
                {COUNT_WORDS[available]}{' '}
                {available === 1 ? 'pronta' : 'prontas'} para usar hoje, outras
                a caminho.
              </p>
            </div>
            <span className={styles.count}>
              {available} {available === 1 ? 'disponível' : 'disponíveis'} ·{' '}
              {soon} em breve
            </span>
          </div>
          <ul className={styles.grid}>
            {tools.map((tool) => (
              <li key={tool.id}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="como-funciona" className={styles.how}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Como funciona</h2>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className={styles.privacy}>
            <Icon name="lock" />
            Tudo acontece no seu navegador: nenhuma foto é enviada para
            servidores.
          </p>
        </div>
      </section>
    </main>
  )
}
