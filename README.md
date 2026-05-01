```
#     #   #######   #     #   #     #   #######   #######
##   ##      #      ##    #   #     #      #         #   
# # # #      #      # #   #   #     #      #         #   
#  #  #      #      #  #  #   #     #      #         #   
#     #      #      #   # #   #     #      #         #   
#     #      #      #    ##   #     #      #         #   
#     #   #######   #     #    #####    #######      #   
```

# `🌴 Table des matières`

1. [Documentation](#-documentation-de-minuit)
1. [Exemples](#-exemples)

# `📼 Documentation de MINUIT`

## `🔣 Symboles`

### `🥁 Expression des valeurs rythmiques`

Les valeurs rythmiques se notent avec des nombres : `1` (ronde), `2` (blanche),
`4` (noire), `8` (croche), `16` (double croche), `32` (triple croche), `64`
(quadruple croche), `12` (croche de triolet), `17` (un dix-septième de ronde),
`35` (un trente-cinquième de ronde), `1/4` (quatre rondes), `18/5` (cinq
dix-huitièmes de ronde), etc.

Le `.` a la même sémantique qu'en solfège. Ainsi, `1.` est une ronde pointée, et
est équivalent au nombre `2/3` (trois blanches).

L'underscore permet de lier des valeurs, comme sur une partition. Ainsi, `2_4`
est une blanche liée à une noire, équivalent au nombre `4/3` (trois noires).

#### 🪉 Expression des hauteurs

Les douze classes de hauteur peuvent se noter avec des caractères issus de deux
systèmes différents :

|  Classe de hauteur   | Note MIDI | Système 1 | Système 2 |
| :------------------: | :-------: | :-------: | :-------: |
|          Do          |    60     |     0     |     c     |
| Do dièse / Ré bémol  |    61     |     1     |     C     |
|          Ré          |    62     |     2     |     d     |
| Ré dièse / Mi bémol  |    63     |     3     |     D     |
|          Mi          |    64     |     4     |     e     |
|          Fa          |    65     |     5     |   f / E   |
| Fa dièse / Sol bémol |    66     |     6     |     F     |
|         Sol          |    67     |     7     |     g     |
| Sol dièse / La bémol |    68     |     8     |     G     |
|          La          |    69     |     9     |     a     |
| La dièse / Si bémol  |    70     |   x / X   |     A     |
|    Si / Do bémol     |    71     |   y / Y   |     b     |
|       Si dièse       |    72     |           |     B     |

- Les signes des deux systèmes peuvent être combinés.
- Pour changer l'octave d'une note, on la fait suivre d'autant de `+` qu'on
  souhaite monter ou d'autant de `-` qu'on souhaite descendre. Exemples : `4+`
  correspond à la note MIDI 86 (E5), `g--` correspond à la note MIDI 43 (G2),
  `0+++` correspond à la note MIDI 96 (C7).
- Les accords se notent en combinant des symboles de hauteurs au sein de
  chevrons. Exemple : `<0378>` est une triade mineure dont la fondamentale est
  `0` avec une quinté augmentée.
- TODO : Notation par intervalles à partir d'un pitch de départ ou du dernier
  pitch.

## `🧊 Création de patterns`

```sh
P0.P: 02400240457457
P0.R: 44444444442442
```

<!--
#### Hauteurs et rythme intégrés

```sh
P0.PR=aabaababaabaaaba[bbbb]

# équivalent à

P0.P=aabaababaabaaababbbb
P0.R=8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 32 32 32 32
```

Les sauts d'octave persistant se notent avec les caractères `^` ou `/` (pour monter d'un octave) et `v` ou `\` (pour descendre d'un octave).

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
P0 > fir.mid
```

### ÉCRITURE

Une mélodie à la croche :

```
P0 = 048319BBA84A47100BA00A0154B9000A
P0?GR:8
P0 > fir.mid
```

Une séquence d'accords :

```
P0.n = <72+> <73+> <3A> <7-2>
P0.r = 8*3 8*5
P0.r = 4. 2_8 # équivalent
P0 > fir.mid
```

### EFFETS

Une note unique répétée 111 fois avec 50% de chance que l'octave varie (-2,
-1, 1) :

```
P0 = x
P0 => (roct -2 +1 0.5) => P1
P1 * 111 > fir.mid
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

### VALEURS PAR DÉFAUT DES PARAMÈTRES

- global BPM = 120
- global PPQ = 480
- default midi note = 60
- default TS = 4/4
- default GR = 4
- default time unit = 4
- default pattern length = content|measure -->

# `🌃 Exemples`

# `👾 Cool stuff`

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
