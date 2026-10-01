# Daggerheart — Artes Completas

Módulo independente de retratos e tokens para os **264 adversários** presentes no Daggerheart **2.10.7**, destinado ao **Foundry VTT 14**.

A auditoria identificou 129 adversários cobertos pelo Art for Daggerheart 1.1.4 e 135 sem artes. O projeto preserva os 129 retratos, 129 recortes circulares e 676 variantes existentes e acrescenta uma ilustração individual com fundo transparente para cada adversário faltante.

As novas ilustrações de corpo inteiro servem tanto de retrato da ficha quanto de token. Elas não incluem variantes adicionais nem um retrato de rosto separado. O anel circular é produzido pelo Foundry e pode ser desativado.

O arquivo `coverage.json` informa a cobertura: 264/264.

Abra `galeria.html` no navegador para consultar as artes por nome, filtrar as novas e alternar os fundos claro, escuro e xadrez. A galeria funciona localmente e abre cada imagem em seu tamanho original.

## Instalação

1. No Foundry, vá em **Configuração → Módulos de Complemento → Instalar Módulo**.
2. No campo **URL do Manifesto**, cole:
   ```
   https://github.com/giovannialopes/daggerheart-art-for-game/releases/latest/download/module.json
   ```
3. Clique em **Instalar**, abra seu mundo Daggerheart e entre em **Gerenciar Módulos**.
4. Desative **Art for Daggerheart** e ative **Daggerheart - Artes Completas**.
5. Recarregue o mundo e abra o compêndio **Daggerheart SRD → Adversaries**.

O módulo é autossuficiente: a pasta do Art for Daggerheart original não é necessária para carregar suas imagens. Atualizações aparecem automaticamente em **Módulos de Complemento**.

## Uso

Em **Configurações do Módulo → Daggerheart - Artes Completas**, escolha:

- **Variantes de corpo inteiro**: padrão semelhante ao módulo original; usa as variantes antigas e a arte individual nova.
- **Circular**: usa os recortes circulares antigos. Para adversários novos, usa a ilustração transparente.
- **Retrato**: usa a mesma imagem apresentada na ficha.
- **Anéis dinâmicos**: ativa ou desativa o anel nativo do Foundry em qualquer modo.

Alterações dessas opções pedem recarregamento do mundo. As preferências nativas do Foundry para arte de compêndios também são respeitadas.

As artes são aplicadas ao abrir ou importar atores do compêndio. **Atores e tokens que já existem em um mundo não são reescritos automaticamente**. Para adotá-las nesses casos, selecione a imagem na ficha e no protótipo do token ou importe uma nova cópia do adversário. As alterações do protótipo não substituem tokens que já estejam em cenas.

O módulo muda imagens e opções visuais; mantém tamanho, escala, recursos, estatísticas, visão, luz e demais regras. Nenhum pack do sistema é editado. Os IDs do compêndio fazem a associação, por isso a tradução do nome não altera a correspondência. Atualizações futuras que acrescentem criaturas ou troquem IDs exigirão nova auditoria.

## Geração das artes

Geração realizada com o **image_gen integrado ao Codex**, a partir da descrição de cada adversário e da direção visual de fantasia pintada com influência de The Legend of Vox Machina. O runtime do módulo não possui dependências externas, chaves, serviços online ou bibliotecas adicionais.

## Créditos

Artes reutilizadas: **Gus e Yuri**, do [Art for Daggerheart](https://github.com/mordachai/art-for-daggerheart). Integração original: **Mestre Digital**, com os demais autores do módulo original. O README do projeto original declara as imagens sob **CC0**. Os scripts deste módulo foram escritos separadamente.

As novas imagens foram geradas para Giovanni. Este projeto é um complemento de fã e não uma publicação oficial de Daggerheart, Darrington Press ou Critical Role. A referência visual a Vox Machina descreve a direção artística das ilustrações.

Referências técnicas: [CompendiumArt](https://foundryvtt.com/api/classes/foundry.helpers.media.CompendiumArt.html) e [hook applyCompendiumArt](https://foundryvtt.com/api/functions/hookEvents.applyCompendiumArt.html).
