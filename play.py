import mido
from mido import MidiFile

mid = MidiFile("bim.mid")
p = None
for x in mido.get_output_names():
    if x.startswith('MINUIT '):
        p = x

port = mido.open_output(p)

for msg in mid.play():
    print(msg)
    port.send(msg)