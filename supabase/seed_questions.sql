-- Quickspot Quiz — initial batch of quiz questions.
-- Run once in the Supabase SQL editor, after schema.sql. Running it twice
-- will append a duplicate copy of these questions (order_index keeps
-- appending after whatever is already in quiz_questions).

with new_questions (text, options, correct_option) as (
  values
    ('Qual acessório é usado para difundir e suavizar a luz em um set de filmagem?',
     '["Softbox", "Tripé", "Gimbal", "Slider"]'::jsonb, 0),

    ('Em que cidade aconteceu a primeira exibição pública de cinema dos irmãos Lumière, em 1895?',
     '["Nova York", "Paris", "Londres", "Berlim"]'::jsonb, 1),

    ('Qual agência brasileira foi eleita "Agência do Ano" no Festival de Cannes Lions duas vezes seguidas, em 1998 e 1999?',
     '["DM9DDB", "AlmapBBDO", "Loducca", "Africa"]'::jsonb, 0),

    ('Como se chama a vara usada para posicionar o microfone fora de quadro durante as filmagens?',
     '["Boom", "Slider", "Dolly", "Jib"]'::jsonb, 0),

    ('Quais são os três elementos do "triângulo de exposição" em fotografia e vídeo?',
     '["ISO, abertura e velocidade do obturador", "Foco, zoom e balanço de branco", "Resolução, taxa de quadros e bitrate", "Contraste, saturação e nitidez"]'::jsonb, 0),

    ('Qual filme brasileiro venceu o Urso de Ouro no Festival de Berlim em 1998?',
     '["Cidade de Deus", "Central do Brasil", "Tropa de Elite", "O Auto da Compadecida"]'::jsonb, 1),

    ('Qual é o nome do refletor usado para rebater luz em filmagens, item simples e presente em praticamente todo set?',
     '["Rebatedor", "Ring light", "Fresnel", "Softbox"]'::jsonb, 0),

    ('Qual câmera, lançada em 2007 pela RED, foi pioneira em gravar em resolução 4K para o cinema?',
     '["RED ONE", "ARRI Alexa", "Sony F65", "Canon C300"]'::jsonb, 0),

    ('Em produções audiovisuais, como é chamado o profissional responsável por encontrar e negociar as locações de filmagem?',
     '["Location scout", "Diretor de arte", "Assistente de câmera", "Continuísta"]'::jsonb, 0),

    ('Qual proporção de tela é associada ao formato widescreen clássico "Cinemascope"?',
     '["4:3", "16:9", "2.35:1", "1:1"]'::jsonb, 2)
),
base as (
  select coalesce(max(order_index), -1) as start from quiz_questions
)
insert into quiz_questions (text, options, correct_option, order_index)
select nq.text, nq.options, nq.correct_option, base.start + row_number() over ()
from new_questions nq, base;
