import React, {useReducer, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    styled,
    css
} from '@stitches/react';
import {Div} from "./Div";
import {Button} from "./Button";

const StyledHero = styled('div', {
    position: 'relative',
    height: '36px',
    width: '36px',
})

const StyledHeroPortrait = styled('div', {
    borderRadius: '50%',
    background: 'white',
    width: '100%',
    height: '100%',

})

const StyledHeroArmor = styled('input', {
    backgroundColor: 'gray',
    color: 'white',
    position: 'absolute',
    fontSize: '20px',
    left: '-8px',
    bottom: '0',
    width: '24px',
    height: '24px',
})
const StyledHeroLife = styled('input', {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '20px',
    right: '-8px',
    bottom: '0',
    width: '24px',
    height: '24px',
})

interface Buff{
    attack?: number;
    health?: number;
}


interface Minion {
    health: number;
    attack: number;
    modifiers?: string[];
}

interface Card {
    filename: string;
    name: string;
    activation_function?: ()=>void;
    end_of_turn_function?: ()=>void;
}

export const App = () => {
    // settings
    const [playerHasGuff, setPlayerHasGuff] = useState<boolean>(false);

    // --- Gamestate ----

    // player
    const [playerBoardState, setPlayerBoardState] = useState<Minion[]>([]);

    const [playersLife, setPlayersLife] = useState<number>(30);
    const [playersArmor, setPlayersArmor] = useState<number>(0);
    const [playersAttack, setPlayersAttack] = useState<number>(0);
    const [playerTotalMana, setPlayerTotalMana] = useState<number>(0);
    const [playerFullMana, setPlayerFullMana] = useState<number>(8);

    // lasting effects
    const [celestialAlignment, setCelestialAlignment] = useState<boolean>(false);
    const [frostwolfKennels, setFrostwolfKennels] = useState<boolean>(false);

    // opponent
    const [opponentBoardState, setOpponentBoardState] = useState<Minion[]>([]);

    const [opponentsLife, setOpponentsLife] = useState<number>(30);
    const [opponentsArmor, setOpponentsArmor] = useState<number>(0);
    const [opponentsMana, setOpponentsMana] = useState<number>(8);

    // stats
    const [buffedMinionsInHand, setBuffedMinionsInHand] = useState<Buff>({})
    const [armorGain, setArmorGain] = useState<number>(0);

    const [addedFriendlyTaunts, setAddedFriendlyTaunts] = useState<number>(0);
    const [addedEnemyTaunts, setAddedEnemyTaunts] = useState<number>(0);

    const [damageToEnemyMinions, setDamageToEnemyMinions]  = useState<number>(0);
    const [damageToFriendlyMinions, setDamageToFriendlyMinions]  = useState<number>(0);

    const [damageToEnemyHero, setDamageToEnemyHero]  = useState<number>(0);
    const [damageToFriendlyHero, setDamageToFriendlyHero]  = useState<number>(0);

    const [cardsDrawn, setCardsDrawn] = useState<number>(0);
    const [attackGain, setAttackGain] = useState<number>(0);

    const [friendlyMinionDifferential, setFriendlyMinionDifferential] = useState<number>(0);
    const [friendlyStatsDifferential, setFriendlyStatsDifferential] = useState<Buff>({});

    const [enemyMinionDifferential, setEnemyMinionDifferential] = useState<number>(0);
    const [enemyStatsDifferential, setEnemyStatsDifferential] = useState<Buff>({});


    const updateFriendlyMinionAt = (index: number, newValue: Minion) => {
        setPlayerBoardState([
            ...playerBoardState.slice(0, index),
            newValue,
            ...playerBoardState.slice(index)
        ]);
    }
    const updateOpponentsMinionAt = (index: number, newValue: Minion) => {
        setOpponentBoardState([
            ...opponentBoardState.slice(0, index),
            newValue,
            ...opponentBoardState.slice(index)
        ]);
    }

    const reset = () => {
        setPlayersLife(30);
        setOpponentsLife(30);
        setPlayersArmor(0);
        setOpponentsArmor(0);
        setPlayersAttack(0);
        setPlayerTotalMana(8);
        setPlayerFullMana(8);
        setCelestialAlignment(false);
        setFrostwolfKennels(false);
    }

    const cardPool: Card[] = [
        {
            filename: 'aquatic_form',
            name: 'Aquatic Form',
            activation_function: ()=>{
                setCardsDrawn(cardsDrawn+1);
            }
        },
        {
            filename: 'azsharan_gardens',
            name: 'Azsharan Gardens',
            activation_function: ()=>{
                setBuffedMinionsInHand({
                    attack: buffedMinionsInHand.attack || 0 + 1,
                    health: buffedMinionsInHand.health || 0 + 1
                });
            }
        },
        {
            filename: 'best_in_shell',
            name: 'Best in Shell',
            activation_function: ()=> {
                const boardSize = playerBoardState.length;
                if(boardSize === 7) return;

                const tauntsToSummon: Minion[] = [];

                const statsDifferential = {attack: 0, health: 0};
                let minionsDifferential = 0;
                let addedTaunts = 0;

                while(tauntsToSummon.length < 7 - boardSize && tauntsToSummon.length < 2){
                    tauntsToSummon.push({attack: 2, health: 7, modifiers: ['taunt']})

                    statsDifferential.attack = statsDifferential.attack + 2;
                    statsDifferential.health = statsDifferential.health + 7;
                    minionsDifferential+=1;
                    addedTaunts+=1;
                }
                setPlayerBoardState([...playerBoardState, ...tauntsToSummon]);
                setFriendlyStatsDifferential({
                    attack: friendlyStatsDifferential.attack || 0 + statsDifferential.attack,
                    health: friendlyStatsDifferential.health || 0 + statsDifferential.health
                });
                setFriendlyMinionDifferential(friendlyMinionDifferential + minionsDifferential);
                setAddedFriendlyTaunts(addedFriendlyTaunts + addedTaunts);
            }
        },
        {
            filename: 'capture_coldtooth_mine',
            name: 'Capture Coldtooth Mine',
            activation_function: ()=>{
                setCardsDrawn(cardsDrawn+1);
            }
        },
        {
            filename: 'celestial_alignment',
            name: 'Celestial Alignment',
            activation_function: ()=>{
                setCelestialAlignment(true);
                setPlayerTotalMana(0);
                setPlayerFullMana(0);
                setOpponentsMana(0);
            }
        },
        {
            filename: 'composting',
            name: 'Composting',
            activation_function: () => {
                setPlayerBoardState(
                    playerBoardState.map((minion) => {
                        return {
                            ...minion,
                            modifiers: [
                                ...(minion.modifiers || []),
                                'composting'
                            ]
                        }
                    })
                )
            }
        },
        {
            filename: 'earthen_scales',
            name: 'Earthen Scales',
            activation_function: ()=>{
                if(playerBoardState.length === 0) return;

                const randomMinionIndex = Math.floor(Math.random() * playerBoardState.length);
                const randomMinion = playerBoardState[randomMinionIndex];
                updateFriendlyMinionAt(randomMinionIndex, {
                    ...playerBoardState[randomMinionIndex],
                    attack: playerBoardState[randomMinionIndex].attack + 1,
                    health: playerBoardState[randomMinionIndex].health + 1
                });
                setFriendlyStatsDifferential({
                    attack: friendlyStatsDifferential.attack || 0 + 1,
                    health: friendlyStatsDifferential.health || 0 + 1
                })
                setPlayersArmor(playersArmor + randomMinion.attack + 1)
                setArmorGain(armorGain + randomMinion.attack + 1);
            }
        },
        {
            filename: 'feral_rage',
            name: 'Feral Rage',
            activation_function: ()=> {
                if(Math.random() > .5){
                    setPlayersAttack(playersAttack+4);
                    setAttackGain(attackGain + 4);
                } else {
                    setPlayersArmor(playersArmor+8);
                    setArmorGain(armorGain+8);
                }
            }
        },
        {
            filename: 'flipper_friends',
            name: 'Flipper Friends',
            activation_function: ()=>{
                const boardSize = playerBoardState.length;
                if(boardSize === 7) return;

                const statsDifferential = {attack: 0, health: 0};
                let minionsDifferential = 0;
                let addedTaunts = 0;

                if(Math.random() > .5){
                    setPlayerBoardState([...playerBoardState, {attack: 6, health: 6, modifiers: ['taunt']}])
                    statsDifferential.attack = 6;
                    statsDifferential.health = 6;
                    addedTaunts = 1;
                    minionsDifferential = 1;
                } else {
                    const ottersToSummon: Minion[] = [];
                    while(ottersToSummon.length < 7 - boardSize && ottersToSummon.length < 6){
                        ottersToSummon.push({attack: 1, health: 1, modifiers: ['rush']});
                        statsDifferential.attack += 1;
                        statsDifferential.health += 1;
                        minionsDifferential += 1;
                    }
                    setPlayerBoardState([...playerBoardState, ...ottersToSummon]);
                }
                setFriendlyMinionDifferential(friendlyMinionDifferential+minionsDifferential);
                setFriendlyStatsDifferential({
                    attack: friendlyStatsDifferential.attack || 0 + statsDifferential.attack,
                    health: friendlyStatsDifferential.health || 0 + statsDifferential.health
                });
                setAddedFriendlyTaunts(addedFriendlyTaunts+addedTaunts);
            }
        },
        {
            filename: 'force_of_nature',
            name: 'Force of Nature',
            activation_function: () => {
                const boardSize = playerBoardState.length;
                if(boardSize === 7) return;
                const treantsToSummon: Minion[] = [];
                while(treantsToSummon.length < 7 - boardSize && treantsToSummon.length < 3){
                    treantsToSummon.push({attack: 2, health: 2})
                }
                setPlayerBoardState([...playerBoardState, ...treantsToSummon])
            }
        },
        {
            filename: 'frostwolf_kennels',
            name: 'Frostwolf Kennels',
            end_of_turn_function: () => {
                setFrostwolfKennels(true);
                const boardSize = playerBoardState.length;
                if(boardSize === 7) return;
                setPlayerBoardState([...playerBoardState, {attack: 2, health: 2, modifiers: ['stealth']}])
            }
        },
        {
            filename: 'heart_of_the_wild',
            name: 'Heart of the Wild',
            activation_function: () => {
                if(playerBoardState.length + opponentBoardState.length === 0) return;

                const randomMinionIndex = Math.floor(Math.random() * (playerBoardState.length + opponentBoardState.length));
                if(randomMinionIndex < playerBoardState.length){
                    updateFriendlyMinionAt(randomMinionIndex, {
                        ...playerBoardState[randomMinionIndex],
                        attack: playerBoardState[randomMinionIndex].attack + 2,
                        health: playerBoardState[randomMinionIndex].health + 2
                    })
                } else {
                    const opponentIndex = randomMinionIndex - playerBoardState.length;
                    updateOpponentsMinionAt(opponentIndex, {
                        ...opponentBoardState[opponentIndex],
                        attack: opponentBoardState[randomMinionIndex].attack + 2,
                        health: opponentBoardState[randomMinionIndex].health + 2
                    });

                }
            }
        }
    ];



  return  (
      <Div css={{display: 'flex' }}>
          {/* Played cards */}
          <Div css={{flex:1}}>
              <h2>Played cards</h2>
          </Div>
          {/* Board */}
          <Div css={{display: 'flex', flexDirection: 'row', flex: 2}}>
            {/* Opponent's hero */}
              <Div css={{display: 'flex', justifyContent: 'center'}}>
                <StyledHero>
                    <StyledHeroPortrait />
                    <StyledHeroArmor type={'number'} value={opponentsArmor} onChange={(e)=>{setOpponentsArmor(parseInt(e.target.value))}}/>
                    <StyledHeroLife type={'number'} value={opponentsLife} onChange={(e)=>{setOpponentsLife(parseInt(e.target.value))}}/>
                </StyledHero>
              </Div>
              {/* Opponent Actions */}
              <Div css={{display: 'flex', 'gap': '1rem'}}>
                  <Button>Empty</Button>
                  <Button>Small</Button>
                  <Button>Big</Button>
              </Div>
          </Div>
          {/* Stats */}
          <Div css={{flex:1}}>
              <h2>Stats</h2>
          </Div>
      </Div>
  );
};