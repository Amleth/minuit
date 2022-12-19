from colorama import Back, Fore, Style
import datetime
import mido
import numpy as np
from pprint import pprint

################################################################################
# MIDI
################################################################################


def get_port(myportname):
    ports = mido.get_output_names()
    for p in ports:
        if p.startswith(myportname):
            return p


def open_port(myportname):
    return mido.open_output(get_port(myportname))


################################################################################
# SCORE MANAGEMENT
################################################################################


def midi_make_messages(score):
    position = 0
    messages = []

    for e in score:
        if type(e) is float or type(e) is int or type(e) is np.float64:
            position += e
        elif type(e) is dict:
            e["n"] = e.get("n", 60)
            e["t"] = e.get("t", "note_on")
            if e["t"] == "note_on":
                e["d"] = e.get("d", 0)
                messages.append(
                    mido.Message(
                        "note_on",
                        channel=e.get("c", 0),
                        note=e["n"],
                        velocity=e.get("v", 127),
                        time=e["time"] if "time" in e else position,
                    )
                )
                messages.append(
                    mido.Message(
                        "note_off",
                        channel=e.get("c", 0),
                        note=e["n"],
                        velocity=0,
                        time=(e["time"] if "time" in e else position) + e["d"],
                    )
                )

    # Ajustement des temps (car on a écrit des positions absolues, ce qui ne va pas pour MIDO)
    for m in messages:
        m.time = int(m.time * 480)
    messages = sorted(messages, key=lambda k: (k.time, k.type))
    times = [m.time for m in messages]
    delta = [times[n] - times[n - 1] for n in range(1, len(times))]
    delta.insert(0, 0)
    for i in range(len(messages)):
        messages[i].time = delta[i]

    return messages


def make_midi_file(score, tempo=60):
    messages = midi_make_messages(score)

    # Make MIDI content
    mid = mido.MidiFile()
    track = mido.MidiTrack()
    mid.tracks.append(track)
    track.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(tempo)))
    for m in messages:
        track.append(m)
    
    # Write files
    path = "out/" + datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + ".mid"
    path_last = "reaper/last_mid MIDI 001.mid" 
    mid.save(path)
    mid.save(path_last)

    return mido.MidiFile(path)


def play_score(score, outport, tempo=60):
    mid = make_midi_file(score, tempo)

    outport = open_port(outport)
    outport.panic()

    for m in mid.play():
        outport.send(m)
        if m.type != "note_off":
            print(m)
    outport.close()
