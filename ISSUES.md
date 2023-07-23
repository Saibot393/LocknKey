## Compatibility issues

### UI
Some game system structure their item UI somewhat strange and therefore require extra care when adding the Lock & Key tab. Should you encounter a bug where the tab is not visible or does not have any content, please [open an issue](https://github.com/Saibot393/LocknKey/issues) and let me know which game system causes the issue.

### Key items

#### Key does not generate or has strange item type
All game system use different item types. While the module tries to find an appropriate type for for keys some systems may slip through. If you cannot generate valid keys or you think keys should be another item type please [open an issue](https://github.com/Saibot393/LocknKey/issues) and let me know which game system you are using and, if possible, let me know which item type you would say would be the best fit for keys. 

In the mean time you may also remedy the problem by changing the item type in the settings (Type of key item).

#### Keys do not work
Please check if the key has stacked with another key in the characters inventory. If keys are stacked they may loose some or all key IDs rendering them useless. This behaviour is strongly system dependent and i have so far not found any solutions. Should any system behave extraordinarily strange in this regard or should the key not work even though it is not stacked please [open an issue](https://github.com/Saibot393/LocknKey/issues).

### Lock picking

#### Lock picking formula does not work
The formulas are extremely system specific and rules based. I have therefore only included a few formulas. If your system of choice is not included/does not work [open an issue](https://github.com/Saibot393/LocknKey/issues) and include the system, the relevant lockpicking rules (e.g. a link to a wiki) and your foundry version. You can also create your own formula (please share it with me, so i can include it in the module):
- You can use any die size and number in roles (e.g. 5d3)
  - You can put a "kh" after a dice roll to only keep the highest result (e.g. 2d20kh) ("kl" to keep the lowest)
  - Add a "dh" to drop the highest result ("dl" to drop the lowest)
  - You can add a number after these to modify the number of dice kept/droped (e.g. 3d20dl2)
  - Add a "r" combined with a number to reroll if that number is rolled (or "r<="/"r>=" for rolls lower/higher or equal to this number)
- enter "game.actors.find(a=>true).system" in the F12 console to get an overview over all available values for rolls  
- You can use +,-,*,/ to connect several values

### Languages
Should you want additional translations to be added please [open an issue](https://github.com/Saibot393/LocknKey/issues) and tell me which language you would like to be added. I can then tell you how to go about translating the module so that i can add the translation (of course credited to you) to the module.

### Other
Should you encounter any other issues please [let me know](https://github.com/Saibot393/LocknKey/issues)
