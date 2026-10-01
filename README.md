# Daggerheart — Art for Game

Módulo independente de retratos e tokens para os **264 adversários** presentes no Daggerheart **2.10.7**, destinado ao **Foundry VTT 14**.

A auditoria identificou 129 adversários cobertos pelo Art for Daggerheart 1.1.4 e 135 sem artes. O projeto preserva os 129 retratos, 129 recortes circulares e 676 variantes existentes e acrescenta uma ilustração individual com fundo transparente, e o recorte circular dela, para cada adversário faltante.

As novas ilustrações de corpo inteiro servem de retrato da ficha e de token nos estilos Variantes e Retrato. O anel circular é produzido pelo Foundry e pode ser desativado.

O arquivo `coverage.json` informa a cobertura: 264/264.

Abra `galeria.html` no navegador para consultar as artes por nome, filtrar as novas e alternar os fundos claro, escuro e xadrez. A galeria funciona localmente e abre cada imagem em seu tamanho original.

## Instalação

Wyvern, Drake, Young Fire Dragon, Ruby Dragon e Dragon Mother Mitera foram refeitos no estilo de animação definido pela wyvern aprovada. Os 135 retratos novos e seus tokens usam nomes legíveis; os arquivos com nomes antigos são mantidos por compatibilidade com mundos existentes, e a macro de reparo (veja **Uso**) atualiza tokens que ainda apontam para eles. O identificador interno continua `daggerheart-art-complete`.

1. No Foundry, vá em **Configuração → Módulos de Complemento → Instalar Módulo**.
2. No campo **URL do Manifesto**, cole:
   ```
   https://github.com/giovannialopes/daggerheart-art-for-game/releases/latest/download/module.json
   ```
3. Clique em **Instalar**, abra seu mundo Daggerheart e entre em **Gerenciar Módulos**.
4. Desative **Art for Daggerheart** e ative **Daggerheart - Art for Game**.
5. Recarregue o mundo e abra o compêndio **Daggerheart SRD → Adversaries**.

O módulo é autossuficiente: a pasta do Art for Daggerheart original não é necessária para carregar suas imagens. Atualizações aparecem automaticamente em **Módulos de Complemento**.

## Uso

Em **Configurações do Módulo → Daggerheart - Art for Game**, escolha:

- **Circular** (padrão): recorte redondo de cada adversário, dentro do anel dinâmico do Foundry.
- **Variantes de corpo inteiro**: alterna as variantes antigas; nos adversários novos, usa a ilustração individual. Sem anel.
- **Retrato**: usa a mesma imagem apresentada na ficha. Sem anel.
- **Anéis dinâmicos**: liga ou desliga o anel nos tokens circulares.
- **Tamanho da arte dentro do anel**: diminua se a borda da arte aparecer fora do anel; aumente se sobrar fundo entre a arte e o anel.

Só o estilo Circular usa anel. O Foundry desenha o anel por cima do token sem recortar a imagem, então artes em paisagem ou com fundo pintado vazariam para fora dele.

Alterações dessas opções pedem recarregamento do mundo. As preferências nativas do Foundry para arte de compêndios também são respeitadas.

As artes são aplicadas ao abrir ou importar atores do compêndio. **Atores e tokens que já existem em um mundo não são reescritos automaticamente.** Para aplicar o estilo atual a eles, entre como GM e execute em uma macro do tipo Script:

```js
await game.modules.get("daggerheart-art-complete").api.fixTokenFraming();
```

A macro percorre os protótipos dos atores e os tokens de todas as cenas, somente quando usam imagens deste módulo. Ela troca a imagem pelo estilo escolhido, ajusta enquadramento e anel e mantém o espelhamento. Tamanho no mapa, visão, luz e regras não mudam.

O módulo muda imagens e opções visuais; mantém tamanho no mapa, recursos, estatísticas, visão, luz e demais regras. Nenhum pack do sistema é editado. Os IDs do compêndio fazem a associação, por isso a tradução do nome não altera a correspondência. Atualizações futuras que acrescentem criaturas ou troquem IDs exigirão nova auditoria.

## Geração das artes

Geração realizada com o **image_gen integrado ao Codex**, a partir da descrição de cada adversário e da direção visual de fantasia pintada com influência de The Legend of Vox Machina. O runtime do módulo não possui dependências externas, chaves, serviços online ou bibliotecas adicionais.

## Créditos

Artes reutilizadas: **Gus e Yuri**, do [Art for Daggerheart](https://github.com/mordachai/art-for-daggerheart). Integração original: **Mestre Digital**, com os demais autores do módulo original. O README do projeto original declara as imagens sob **CC0**. Os scripts deste módulo foram escritos separadamente.

As novas imagens foram geradas para Giovanni. Este projeto é um complemento de fã e não uma publicação oficial de Daggerheart, Darrington Press ou Critical Role. A referência visual a Vox Machina descreve a direção artística das ilustrações.

Referências técnicas: [CompendiumArt](https://foundryvtt.com/api/classes/foundry.helpers.media.CompendiumArt.html) e [hook applyCompendiumArt](https://foundryvtt.com/api/functions/hookEvents.applyCompendiumArt.html).
