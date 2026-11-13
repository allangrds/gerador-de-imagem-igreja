import type { MessageField, MessageModel } from './models'

// The church's message line. Each template is the final text with {field}
// slots: an empty field shows its [placeholder], a line starting with "?"
// only appears when its fields are filled, "- {field}" becomes one item per
// line and {field|upper} is written in capitals.

function field(
  key: string,
  label: string,
  placeholder: string,
  extra: Partial<MessageField> = {}
): MessageField {
  return { key, label, placeholder, defaultValue: '', ...extra }
}

function list(key: string, label: string, placeholder: string) {
  return field(key, label, placeholder, {
    multiline: true,
    hint: 'Um por linha.',
  })
}

const CHURCH_ADDRESS = 'Rua Martim Affonso, 152 · Belenzinho, São Paulo'

const church = field(
  'igreja',
  'Igreja e endereço',
  '[nome da igreja — endereço]',
  {
    defaultValue: CHURCH_ADDRESS,
  }
)
const date = field('data', 'Data', '[data]', {
  hint: 'Escreva como deve aparecer na mensagem.',
})
const dates = field('datas', 'Datas', '[datas]')
const place = field('local', 'Local', '[local]')
const city = field('cidade', 'Cidade', '[cidade]')
const deadline = field('prazo', 'Inscrições até', '[prazo]')
const theme = field('tema', 'Tema', '[tema]')

export const lineModels: MessageModel[] = [
  {
    type: 'culto-sabado',
    name: 'Culto de sábado',
    description: 'Convite com mensagem, data e horário',
    fields: [
      field('assunto', 'Assunto da mensagem', '[assunto]'),
      field(
        'pregador',
        'Quem apresentará a mensagem',
        '[nome de quem apresentará a mensagem]'
      ),
      date,
      field('horario', 'Horário do culto', '[horário do culto]'),
      church,
    ],
    template: `*Neste sábado, venha adorar com a gente*

Vamos nos reunir para louvar a Deus, orar e estudar a Bíblia. Você e sua família estão convidados.

A mensagem será sobre {assunto}, com {pregador}.

📅 {data}

🕘 {horario}

📍 {igreja}

É sua primeira visita? Envie uma mensagem por aqui se precisar de orientações para chegar.`,
  },
  {
    type: 'culto-quarta',
    name: 'Culto de quarta-feira',
    description: 'Convite para o momento de oração',
    fields: [
      field('assunto', 'Assunto da mensagem', '[assunto da mensagem]'),
      date,
      field('horario', 'Horário', '[horário]'),
      church,
    ],
    template: `*Uma pausa na semana para orar juntos*

Nesta quarta, vamos compartilhar motivos de gratidão, apresentar nossos pedidos a Deus e refletir sobre {assunto}.

Você pode chegar com suas perguntas, preocupações e motivos para agradecer.

📅 {data}

🕘 {horario}

📍 {igreja}

Venha participar desse momento de oração com a gente.`,
  },
  {
    type: 'retiro',
    name: 'Inscrição para retiro',
    description: 'Datas, local, valor e prazo',
    fields: [
      field('nome', 'Nome do retiro', '[nome]'),
      dates,
      place,
      city,
      theme,
      field('atividades', 'Atividades confirmadas', '[atividades confirmadas]'),
      field('valor', 'Valor (R$)', '[valor]'),
      field('pessoa', 'Valor por', '[pessoa/família]'),
      field(
        'inclui',
        'O que está incluído',
        '[hospedagem, alimentação e outros itens confirmados]'
      ),
      deadline,
    ],
    template: `*Inscrições abertas para o retiro {nome}*

Reserve os dias {datas} para um encontro de estudo da Bíblia, oração e convivência em {local}.

O tema será {tema}. A programação inclui {atividades}.

📅 {datas}

📍 {local} — {cidade}

💰 R$ {valor} por {pessoa}

✅ Inclui: {inclui}

🗓 Inscrições até {prazo}

Para receber as informações e se inscrever, envie *RETIRO* por mensagem.`,
  },
  {
    type: 'retiro-casais',
    name: 'Inscrição para retiro de casais',
    description: 'Tempo para cuidar da vida a dois',
    fields: [
      field('nome', 'Nome do retiro', '[nome]'),
      theme,
      dates,
      place,
      city,
      field('valor', 'Valor por casal (R$)', '[valor]'),
      field('inclui', 'O que está incluído', '[itens confirmados]'),
      deadline,
    ],
    template: `*Um tempo para cuidar da vida a dois*

Entre a rotina, o trabalho e as responsabilidades, como vocês têm cuidado do relacionamento?

O retiro de casais {nome} será uma oportunidade para conversar sobre {tema}, refletir à luz da Bíblia e passar tempo juntos.

📅 {datas}

📍 {local} — {cidade}

💰 R$ {valor} por casal

✅ Inclui: {inclui}

🗓 Inscrições até {prazo}

Para conhecer a programação e se inscrever, envie *CASAIS* por mensagem.`,
  },
  {
    type: 'retiro-jovem',
    name: 'Inscrição para retiro jovem',
    description: 'Datas, público, valor e prazo',
    fields: [
      field('nome', 'Nome do retiro', '[nome]'),
      dates,
      place,
      city,
      theme,
      field('atividades', 'Atividades confirmadas', '[atividades confirmadas]'),
      field('publico', 'Para quem', '[faixa etária/público]'),
      field('valor', 'Valor (R$)', '[valor]'),
      field('itens', 'O valor inclui', '[itens]'),
      deadline,
    ],
    template: `*Retiro jovem {nome}: vamos nessa?*

Nos dias {datas}, vamos nos reunir em {local} para estudar a Bíblia, conversar sobre {tema} e aproveitar a programação juntos.

Teremos {atividades}.

📅 {datas}

👥 Para {publico}

📍 {local} — {cidade}

💰 R$ {valor}, incluindo {itens}

🗓 Inscrições até {prazo}

Quer participar? Envie *RETIRO JOVEM* por mensagem para receber as orientações.`,
  },
  {
    type: 'asa-alimentos',
    name: 'Pedido de alimentos para a ASA',
    description: 'Lista de alimentos e ponto de coleta',
    fields: [
      list('alimentos', 'Alimentos', '[alimento e quantidade]'),
      field('ponto', 'Ponto de coleta', '[ponto de coleta — endereço]', {
        defaultValue: CHURCH_ADDRESS,
      }),
      field('data', 'Entregar até', '[data]'),
      field('horarios', 'Horários de entrega', '[horários]'),
    ],
    template: `*Ajude a completar as próximas cestas*

A Ação Solidária Adventista (ASA) está arrecadando alimentos para as famílias acompanhadas pela nossa igreja.

Neste momento, precisamos de:

- {alimentos}

Doe produtos dentro da validade e com a embalagem fechada.

📍 Entrega: {ponto}

🗓 Até {data}, nos horários {horarios}

Você pode contribuir com um ou mais itens. Entregue sua doação no ponto de coleta.`,
  },
  {
    type: 'asa-missao',
    name: 'Missão Urbana da ASA',
    description: 'Chamado de voluntários',
    fields: [
      date,
      field('acao', 'Ação', '[ação concreta]'),
      field('local', 'Onde será a ação', '[local]'),
      field('finalidade', 'Para quê', '[finalidade da ação]'),
      list('tarefas', 'Tarefas dos voluntários', '[tarefa]'),
      field(
        'horarios',
        'Horários de participação',
        '[horários de participação]'
      ),
      field('encontro', 'Ponto de encontro', '[local — endereço]', {
        defaultValue: CHURCH_ADDRESS,
      }),
      field('prazo', 'Responder até', '[prazo]'),
    ],
    template: `*Vamos servir à nossa comunidade?*

No dia {data}, a Missão Urbana da ASA vai realizar {acao} em {local}, para {finalidade}.

Precisamos de voluntários para:

- {tarefas}

📅 {data}

🕘 {horarios}

📍 Ponto de encontro: {encontro}

Pode ajudar em uma dessas etapas? Envie *ASA* por mensagem e informe sua disponibilidade até {prazo}.`,
  },
  {
    type: 'livro',
    name: 'Recomendação de livro da biblioteca',
    description: 'Título, autor e empréstimo',
    fields: [
      field(
        'questao',
        'Questão abordada no livro',
        '[questão abordada no livro]'
      ),
      field('titulo', 'Título do livro', '[título]'),
      field('autor', 'Autor', '[autor]'),
      field('resumo', 'Resumo', '[resumo fiel em uma ou duas frases]'),
      field(
        'interesse',
        'É para quem deseja',
        '[interesse específico do leitor]'
      ),
      field(
        'emprestimos',
        'Empréstimos (local e horários)',
        '[local e horários]'
      ),
    ],
    template: `*Sua próxima leitura pode estar aqui*

Quer entender melhor {questao}?

Nossa indicação é *“{titulo}”*, de {autor}. O livro aborda {resumo}.

É uma leitura para quem deseja {interesse}.

📚 Disponível na biblioteca da nossa igreja.

📍 Empréstimos: {emprestimos}

Para consultar a disponibilidade e saber como retirar, envie *BIBLIOTECA* por mensagem.`,
  },
  {
    type: 'semana-oracao',
    name: 'Semana de oração temática',
    description: 'Tema, período e participantes',
    fields: [
      field('tema', 'Tema da semana', '[Tema da semana]'),
      field('inicio', 'Data inicial', '[data inicial]'),
      field('fim', 'Data final', '[data final]'),
      field('questao', 'Questão central', '[questão central]'),
      field('assuntos', 'Assuntos principais', '[assuntos principais]'),
      field('horario', 'Horário dos encontros', '[horário dos encontros]'),
      church,
      field('participantes', 'Participantes', '[participantes confirmados]'),
    ],
    template: `*{tema}: vamos estudar juntos?*

De {inicio} a {fim}, nossa semana de oração vai abordar {questao} à luz da Bíblia.

A cada encontro, vamos refletir sobre {assuntos} e reservar tempo para oração.

📅 {inicio} a {fim}

🕘 {horario}

📍 {igreja}

🎙 Com {participantes}

Participe nos dias em que puder. Você também pode convidar alguém para vir com você.`,
  },
  {
    type: 'sabado-tematico',
    name: 'Culto de sábado temático',
    description: 'Estudo de um assunto da Bíblia',
    fields: [
      field(
        'chamada',
        'Pergunta central ou título',
        '[Pergunta central ou título do tema]'
      ),
      field('assunto', 'Assunto', '[assunto]'),
      field('situacao', 'Situação da vida', '[situação concreta da vida]'),
      field('pregador', 'Quem apresentará', '[nome]'),
      field('titulo', 'Título da mensagem', '[título]'),
      date,
      field('horario', 'Horário', '[horário]'),
      church,
    ],
    template: `*{chamada}*

Neste sábado, vamos estudar o que a Bíblia ensina sobre {assunto} e como isso se relaciona com {situacao}.

A mensagem será apresentada por {pregador}, com o tema *“{titulo}”*.

📅 {data}

🕘 {horario}

📍 {igreja}

Venha estudar com a gente. Você não precisa conhecer o assunto para participar.`,
  },
  {
    type: 'feijoada',
    name: 'Domingo da feijoada vegana',
    description: 'Almoço com reserva',
    fields: [
      date,
      field(
        'acompanhamentos',
        'Acompanhamentos',
        '[acompanhamentos confirmados]'
      ),
      field('horario', 'Horário', '[horário]'),
      field('local', 'Local', '[local — endereço]', {
        defaultValue: CHURCH_ADDRESS,
      }),
      field('valor', 'Valor (R$)', '[valor]'),
      field('porcao', 'Valor por', '[porção/pessoa]'),
      field('consumo', 'Como servir', '[Consumo no local, retirada ou ambos]'),
      field('prazo', 'Reservas até', '[prazo]'),
      field('destinacao', 'Destinação da arrecadação', '', {
        hint: 'Opcional. Só aparece se preenchida e confirmada.',
      }),
    ],
    template: `*Domingo tem feijoada vegana*

Convide alguém para almoçar com a gente!

No dia {data}, teremos feijoada vegana com {acompanhamentos}.

📅 {data}

🕛 {horario}

📍 {local}

💰 R$ {valor} por {porcao}

🍽 {consumo}

Reserve até {prazo}: envie *FEIJOADA* por mensagem.

?Destinação da arrecadação: {destinacao}.`,
  },
  {
    type: 'junina',
    name: 'Domingo da social junina',
    description: 'Programação para famílias e amigos',
    fields: [
      date,
      field(
        'atividades',
        'Comidas e atividades',
        '[comidas, brincadeiras e atividades confirmadas]'
      ),
      field('horario', 'Horário', '[horário]'),
      field('local', 'Local', '[local — endereço]', {
        defaultValue: CHURCH_ADDRESS,
      }),
      field('entrada', 'Entrada', '[gratuita ou valor]'),
      field('alimentacao', 'Alimentação', '[incluída ou vendida à parte]'),
    ],
    template: `*Vamos nos encontrar na social junina?*

No domingo, {data}, teremos uma programação para reunir a igreja, as famílias e os amigos, com {atividades}.

📅 {data}

🕓 {horario}

📍 {local}

🎟 Entrada: {entrada}

🍽 Alimentação: {alimentacao}

Convide alguém e venha passar esse tempo com a gente.`,
  },
  {
    type: 'ministerio',
    name: 'Faça parte de um ministério',
    description: 'Convite para servir numa equipe',
    fields: [
      field('ministerio', 'Nome do ministério', '[nome do ministério]', {
        hint: 'Também vira a palavra que a pessoa envia por mensagem.',
      }),
      field(
        'atividade',
        'O que o ministério faz',
        '[atividade concreta e público atendido]'
      ),
      field('tarefas', 'Tarefas', '[tarefas específicas]'),
      field('frequencia', 'Frequência e horários', '[frequência e horários]'),
    ],
    template: `*Tem espaço para você no {ministerio}*

O {ministerio} cuida de {atividade}.

Estamos procurando pessoas para ajudar com {tarefas}. A participação acontece {frequencia}.

Vamos conversar sobre suas habilidades, sua disponibilidade e o que você precisa aprender para começar.

Quer conhecer a equipe? Envie *{ministerio|upper}* por mensagem.`,
  },
  {
    type: 'oferta',
    name: 'Oferte',
    description: 'Como e por que ofertar',
    fields: [
      field(
        'exemplo',
        'Exemplo mantido pelas ofertas',
        '[exemplo real de atividade mantida pelas ofertas]'
      ),
      field('canal', 'Como ofertar', '[canal oficial e orientações]'),
      field('contato', 'Contato da tesouraria', '[contato]'),
    ],
    template: `*Sua oferta participa da missão*

As ofertas ajudam a sustentar o trabalho da igreja e suas ações missionárias. Em nossa comunidade, {exemplo}.

Ofertar é uma expressão de gratidão e adoração a Deus. Separe sua contribuição com oração e liberdade, conforme propôs em seu coração.

Para ofertar, utilize {canal}.

Se tiver dúvidas sobre a destinação dos recursos, fale com a tesouraria pelo {contato}.`,
  },
  {
    type: 'dizimo',
    name: 'Dízimo',
    description: 'O princípio e como devolver',
    fields: [
      field('canal', 'Como devolver', '[canal e orientações]'),
      field(
        'responsavel',
        'Com quem conversar',
        '[pastor ou responsável — contato]'
      ),
    ],
    template: `*Fidelidade também na administração dos recursos*

Devolver o dízimo é uma forma de reconhecer que nossos recursos pertencem a Deus.

Na compreensão adventista, o dízimo corresponde a 10% da renda e é destinado ao sustento do ministério do evangelho.

Ao receber sua renda, separe o dízimo e devolva-o pelos canais oficiais da igreja: {canal}.

Quer compreender melhor esse princípio bíblico e a destinação dos recursos? Converse com {responsavel}.`,
  },
  {
    type: 'classe-biblica',
    name: 'Classe bíblica — módulo 1',
    description: 'Para quem está começando',
    fields: [
      field('conteudos', 'Conteúdos do módulo', '[conteúdos do módulo]'),
      field('publico', 'Para quem', '[público da classe]'),
      field('inicio', 'Início', '[data]'),
      field('encontros', 'Dia e horário dos encontros', '[dia e horário]'),
      field('local', 'Local', '[local — endereço]', {
        defaultValue: CHURCH_ADDRESS,
      }),
      field('material', 'Material', '[como será disponibilizado]'),
    ],
    template: `*Quer começar a entender a Bíblia?*

O módulo 1 da nossa classe bíblica é um espaço para conhecer {conteudos}, fazer perguntas e conversar sobre a fé cristã.

Os encontros são voltados a {publico}, com explicações para quem está começando.

📅 Início: {inicio}

🕘 Encontros: {encontros}

📍 {local}

📖 Material: {material}

Para conhecer a proposta e participar, envie *CLASSE BÍBLICA* por mensagem.`,
  },
  {
    type: 'clube-livro',
    name: 'Clube do livro',
    description: 'Próxima leitura e encontro',
    fields: [
      field('titulo', 'Título do livro', '[título]'),
      field('autor', 'Autor', '[autor]'),
      field('questao', 'Questão central da obra', '[questão central da obra]'),
      field('leitura', 'Leitura para o encontro', '[capítulos ou páginas]'),
      date,
      field('horario', 'Horário', '[horário]'),
      field('local', 'Local', '[local e endereço ou plataforma]'),
    ],
    template: `*Uma leitura, várias perspectivas*

O próximo livro do nosso clube é *“{titulo}”*, de {autor}.

Vamos conversar sobre {questao}, compartilhar impressões e ouvir o que chamou a atenção de cada pessoa.

📚 Leitura para o encontro: {leitura}

📅 {data}

🕘 {horario}

📍 {local}

Quer participar? Envie *CLUBE DO LIVRO* por mensagem para receber as orientações.`,
  },
]
