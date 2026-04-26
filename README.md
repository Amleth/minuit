# Minuit

## Documentation

### EXPRESSION DES GRANDEURS MUSICALES

#### Expression des valeurs ryhtmiques

- Les valeurs rythmiques se notent avec des nombres : `1` (ronde), `2` (blanche), `4` (noire), `8` (croche), `16` (double croche), `32` (triple croche), `64` (quadruple croche)... mais aussi `17` (un dix-septème de ronde), `35` (un trente-cinquième de ronde), `1/4` (quatre rondes), `18/5` (cinq dix-huitièmes de ronde), etc. Un triolet de croche se note `12 12 12`.
- Le `.` a la même sémantique qu'en solfège. Ainsi, `1.` est une ronde pointée, et est équivalent au nombre `2/3` (trois blanches).
- L'underscore permet de lier des valeurs, comme sur une partition. Ainsi, `2_4` est une blanche liée à une noire, équivalent au nombre `4/3` (trois noires).

#### Expression des hauteurs

- Les douze classes de hauteur se notent 
- Par défaut, `0` ou `c` représente la note MIDI 60 (C4).
- Les sauts d'octave se notent avec les caractères `^` ou `/` (pour monter d'un octave) et `v` ou `\` (pour descendre d'un octave).
- Changer d'octave se fait avec `+` et `-` comme annotation de la note. `00+0++0+++` code les notes MIDI C4 C5 C6 C7.
- Les accords se notent avec des chevrons : `<0378>` est une triade mineure dont la fondamentale est `0` (par défaut, un do) avec une quinté augmentée.
- TODO : Notation par intervalles à partir d'un pitch de départ ou du dernier pitch.

### CRÉATION DES PATTERNS

#### Hauteurs et rythme intégrés

```sh
P0.PR=aabaababaabaaaba[bbbb]

# équivalent à

P0.P=aabaababaabaaababbbb
P0.R=8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 32 32 32 32
```

#### Grille

Mais ne pas encore la spécifier car on ne sait pas comment introduire :
	- la subdivision
	- la sémantique des caractères
	- le shifting
On pourrait utiliser l'espace comme séparateur optionnel non sémantique

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

Une note unique répétée 111 fois avec 50% de chance que l'octave varie (-2, -1, 1) :
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
- default pattern length = content|measure

## Cool stuff

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