import React, {useEffect, useState} from 'react';
import './App.css';
import {
    styled
} from '@stitches/react';
import {Div} from "./Div";
import {Button} from "./Button";
import {ListItem} from "./ListItem";
import {Image} from "./Image";
import {Alert, Snackbar, Tooltip} from "@mui/material";
import {Span} from "./Span";
import ShieldIcon from '@mui/icons-material/Shield';
import StyleIcon from '@mui/icons-material/Style';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {useAsyncReference} from "./hooks/useAsyncReference";
import DiamondIcon from '@mui/icons-material/Diamond';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PetsIcon from '@mui/icons-material/Pets';

const StyledConvoke = styled('img',{
    width: '256px',
    height: 'auto',
    cursor: 'pointer',
    transition: 'all .3s',
    '&:hover':{
       transform: 'scale(1.1)',
    }
});

const StyledLegendWrapper = styled('div',{
    display: 'flex', gap: '.2rem', alignItems: 'center'
});

const StyledLegendColor = styled('div',{
    width: '8px', height: '8px', borderRadius: '50%'
})


const StyledStatInput = styled('input',{
    border: 'none',
    borderRadius: '50%',
    textAlign: 'center',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        appearance: 'none',
    },
    '&[type=number]':{
        appearance: 'textfield'
    }
})

const StyledHero = styled('div', {
    position: 'relative',
    height: '64px',
    width: '64px',
})

const StyledMinion = styled('div', {
    position: 'relative',
    height: '48px',
    width: '48px',
    borderRadius: '50%',
    outline: '4px solid silver',
    background: 'white',
})

const StyledHeroPortrait = styled('div', {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid gray',
    width: '100%',
    height: '100%',
});


const StyledHeroArmor = styled(StyledStatInput, {
    backgroundColor: 'gray',
    color: 'white',
    position: 'absolute',
    fontSize: '14px',
    transform: 'translateX(50%)',
    right: '0',
    bottom: '28px',
    width: '24px',
    height: '18px',
    borderRadius: '10px'
});
const StyledHeroLife = styled(StyledStatInput, {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '20px',
    position: 'absolute',
    transform: 'translateX(50%)',
    right: '0',
    bottom: '0',
    width: '24px',
    height: '24px',
});

const StyledHeroAttack = styled(StyledStatInput,{
    backgroundColor: 'orange',
    color: 'white',
    fontSize: '20px',
    position: 'absolute',
    transform: 'translateX(-50%)',
    left: '0',
    bottom: '0',
    width: '24px',
    height: '24px',
});

const StyledGuffCheckboxWrapper = styled('div',{
    left: '-200px',
    top: '50%',
    transform: 'translateY(-50%)',
    position: 'absolute',
    fontSize: '14px'
});

const StyledPlayerMana = styled('div',{
    color: 'white',
    position: 'absolute',
    fontSize: '20px',
    right: '-100px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#879ac7',
    borderRadius: '14px',
    display: 'flex',
    padding: '0.15rem',
})

const StyledHeroMana = styled(StyledStatInput, {
    backgroundColor: '#3370ff',
    color: 'white',
    fontSize: '20px',
    width: '24px',
    height: '24px',
});

const StyledHeroManaTotal = styled(StyledStatInput, {
    backgroundColor: '#143278',
    color: 'white',
    position: 'absolute',
    fontSize: '20px',
    right: '-48px',
    top: '0',
    width: '24px',
    height: '24px',
});

const StyledMinionAttack = styled(StyledStatInput, {
    backgroundColor: 'orange',
    color: 'white',
    fontSize: '14px',
    position: 'absolute',
    transform: 'translateX(-50%)',
    left: '0',
    bottom: '0',
    width: '20px',
    height: '20px',
});

const StyledMinionModifiers = styled('div',{
    fontSize: '32px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'help'
})

const StyledMinionHealth = styled(StyledStatInput, {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '14px',
    position: 'absolute',
    right: '0',
    transform: 'translateX(50%)',
    bottom: '0',
    width: '20px',
    height: '20px',
});

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
    const [, forceRender] = useState(false);

    // settings
    const [playerHasGuff, setPlayerHasGuff] = useAsyncReference<boolean>(false);

    // --- Gamestate ----

    // player
    const [playerBoardState, setPlayerBoardState] = useAsyncReference<Minion[]>([]);

    const [playersLife, setPlayersLife] = useAsyncReference<number>(30);
    const [playersArmor, setPlayersArmor] = useAsyncReference<number>(0);
    const [playersAttack, setPlayersAttack] = useAsyncReference<number>(0);
    const [playerTotalMana, setPlayerTotalMana] = useAsyncReference<number>(10);
    const [playerFullMana, setPlayerFullMana] = useAsyncReference<number>(10);

    // lasting effects
    const [celestialAlignment, setCelestialAlignment] = useAsyncReference<boolean>(false);
    const [frostwolfKennels, setFrostwolfKennels] = useAsyncReference<boolean>(false);

    // opponent
    const [opponentBoardState, setOpponentBoardState] = useAsyncReference<Minion[]>([]);

    const [opponentsLife, setOpponentsLife] = useAsyncReference<number>(30);
    const [opponentsArmor, setOpponentsArmor] = useAsyncReference<number>(0);
    const [opponentsMana, setOpponentsMana] = useAsyncReference<number>(10);

    // stats
    const [buffedMinionsInHand, setBuffedMinionsInHand] = useAsyncReference<Buff>({})
    const [armorGain, setArmorGain] = useAsyncReference<number>(0);

    const [addedFriendlyTaunts, setAddedFriendlyTaunts] = useAsyncReference<number>(0);
    const [addedEnemyTaunts, setAddedEnemyTaunts] = useAsyncReference<number>(0);

    const [damageToEnemyHero, setDamageToEnemyHero]  = useAsyncReference<number>(0);
    const [damageToFriendlyHero, setDamageToFriendlyHero]  = useAsyncReference<number>(0);

    const [cardsDrawn, setCardsDrawn] = useAsyncReference<number>(0);
    const [attackGain, setAttackGain] = useAsyncReference<number>(0);

    const [friendlyMinionDifferential, setFriendlyMinionDifferential] = useAsyncReference<number>(0);
    const [friendlyStatsDifferential, setFriendlyStatsDifferential] = useAsyncReference<Buff>({});

    const [enemyMinionDifferential, setEnemyMinionDifferential] = useAsyncReference<number>(0);
    const [enemyStatsDifferential, setEnemyStatsDifferential] = useAsyncReference<Buff>({});

    const [gainedUsableMana, setGainedUsableMana] =useAsyncReference<number>(0);
    const [gainedPermanentMana, setGainedPermanentMana] =useAsyncReference<number>(0);

    // played cards
    const [playedCards, setPlayedCards] = useAsyncReference<Card[]>([]);

    // State only
    const [isNotEnoughManaPopupVisible, setIsNotEnoughManaPopupVisible] = useState(false);
    const [consecutiveClicks, setConsecutiveClicks] = useState(0);

    const dealRandomDamage = (amount: number) => {
        const randomIndex = Math.floor(Math.random() * ((playerBoardState.current||[]).length + (opponentBoardState.current||[]).length + 2));
        if(randomIndex >= 0 && randomIndex < (playerBoardState.current||[]).length){
            dealDamageToFriendlyMinionAt(randomIndex, amount);
        } else if(randomIndex >= (playerBoardState.current||[]).length && randomIndex < (playerBoardState.current||[]).length + (opponentBoardState.current||[]).length ){
            const opponentIndex = randomIndex - (playerBoardState.current||[]).length;
            dealDamageToOpponentMinionAt(opponentIndex, amount)
        } else if(randomIndex === (playerBoardState.current||[]).length + (opponentBoardState.current||[]).length + 1){
            dealDamageToPlayerFace(amount);
        } else if(randomIndex === (playerBoardState.current||[]).length + (opponentBoardState.current||[]).length + 2){
            dealDamageToOpponentFace(amount);
        }
    }

    const cardPool: Card[] = [
        {
            filename: 'aquatic_form',
            name: 'Aquatic Form',
            activation_function: ()=>{
                setCardsDrawn((cardsDrawn.current || 0) + 1);
            }
        },
        {
            filename: 'azsharan_gardens',
            name: 'Azsharan Gardens',
            activation_function: ()=>{
                setBuffedMinionsInHand({
                    attack: (buffedMinionsInHand.current?.attack || 0) + 1,
                    health: (buffedMinionsInHand.current?.health || 0) + 1
                });
            }
        },
        {
            filename: 'best_in_shell',
            name: 'Best in Shell',
            activation_function: ()=> {
                const summonedAmount = summonCopies(2, {attack: 2, health: 7, modifiers: ['taunt']})
                setAddedFriendlyTaunts((addedFriendlyTaunts.current || 0) + summonedAmount);
            }
        },
        {
            filename: 'capture_coldtooth_mine',
            name: 'Capture Coldtooth Mine',
            activation_function: ()=>{
                setCardsDrawn((cardsDrawn.current || 0)+1);
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
                setGainedUsableMana(0);
                setGainedPermanentMana(0);
            }
        },
        {
            filename: 'composting',
            name: 'Composting',
            activation_function: () => {
                setPlayerBoardState(
                    (playerBoardState.current || []).map((minion: Minion) => {
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
                if((playerBoardState.current || []).length === 0) return;

                const randomMinionIndex = Math.floor(Math.random() * (playerBoardState.current || []).length);
                const randomMinion = (playerBoardState.current || [])[randomMinionIndex];
                updateFriendlyMinionAt(randomMinionIndex, {
                    ...(playerBoardState.current || [])[randomMinionIndex],
                    attack: (playerBoardState.current || [])[randomMinionIndex].attack + 1,
                    health: (playerBoardState.current || [])[randomMinionIndex].health + 1
                });
                setFriendlyStatsDifferential( {
                    attack: (friendlyStatsDifferential.current?.attack || 0) + 1,
                    health: (friendlyStatsDifferential.current?.health || 0) + 1
                })
                setPlayersArmor((playersArmor.current||0) + randomMinion.attack + 1)
                setArmorGain((armorGain.current||0) + randomMinion.attack + 1);
            }
        },
        {
            filename: 'feral_rage',
            name: 'Feral Rage',
            activation_function: ()=> {
                if(Math.random() > .5){
                    setPlayersAttack((playersAttack.current || 0)+4);
                    setAttackGain((attackGain.current || 0) + 4);
                } else {
                    setPlayersArmor((playersArmor.current || 0)+8);
                    setArmorGain((armorGain.current || 0)+8);
                }
            }
        },
        {
            filename: 'flipper_friends',
            name: 'Flipper Friends',
            activation_function: ()=>{
                const boardSize = (playerBoardState.current ||[]).length;
                if(boardSize >= 7) return;
                if(Math.random() > .5){
                    const summonedAmount = summonCopies(1, {attack: 6, health: 6, modifiers: ['taunt']})
                    setAddedFriendlyTaunts((addedFriendlyTaunts.current||0) + summonedAmount);
                } else {
                    summonCopies(6, {attack: 1, health: 1, modifiers: ['rush']})
                }
            }
        },
        {
            filename: 'force_of_nature',
            name: 'Force of Nature',
            activation_function: () => {
                summonCopies(3, {attack: 2, health: 2})
            }
        },
        {
            filename: 'frostwolf_kennels',
            name: 'Frostwolf Kennels',
            end_of_turn_function: () => {
                setFrostwolfKennels(true);
                summonCopies(1, {attack: 2, health: 2, modifiers: ['stealth']})
            }
        },
        {
            filename: 'heart_of_the_wild',
            name: 'Heart of the Wild',
            activation_function: () => {
                if((playerBoardState.current||[]).length + (opponentBoardState.current||[]).length === 0) return;

                const randomMinionIndex = Math.floor(Math.random() * ((playerBoardState.current||[]).length + (opponentBoardState.current||[]).length));

                if(randomMinionIndex < (playerBoardState.current||[]).length){
                    updateFriendlyMinionAt(randomMinionIndex, {
                        ...(playerBoardState.current||[])[randomMinionIndex],
                        attack: (playerBoardState.current||[])[randomMinionIndex].attack + 2,
                        health: (playerBoardState.current||[])[randomMinionIndex].health + 2
                    })
                    setFriendlyStatsDifferential( {
                        attack: (friendlyStatsDifferential.current?.attack || 0) + 2,
                        health: (friendlyStatsDifferential.current?.health || 0) + 2
                    })
                } else {
                    const opponentIndex = randomMinionIndex - (playerBoardState.current||[]).length;
                    updateOpponentsMinionAt(opponentIndex, {
                        ...(opponentBoardState.current||[])[opponentIndex],
                        attack: (opponentBoardState.current||[])[randomMinionIndex].attack + 2,
                        health: (opponentBoardState.current||[])[randomMinionIndex].health + 2
                    });
                    setEnemyStatsDifferential({
                        attack: (enemyStatsDifferential.current?.attack || 0) + 2,
                        health: (enemyStatsDifferential.current?.health || 0) + 2}
                    )
                }
            }
        },
        {
            name: 'Innervate',
            filename: 'innervate',
            activation_function: ()=>{
                const maxMana = playerHasGuff.current ? 20 : 10;
                if((playerFullMana.current || 0 ) < maxMana){
                    setPlayerFullMana((playerFullMana.current || 0) + 1);
                    setGainedUsableMana((gainedUsableMana.current || 0) + 1)
                }
            }
        },
        {
            name: 'Kodo Mount',
            filename: 'kodo_mount',
            activation_function: () => {
                if((playerBoardState.current||[]).length + (opponentBoardState.current||[]).length === 0) return;

                const randomMinionIndex = Math.floor(Math.random() * ((playerBoardState.current||[]).length + (opponentBoardState.current||[]).length));

                if(randomMinionIndex < (playerBoardState.current||[]).length){
                    updateFriendlyMinionAt(randomMinionIndex, {
                        ...(playerBoardState.current||[])[randomMinionIndex],
                        attack: (playerBoardState.current||[])[randomMinionIndex].attack + 4,
                        health: (playerBoardState.current||[])[randomMinionIndex].health + 2,
                        modifiers: [...(playerBoardState.current||[])[randomMinionIndex]?.modifiers || [], 'rush', 'kodo mount']
                    })
                    setFriendlyStatsDifferential( {
                        attack: (friendlyStatsDifferential.current?.attack || 0) + 4,
                        health: (friendlyStatsDifferential.current?.health || 0) + 2
                    })
                } else {
                    const opponentIndex = randomMinionIndex - (playerBoardState.current||[]).length;
                    updateOpponentsMinionAt(opponentIndex, {
                        ...(opponentBoardState.current||[])[opponentIndex],
                        attack: (opponentBoardState.current||[])[opponentIndex].attack + 4,
                        health: (opponentBoardState.current||[])[opponentIndex].health + 2,
                        modifiers: [...(opponentBoardState.current||[])[opponentIndex]?.modifiers || [], 'rush', 'kodo mount']

                    });
                    setEnemyStatsDifferential({
                        attack: (enemyStatsDifferential.current?.attack || 0) + 4,
                        health: (enemyStatsDifferential.current?.health || 0) + 2}
                    )
                }
            }
        },
        {
            name: 'Living Roots',
            filename: 'living_roots',
            activation_function: ()=>{
                if(Math.random() > .5){
                    dealRandomDamage(2);
                } else {
                    const boardSize = (playerBoardState.current ||[]).length;
                    if(boardSize >= 7) return;
                    const statsDifferential = {attack: 0, health: 0};
                    let minionsDifferential = 0;
                    const saplingsToSummon: Minion[] = [];
                    while(saplingsToSummon.length < 7 - boardSize && saplingsToSummon.length < 2){
                        saplingsToSummon.push({attack: 1, health: 1});
                        statsDifferential.attack += 1;
                        statsDifferential.health += 1;
                        minionsDifferential += 1;
                    }
                    setPlayerBoardState([...(playerBoardState.current||[]), ...saplingsToSummon]);
                    setFriendlyMinionDifferential((friendlyMinionDifferential.current||0) + minionsDifferential);
                    setFriendlyStatsDifferential( {
                        attack: (friendlyStatsDifferential.current?.attack || 0) + statsDifferential.attack,
                        health: (friendlyStatsDifferential.current?.health || 0) + statsDifferential.health
                    });

                }
            }
        },
        {
            name: 'Living Seed',
            filename: 'living_seed',
            activation_function: ()=>{
                setCardsDrawn((cardsDrawn.current || 0) + 1);
            }
        },
        {
            name: 'Mark of the Spikeshell',
            filename: 'mark_of_the_spikeshell',
            activation_function: () =>{

            }
        }
    ];

    const updateFriendlyMinionAt = (index: number, newValue: Minion) => {
        setPlayerBoardState([
            ...(playerBoardState.current||[]).slice(0, index),
            newValue,
            ...(playerBoardState.current||[]).slice(index+1)
        ]);
    }
    const updateOpponentsMinionAt = (index: number, newValue: Minion) => {
        setOpponentBoardState([
            ...(opponentBoardState.current||[]).slice(0, index),
            newValue,
            ...(opponentBoardState.current||[]).slice(index + 1)
        ]);
    }

    const removeFriendlyMinionAt = (index: number) => {
        setPlayerBoardState([
            ...(playerBoardState.current||[]).slice(0, index),
            ...(playerBoardState.current||[]).slice(index + 1)
        ]);
    }
    const removeOpponentsMinionAt = (index: number) => {
        setOpponentBoardState([
            ...(opponentBoardState.current||[]).slice(0, index),
            ...(opponentBoardState.current||[]).slice(index + 1)
        ]);
    }

    const dealDamageToFriendlyMinionAt = (index: number, amount: number)=> {
        const minion = (playerBoardState.current||[])[index];
        if(minion.health <= amount){
            removeFriendlyMinionAt(index);
            setFriendlyStatsDifferential({
                attack: ((friendlyStatsDifferential.current||{}).attack ||0) - minion.attack,
                health: ((friendlyStatsDifferential.current||{}).health ||0) - minion.health
            });
            setFriendlyMinionDifferential((friendlyMinionDifferential.current || 0) -1)
        } else {
            updateFriendlyMinionAt(index, {
                ...(playerBoardState.current||[])[index],
                health: (playerBoardState.current||[])[index].health - amount});
            setFriendlyStatsDifferential({
                ...(friendlyStatsDifferential.current||{}),
                health: ((friendlyStatsDifferential.current||{}).health ||0) - amount
            });
        }
    }
    const dealDamageToOpponentMinionAt = (index: number, amount: number)=> {
        const minion = (opponentBoardState.current||[])[index];
        if(minion.health <= amount){
            removeOpponentsMinionAt(index);
            setEnemyStatsDifferential({
                attack: ((enemyStatsDifferential.current||{}).attack ||0) - minion.attack,
                health: ((enemyStatsDifferential.current||{}).health ||0) - minion.health
            });
            setEnemyMinionDifferential((enemyMinionDifferential.current || 0) -1)
        } else {
            updateOpponentsMinionAt(index, {
                ...(opponentBoardState.current||[])[index],
                health: (opponentBoardState.current||[])[index].health - amount});
            setEnemyStatsDifferential({
                ...(enemyStatsDifferential.current||{}),
                health: ((enemyStatsDifferential.current||{}).health ||0) - amount
            });
        }
    }

    const dealDamageToPlayerFace = (amount: number)=>{
        let damageToArmor;
        const armor = playersArmor.current||0;
        if(armor > amount)
        {
            damageToArmor = amount;
        }
        else {
            damageToArmor = armor;
        }
        let damageToFace = amount - damageToArmor;
        setPlayersArmor((playersArmor.current||0)-damageToArmor);
        setPlayersLife((playersLife.current||0)-damageToFace);
        setDamageToFriendlyHero((damageToFriendlyHero.current||0) + amount);
    }
    const dealDamageToOpponentFace = (amount: number)=>{
        let damageToArmor;
        const armor = opponentsArmor.current||0;
        if(armor > amount)
        {
            damageToArmor = amount;
        }
        else {
            damageToArmor = armor;
        }
        let damageToFace = amount - damageToArmor;
        setOpponentsArmor((opponentsArmor.current||0)-damageToArmor);
        setOpponentsLife((opponentsLife.current||0)-damageToFace);
        setDamageToEnemyHero((damageToEnemyHero.current||0)+ amount)
    }

    const summonCopies = (amount: number, minion: Minion): number=>{
        const boardSize = (playerBoardState.current||[]).length;
        if(boardSize >= 7) return 0;
        const minionsToSummon: Minion[] = [];
        while(minionsToSummon.length < 7 - boardSize && minionsToSummon.length < amount){
            minionsToSummon.push(minion)
        }
        setPlayerBoardState([...(playerBoardState.current||[]), ...minionsToSummon])
        setFriendlyStatsDifferential( {
            attack: (friendlyStatsDifferential.current?.attack || 0) + minion.attack * minionsToSummon.length,
            health: (friendlyStatsDifferential.current?.health || 0) + minion.health * minionsToSummon.length
        });
        setFriendlyMinionDifferential((friendlyMinionDifferential.current||0) + minionsToSummon.length);
        return minionsToSummon.length;
    }

    const convoke = () =>{
        let neededMana = 10;
        if(celestialAlignment.current){
            neededMana = 1;
        }
        if((playerFullMana.current||0) >= neededMana){
            setPlayerFullMana((playerFullMana.current||0) - neededMana);
        } else {
            setIsNotEnoughManaPopupVisible(true);
            return;
        }
        setConsecutiveClicks(consecutiveClicks=>consecutiveClicks+1);
        const selectedCards = [];
        for(let i = 0; i < 8; i++){
            selectedCards.push(cardPool[Math.floor(Math.random()*cardPool.length)])
        }
        setPlayedCards(selectedCards);

        // On activation
        for(let i = 0; i < 8; i++){
            selectedCards[i].activation_function?.();
        }

        // On turn end
        for(let i = 0; i < 8; i++){
            selectedCards[i].end_of_turn_function?.();
        }
    }

    const reset = () => {
        setPlayersLife(30);
        setOpponentsLife(30);
        setPlayersArmor(0);
        setOpponentsArmor(0);
        setOpponentsMana(0);
        setPlayersAttack(0);
        setPlayerTotalMana(10);
        setPlayerFullMana(10);
        setCelestialAlignment(false);
        setFrostwolfKennels(false);
        setPlayedCards([]);
        setPlayerBoardState([]);
        setOpponentBoardState([]);

        setArmorGain(0);
        setCardsDrawn(0);
        setAddedFriendlyTaunts(0);
        setAddedEnemyTaunts(0);
        setAttackGain(0);
        setFriendlyMinionDifferential(0);
        setEnemyMinionDifferential(0);
        setFriendlyStatsDifferential({});
        setEnemyStatsDifferential({});
        setGainedUsableMana(0);
        setGainedPermanentMana(0);
        setBuffedMinionsInHand({});
        setDamageToFriendlyHero(0);
        setDamageToEnemyHero(0);
        setConsecutiveClicks(0);
    }

    const generateBoard = (minStats: number, maxStats: number, minMinions: number, maxMinions: number): Minion[] => {
        const nbOfMinions = minMinions + Math.round(Math.random() * (maxMinions - minMinions));

        const generatedMinions: Minion[] = [];
        for(let i = 0; i < nbOfMinions; i++){
            generatedMinions.push({
                attack: minStats + Math.round(Math.random() * (maxStats - minStats)),
                health: minStats + Math.round(Math.random() * (maxStats - minStats))
            })
        }
        return generatedMinions;
    }

    const generateEmptyBoard = (forWho: 'player'|'opponent') => {
        if(forWho === 'player'){
            setPlayerBoardState([]);
        }
        if(forWho === 'opponent'){
            setOpponentBoardState([]);
        }
    }

    const generateSmallBoard = (forWho: 'player'|'opponent') => {
        const board = generateBoard(1, 5, 2, 4);
        if(forWho === 'player'){
            setPlayerBoardState(board);
        }
        if(forWho === 'opponent'){
            setOpponentBoardState(board);
        }
    }

    const generateBigBoard = (forWho: 'player'|'opponent') => {
        const board = generateBoard(3, 12, 4, 7);
        if(forWho === 'player'){
            setPlayerBoardState(board);
        }
        if(forWho === 'opponent'){
            setOpponentBoardState(board);
        }
    }

/*
    Doesn't seem to be working ever since I added the custom reference hook
    useEffect(()=>{
        generateSmallBoard('opponent');
        generateEmptyBoard('player');
    },[])*/

    useEffect(()=>{
        if(!playerHasGuff && (playerTotalMana.current||0) > 10){
            setPlayerTotalMana(10);
            setPlayerFullMana(10);
        }
    },[playerHasGuff?.current])


  return  (
    <>
        <Div css={{display: 'flex' }}>
          {/* Played cards */}
          <Div css={{flex:1, padding: '1rem'}}>
              <h2>Played cards</h2>
              <Div>
                  {(playedCards.current||[]).map((card: Card, index:number)=>{
                      return (
                      <Div css={{display: 'flex', alignItems: 'center', marginBottom: '.2rem'}}>{index+1}
                        <Image css={{width:'36px', height: 'auto'}} src={require(`./assets/${card.filename}.png`)}/>
                          {card.name}
                      </Div>)
                  })}
              </Div>
          </Div>
          {/* Board */}
          <Div css={{display: 'flex', flexDirection: 'column', flex: 3, padding: '1rem'}}>
            {/* Opponent's hero */}
              <Div css={{display: 'flex', justifyContent: 'center'}}>
                <StyledHero>
                    <StyledHeroPortrait>P2</StyledHeroPortrait>
                    <StyledHeroArmor min={0} type={'number'} value={opponentsArmor.current||0} onChange={(e)=>{setOpponentsArmor(parseInt(e.target.value))}}/>
                    <StyledHeroLife min={0} type={'number'} value={opponentsLife.current||0} onChange={(e)=>{setOpponentsLife(parseInt(e.target.value))}}/>
                    <StyledHeroMana min={0} type={'number'} css={{
                            position: 'absolute',
                            right: '-64px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                        value={opponentsMana.current||0} onChange={(e)=>{setOpponentsMana(parseInt(e.target.value))}}/>
                </StyledHero>
              </Div>
              {/* Opponent Actions */}
              <Div>Generate board for Opponent</Div>
              <Div css={{display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem'}}>
                  <Div css={{display: 'flex', gap: '1rem'}}>
                      <Button onClick={()=>generateEmptyBoard('opponent')}>Empty</Button>
                      <Button onClick={()=>generateSmallBoard('opponent')}>Small</Button>
                      <Button onClick={()=>generateBigBoard('opponent')}>Big</Button>
                  </Div>
                  <Div css={{display: 'flex', gap: '1rem'}}>
                      <Button disabled={(opponentBoardState.current||[]).length <= 0} onClick={()=>setOpponentBoardState([...(opponentBoardState.current||[]).slice(0, (opponentBoardState.current||[]).length - 1)])}>-</Button>
                      <Button disabled={(opponentBoardState.current||[]).length >= 7} onClick={()=>setOpponentBoardState([...(opponentBoardState.current||[]), {attack: 0, health: 1}])}>+</Button>
                  </Div>
              </Div>
              {/* Opponent's Minions */}
              <Div css={{display: 'flex', justifyContent: 'space-evenly', background: '#e0c5c3', paddingTop: '1rem', paddingBottom: '1rem', minHeight: '48px'}}>
                  {(opponentBoardState.current||[]).map((minion: Minion, index: number)=>(
                      <StyledMinion>
                        {(minion.modifiers||[]).length > 0 && <Tooltip title={(minion.modifiers||[]).join(', ')}><StyledMinionModifiers>*</StyledMinionModifiers></Tooltip>}
                        <StyledMinionAttack min={0} type={'number'} value={minion.attack} onChange={(e)=>updateOpponentsMinionAt(index,{...minion, attack: parseInt(e.target.value)})}/>
                        <StyledMinionHealth min={1} type={'number'} value={minion.health} onChange={(e)=>updateOpponentsMinionAt(index,{...minion, health: parseInt(e.target.value) > 0 ? parseInt(e.target.value): 1})}/>
                    </StyledMinion>
                  ))}
              </Div>

              {/* Main button */}
              <Div css={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <StyledConvoke onClick={convoke} src={require('./assets/convoke_the_spirits.png')}/>
                  <button onClick={reset}>Reset</button>
              </Div>

              {/* Player's Actions */}
              <Div>Generate board for player</Div>
              <Div css={{display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem'}}>
                  <Div css={{display: 'flex', gap: '1rem'}}>
                      <Button onClick={()=>generateEmptyBoard('player')}>Empty</Button>
                      <Button onClick={()=>generateSmallBoard('player')}>Small</Button>
                      <Button onClick={()=>generateBigBoard('player')}>Big</Button>
                  </Div>
                  <Div css={{display: 'flex', gap: '1rem'}}>
                      <Button disabled={(playerBoardState.current||[]).length <= 0} onClick={()=>setPlayerBoardState([...(playerBoardState.current||[]).slice(0, (playerBoardState.current||[]).length - 1)])}>-</Button>
                      <Button disabled={(playerBoardState.current||[]).length >= 7} onClick={()=>setPlayerBoardState([...(playerBoardState.current||[]), {attack: 0, health: 1}])}>+</Button>
                  </Div>
              </Div>
              {/* Player's Minions */}
              <Div css={{display: 'flex', justifyContent: 'space-evenly', background: '#c3cee0', paddingTop: '1rem', paddingBottom: '1rem', minHeight: '48px', marginBottom: '1rem'}}>
                  {(playerBoardState.current||[]).map((minion: Minion, index: number)=>(
                      <StyledMinion>
                          {(minion.modifiers||[]).length > 0 && <Tooltip title={(minion.modifiers||[]).join(', ')}><StyledMinionModifiers>*</StyledMinionModifiers></Tooltip>}
                          <StyledMinionAttack min={0} type={'number'} value={minion.attack} onChange={(e)=>updateFriendlyMinionAt(index,{...minion, attack: parseInt(e.target.value)})}/>
                          <StyledMinionHealth min={1} type={'number'} value={minion.health} onChange={(e)=>updateFriendlyMinionAt(index,{...minion, health: parseInt(e.target.value) > 0 ? parseInt(e.target.value): 1})}/>
                      </StyledMinion>
                  ))}
              </Div>

              {/* Player's hero */}
              <Div css={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
                  <StyledHero>
                      <StyledHeroPortrait>P1</StyledHeroPortrait>
                      <StyledGuffCheckboxWrapper>
                          <input type={"checkbox"} id={'guff'} name={'guff'} checked={playerHasGuff.current||false} onChange={(e)=>{setPlayerHasGuff(e.target.checked)}}/>
                          <label htmlFor={'guff'}>Guff (20 mana max)</label>
                      </StyledGuffCheckboxWrapper>
                      <StyledPlayerMana>
                          <StyledHeroMana min={0}
                                          max={playerHasGuff ? 20 : 10} type={'number'} value={playerFullMana.current||0} css={{position: 'initial'}}
                                          onChange={(e)=>{
                                              const max = playerHasGuff ? 20 : 10;
                                              const value = parseInt(e.target.value) > max ? max : parseInt(e.target.value);
                                              setPlayerFullMana(value);
                                              if(value > (playerTotalMana.current||0)){
                                                  setPlayerTotalMana(value);
                                              }
                                          }
                                          }/>
                          <Div>/</Div>
                          <StyledHeroManaTotal min={0}
                                               max={playerHasGuff ? 20 : 10} type={'number'} value={playerTotalMana.current||0} css={{position: 'initial'}}
                                               onChange={(e)=>{
                                                   const max = playerHasGuff ? 20 : 10;
                                                   const value = parseInt(e.target.value) > max ? max : parseInt(e.target.value);
                                                   setPlayerTotalMana(value);
                                                   if((playerFullMana.current||0) > value){
                                                        setPlayerFullMana(value);
                                                   }
                          }}/>
                      </StyledPlayerMana>
                      <StyledHeroArmor min={0} type={'number'} value={playersArmor.current||0} onChange={(e)=>{setPlayersArmor(parseInt(e.target.value))}}/>
                      <StyledHeroLife min={0} type={'number'} value={playersLife.current||0} onChange={(e)=>{setPlayersLife(parseInt(e.target.value))}}/>
                      <StyledHeroAttack min={0} type={'number'} value={playersAttack.current||0} onChange={(e)=>{setPlayersAttack(parseInt(e.target.value))}}/>
                  </StyledHero>
              </Div>

              <Div css={{fontSize: '11px', display: 'flex', gap: '.5rem'}}>
                  <StyledLegendWrapper>
                      <StyledLegendColor css={{backgroundColor: 'orange'}} /><Div>Attack</Div>
                  </StyledLegendWrapper>
                  <StyledLegendWrapper>
                      <StyledLegendColor css={{backgroundColor: 'red'}} /><Div>Health</Div>
                  </StyledLegendWrapper>
                  <StyledLegendWrapper>
                      <StyledLegendColor css={{backgroundColor: 'gray'}} /><Div>Armor</Div>
                  </StyledLegendWrapper>
                  <StyledLegendWrapper>
                      <StyledLegendColor css={{backgroundColor: '#3370ff'}} /><Div>Mana</Div>
                  </StyledLegendWrapper>
                  <StyledLegendWrapper>
                      <StyledLegendColor css={{backgroundColor: '#143278'}} /><Div>Total Mana</Div>
                  </StyledLegendWrapper>

              </Div>
          </Div>
          {/* Stats */}
          <Div css={{flex:1, padding: '1rem'}}>
              <Div css={{display: 'flex', justifyContent: 'center'}}>
                  <h2>Stats</h2>
              </Div>
              {consecutiveClicks > 1 && <Div>After {consecutiveClicks} consecutive "Convoke the Spirits": </Div>}
              <ul>
                  {(armorGain.current||0) > 0 && <ListItem><ShieldIcon fontSize="small"/> Gained +{(armorGain.current||0)} armor</ListItem>}

                  {(damageToEnemyHero.current || 0) > 0 && <ListItem><Span css={{color: 'green'}}>Dealt {(damageToEnemyHero.current||0)} damage to the enemy hero</Span></ListItem>}
                  {(damageToFriendlyHero.current || 0) > 0 && <ListItem><Span css={{color: 'red'}}>Dealt {(damageToFriendlyHero.current||0)} damage to your own hero</Span></ListItem>}

                  {(cardsDrawn.current||0) > 0 && <ListItem><StyleIcon fontSize={'small'}/>Drew +{(cardsDrawn.current||0)} cards</ListItem>}
                  {(attackGain.current||0) > 0 && <ListItem><FitnessCenterIcon fontSize={'small'}/>Your hero gained +{(attackGain.current||0)} attack</ListItem>}

                  {(gainedUsableMana.current || 0) > 0 && <ListItem><DiamondOutlinedIcon fontSize={'small'}/>Gained +{(gainedUsableMana.current||0)} mana usable this turn</ListItem>}
                  {(gainedPermanentMana.current||0) > 0 && <ListItem><DiamondIcon fontSize={'small'}/>Gained +{(gainedPermanentMana.current||0)} permanent mana</ListItem>}

                  {(friendlyMinionDifferential.current||0) > 0 && <ListItem>Gained {(friendlyMinionDifferential.current||0)} minion(s) {(addedFriendlyTaunts.current||0) > 0 && `(${addedFriendlyTaunts.current||0} taunt(s))`}</ListItem>}
                  {(friendlyMinionDifferential.current||0) < 0 && <ListItem><Span css={{color: 'red'}}>You lost {(friendlyMinionDifferential.current||0) * -1} minion(s)</Span></ListItem>}

                  {((friendlyStatsDifferential.current||{}).attack != null || (friendlyStatsDifferential.current||{}).health != null)  &&
                    <ListItem>Your net stats change is <Span css={{ fontWeight: 'bold', color: ((friendlyStatsDifferential.current||{}).attack || 0) > 0 ? 'green':'red'}}>{((friendlyStatsDifferential.current||{}).attack || 0) >= 0 && '+'}{(friendlyStatsDifferential.current||{}).attack || 0}</Span>/
                      <Span css={{ fontWeight: 'bold', color: ((friendlyStatsDifferential.current||{}).health || 0) > 0 ? 'green':'red'}}>{((friendlyStatsDifferential.current||{}).health || 0) >= 0 && '+'}{(friendlyStatsDifferential.current||{}).health || 0}</Span>
                    </ListItem>
                  }

                  {(enemyMinionDifferential.current||0) < 0 && <ListItem><Span css={{color: 'green'}}>Your opponent lost {(enemyMinionDifferential.current||0) * -1} minion(s)</Span></ListItem>}
                  {(enemyMinionDifferential.current||0) > 0 && <ListItem>Your opponent gained {(enemyMinionDifferential.current||0)} minion(s)</ListItem>}
                  {((enemyStatsDifferential.current||{}).attack != null || (enemyStatsDifferential.current||{}).health != null) &&
                      <ListItem>Your opponent's net stats change is <Span css={{ fontWeight: 'bold', color: ((enemyStatsDifferential.current||{}).attack || 0) > 0 ? 'red':'green'}}>{((enemyStatsDifferential.current||{}).attack || 0) >= 0 && '+'}{(enemyStatsDifferential.current||{}).attack || 0 }</Span>/
                        <Span css={{ fontWeight: 'bold', color: ((enemyStatsDifferential.current||{}).health || 0) > 0 ? 'red':'green'}}>{((enemyStatsDifferential.current||{}).health || 0) >= 0 && '+'}{(enemyStatsDifferential.current||{}).health || 0}</Span>
                      </ListItem>
                  }

                  {((buffedMinionsInHand.current||{}).attack != null || (buffedMinionsInHand.current||{}).health != null) && <ListItem>Buffed all minions in hand by +{(buffedMinionsInHand.current||{}).attack || 0}/+{(buffedMinionsInHand.current||{}).health || 0}</ListItem>}

                  {(addedEnemyTaunts.current||0) > 0 && <ListItem>Gave {(addedEnemyTaunts.current||0)} taunt(s) to the opponent</ListItem>}
                  {(addedEnemyTaunts.current||0) < 0 && <ListItem>Removed {(addedEnemyTaunts.current||0) * -1} taunt(s) from the opponent's board</ListItem>}

                  {celestialAlignment.current && <ListItem><AutoAwesomeIcon fontSize={'small'}/>Celestial Alignment has been activated</ListItem>}
                  {frostwolfKennels.current && <ListItem><PetsIcon fontSize={'small'}/>Frostwolf Kennels is active</ListItem>}
              </ul>
          </Div>
      </Div>
        <Snackbar open={isNotEnoughManaPopupVisible} autoHideDuration={6000} onClose={()=>setIsNotEnoughManaPopupVisible(false)}>
            <Alert onClose={()=>setIsNotEnoughManaPopupVisible(false)} severity="warning" sx={{ width: '100%' }}>
                Not enough mana (you can manually change it, or click reset)
            </Alert>
        </Snackbar>
    </>
  );
};