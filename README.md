```
M I N U I T
```

<!--
# `🌴 Table des matières`
-->

# `📼 Documentation du langage MINUIT`

## `🍣 Symboles`

### `👾 Expression des valeurs rythmiques`

Les valeurs rythmiques se notent avec des nombres : `1` (ronde), `2` (blanche),
`4` (noire), `8` (croche), `16` (double croche), `32` (triple croche), `64`
(quadruple croche), `12` (croche de triolet), `17` (un dix-septième de ronde),
`35` (un trente-cinquième de ronde), `1/4` (quatre rondes), `18/5` (cinq
dix-huitièmes de ronde), etc.

Le `.` a la même sémantique qu'en solfège. Ainsi, `1.` est une ronde pointée, et
est équivalent au nombre `2/3` (trois blanches).

<!-- L'underscore permet de lier des valeurs, comme sur une partition. Par exemple,
`2_4` est une blanche liée à une noire, équivalent au nombre `4/3` (trois
noires) ; `1_1`sont deux rondes liées, équivalent à `0.5`. -->

#### `🌴 Expression des hauteurs`

Les douze classes de hauteur peuvent se noter avec des caractères issus de
systèmes différents :

|  Classe de hauteur   | Note MIDI | Système duodécimal | Système 2 | Système 3 |
| :------------------: | :-------: | :----------------: | :-------: | :-------: |
|    Do / Si dièse     |    60     |         0          |   c / B   |   c/b+    |
| Do dièse / Ré bémol  |    61     |         1          |     C     |   c+/d-   |
|          Ré          |    62     |         2          |     d     |     d     |
| Ré dièse / Mi bémol  |    63     |         3          |     D     |   d+/e-   |
|          Mi          |    64     |         4          |     e     |     e     |
|          Fa          |    65     |         5          |   f / E   |     f     |
| Fa dièse / Sol bémol |    66     |         6          |     F     |   f+/g-   |
|         Sol          |    67     |         7          |     g     |     g     |
| Sol dièse / La bémol |    68     |         8          |     G     |   g+/a-   |
|          La          |    69     |         9          |     a     |     a     |
| La dièse / Si bémol  |    70     |       x / X        |     A     |   a+/b-   |
|    Si / Do bémol     |    71     |       y / Y        |     b     |   b/c-    |

- Pour changer l'octave d'une note, on la fait suivre d'autant de `'` qu'on
  souhaite monter ou d'autant de `,` qu'on souhaite descendre. Exemples : `4'`
  correspond à la note MIDI 86 (E5), `g,,` correspond à la note MIDI 43 (G2),
  `0'''` correspond à la note MIDI 96 (C7).
- Les accords se notent en combinant des symboles de hauteurs au sein de
  chevrons. Exemple : `<0378>` est une triade mineure dont la fondamentale est
  `0` avec une quinté augmentée.
- TODO : Notation par intervalles à partir d'un pitch de départ ou du dernier
  pitch.

## `🎍 Valeurs par défaut des paramètres`

- global BPM = 120
- global PPQ = 480
- default midi note = 60
- default TS = 4/4
- default GR = 4
- default time unit = 4
- default pattern length = content|measure

# `🌃 Exemples`

## `🦩 Crockett’s Theme (Jan Hammer, 1988)`

```
§ https://en.wikipedia.org/wiki/Crockett%27s_Theme

$🟣=
$KSIG=1b

P0=
<fad+><fac+><egc+><e-gb>
<gc+e-+><gbd+><fad+><fac+><egc+><e-gb>
<gc+e-+><gb+d+><fad+>
.

P0.r: 2 2 1 1 🟣 2 2 2 2 1 1 🟣 2 2 0.5

P1.p:
d*4f*4c*8D*8
c*4g*4d*4f*4c*8D*8
c*4g*4d*16
°

P1.r: 8
```

# ` Cool stuff`

- https://tidalcycles.org/
- https://opusmodus.com/
- https://oxiinstruments.com/oxi-one
- https://squarp.net/hapax/
- https://510k.myshopify.com/products/seqund-au-vst-vst3-sequencer
- https://en.wikipedia.org/wiki/FastTracker_2
- https://dirtywave.com/
- https://xor-electronics.com/nerdseq/
- https://100r.co/site/orca.html
- https://doc.sccode.org/Tutorials/A-Practical-Guide/PG_01_Introduction.html
- https://marionietoworld.com/
- https://squarp.net/hapax/manual/modefx/

<!--
#### Hauteurs et rythme intégrés

```sh
P0.PR=aabaababaabaaaba[bbbb]

# équivalent à

P0.P=aabaababaabaaababbbb
P0.R=8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 32 32 32 32
```

#### Grille

Mais ne pas encore la spécifier car on ne sait pas comment introduire : - la
subdivision - la sémantique des caractères - le shifting On pourrait utiliser
l'espace comme séparateur optionnel non sémantique

```
BEGIN P1.G h:60 o:61 i:62
k...
.... s...
hhhh hhhh hhhh hhhh
oooo [oo|ooo]ooo oooo [ii|iiii]ooo
END
```

À comparer à une approche éclatée, peut-être plus réaliste :

```
# Une séquence kick/snare avec triolets aléatoires
P0?GR:8 = 00001001 00100{[000]|0}00 00{[111]|1}01001 0010000{[111]|1}
P0?symbols = 0:50 1:111
```

### ÉCRITURE

Une mélodie à la croche :

```
P0 = 048319BBA84A47100BA00A0154B9000A
P0?GR:8
```

Une séquence d'accords :

```
P0.n = <72+><73+><3A><7-2>
P0.r = 8*3 8*5
P0.r = 4. 2_8 # équivalent
```

### EFFETS

Une note unique répétée 111 fois avec 50% de chance que l'octave varie (-2,
-1, 1) :

```
P0 = x
P0 => (roct -2 +1 0.5) => P1
```

Effet séquencé :

```
TODO
```

Effet appliqué conditionnellement :

```
TODO

On peut vouloir qu'un effet s'applique si une condition est validée sur les notes d'un pattern. Par exemple, toutes les 5 notes, à chaque répétition d'un pattern bouclé, si la note est un ré, si l'octave est égal à 4, si la vélocité est inférieure à 27...

Il faut donc pouvoir accéder au numéro d'ordre de la répétition du pattern, au numéro d'ordre de la note, aux données de la note.
```

### MONTAGE

Montage séquentiel :

```
/\ ++ P0 P1 P2
```

Montage absolu :

```
/\ ++ P0@34.3
```

Montage séquentiel avec offset :

```
/\ ++ P0@+3×16
```

Ajout d'un silence :

```
/\ ++ P0 S(8×3)
```

Montage en parallèle :

```
/\ ++ <P0 P1 P3>
```
-->
