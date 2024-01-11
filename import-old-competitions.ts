import CREDS from './service-account-creds.json';
import {playersData} from './src/data/players.data';
import {pokemonData} from './src/data/pokemon.data';
import { ICompetitionEntity, IPlayerEntities, IPlayerEntity, IPointEntity, IPokemonEntities } from "store/reducers";
import { GoogleSpreadsheet, GoogleSpreadsheetCell, GoogleSpreadsheetCellErrorValue, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as util from 'util';

//const SHEET_ID:string = '1wgp9pUMUkJeUD-Dv1OlOlc7Hw8Fa9T--kggVaYHKMU8';
const SHEET_ID:string = '1wMLMhYRttTCD-BtrnKfLeEcgaKFaU_WCYNYrqa3sKpU';
const MISSING_NO_ID:string = 'f77b6663-537d-469c-bd2f-0e4347bb5ca3';

const COMPETITIONS = [];
const EXISTING_PLAYERS_BY_DISPLAYNAME:IPlayerEntities = {};
const POKEMON_BY_NAME:IPokemonEntities = {};
const DISPLAYNAME_MAP = new Map<string, string>([
    ['heroofice18', 'Brandon Heroice18'],
    ['bdewalt', 'Bobby'],
    ['spencer', 'Soend'],
    ['tone ring', 'Tone'],
    ['mcinkay', 'Al'],
    ['legrandmudkip', 'Mudkip'],
    ['bobbydewalt', 'Bobby'],
    ['heroofice', 'Brandon Heroice18'],
    ['stuartgibson', 'Stuart'],
    ['spencer silvestre', 'Soend'],
    ['the shiny chatot', 'chatot'],
    ['al mcinkay', 'Al'],
    ['jmeek', 'jackmeek'],
    ['franco', 'fresh'],
    ['yamanickill', 'Al'],
    ['brandon21486', 'brandonweisner'],
    ['kyle johnson', 'kyle'],
    ['wesleythebestly', 'WesleytheBestley'],
    ['wesley the bestly', 'WesleytheBestley'],
    ['1966mustang', 'A1966Mustang']
]);

type NameAttributes = {
    realName: string,
    displayName: string
};

function loadPokemon() {
    for (const id of Object.getOwnPropertyNames(pokemonData)) {
        let pokemon = pokemonData[id];
        POKEMON_BY_NAME[pokemon.data.attributes.name.toLowerCase()] = pokemon;
    }
}

function parsePlayers() {
    for (const id of Object.getOwnPropertyNames(playersData)) {
        let player = playersData[id];
        EXISTING_PLAYERS_BY_DISPLAYNAME[player.data.attributes.displayName.toLowerCase()] = player;
    }
}

function parseName(value:string | number | true | GoogleSpreadsheetCellErrorValue) : NameAttributes{
    if (typeof value !== "string") {
        return {
            realName: '',
            displayName: ''
        };
    }

    value = value.replaceAll('(', '');
    value = value.replaceAll(')', '');

    let index:number = value.indexOf('@');
    let realName:string = index >= 0 ? value.substring(0, index) : value;
    realName = realName.trim();

    let displayName:string = index >= 0 ? value.substring(index + 1) : realName;
    displayName = displayName.trim();

    return {
        realName: realName || displayName,
        displayName: displayName
    };
}

function getPlayerFromAttributes(nameAttributes: NameAttributes) : IPlayerEntity {
    let player = EXISTING_PLAYERS_BY_DISPLAYNAME[nameAttributes.displayName.toLowerCase()];
    if (!!player) {
        return player;
    }

    let playerName = DISPLAYNAME_MAP.get(nameAttributes.displayName.toLowerCase());
    if (!!playerName) {
        player = EXISTING_PLAYERS_BY_DISPLAYNAME[playerName.toLowerCase()];
    }

    return player;
}

function createPlayer(nameAttributes : NameAttributes) : IPlayerEntity {
    let player =  {
            data: {
                type: 'player' as 'player',
                id: uuid(),
                attributes: nameAttributes
            }
        };
    
    playersData[player.data.id] = player;
    EXISTING_PLAYERS_BY_DISPLAYNAME[nameAttributes.displayName.toLowerCase()] = player;
    writePlayerToDataFile(player);
    return player;
}

function writePlayerToDataFile(player: IPlayerEntity) {
    const FILE_NAME = './src/data/players.data.ts';

    let content:string = fs.readFileSync(FILE_NAME, { encoding: 'utf8'});

    // The last character is '}' so we can replace that
    content = content.substring(0, content.length - 2);

    content += `
    // ${player.data.attributes.realName} (@${player.data.attributes.realName})
  '${player.data.id}': {
    data: {
      type: 'player' as 'player',
      id: '${player.data.id}',
      attributes: {
        realName: '${player.data.attributes.realName}',
        displayName: '${player.data.attributes.displayName}'
      }
    }
  },
}`;

    fs.writeFileSync(FILE_NAME, content, { encoding: 'utf8'});

}

function getPlayers(sheet:GoogleSpreadsheetWorksheet) : IPlayerEntity[] {
    // First row is the dates
    // Second row is the Theme
    // Start at row #3 (index 0)
    const players:IPlayerEntity[] = [];

    for (let row:number = 2; row < sheet.rowCount; row++) {
        let cell:GoogleSpreadsheetCell = sheet.getCell(row, 0);
        if (!cell.value) {
            break;
        }

        let nameAttributes = parseName(cell.value);
        let player = getPlayerFromAttributes(nameAttributes);

        if (!player) {
            player = createPlayer(nameAttributes);
            //console.log("NEW PLAYER", player.data.attributes.displayName);
        } else {
            //console.log("found player", player.data.attributes.displayName);
        }

        players.push(player);

    }

    return players;

}

function formatNumber(value: string) {
    return value.padStart(2, '0');
}

function formatDate(value:string) {
    const parts = value.split("/");
    return parts[2] + '-' + formatNumber(parts[0]) + '-' + formatNumber(parts[1]);
}

function getDates(value: string, year: string) {
    const parts = value.split("-");
    let startDate = formatDate(parts[0].trim() + '/' + year);
    let endDate = formatDate(parts[1].trim() + '/' + year);

    return {startDate, endDate};

}

function getPokemon(note:string) {
    return MISSING_NO_ID;
}

async function addCompetitions(sheet:GoogleSpreadsheetWorksheet, players: Array<IPlayerEntity>, year: string) {
    try {
        fs.mkdirSync(`./src/data/points/${year}`);
    } catch (e: any) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }

    let competitionContent : string = `
import { ICompetitionEntity } from "store/reducers/competitions.reducer";

export const competitionsData${year}: { [id: string]: ICompetitionEntity } = {
`;

    let lastWinner:string = '80cfecae-ef2e-437b-bb94-f0309ee3b3d2';
    for (let column:number = 2; column < sheet.columnCount; column++) {
        let dates = sheet.getCell(0, column).value;
        if (typeof dates !== "string") {
            throw new Error("Expected string for dates");
        }

        let {startDate, endDate} = getDates(dates, year);
        let competition:ICompetitionEntity = {
            data: {
                type: 'competition' as 'competition',
                id: uuid(),
                attributes: {
                    description: sheet.getCell(1, column).note as string || 'n/a',
                    endDate: endDate,
                    startDate: startDate,
                    theme: sheet.getCell(1, column).value as string,
                },
                relationships: {
                    selectedBy: {
                        data: {
                            id: lastWinner,
                            type: 'player'
                        }
                    },
                    validPokemon: [
                        {
                            data: {
                                // Always Missing No 
                                id: MISSING_NO_ID,
                                type: 'pokemon'
                            }
                        }                
                    ],
                    year: {
                        data: {
                            id: year,
                            type: 'year'
                        }
                    }
                }
            }
        };

        competitionContent += `'${competition.data.id}': ${util.inspect(competition, false, null)},
`;

        let pointsContent =
`import { BallType } from "src/types/ball.types";
import { GameType } from "src/types/game.types";
import { MethodType } from "src/types/method.types";
import { IPointEntities } from "store/reducers";

export const pointsData${year}_${column - 1}:IPointEntities = {
`;
        for (let p:number = 0; p < players.length; p++) {
            let row = p + 2;
            let cell = await sheet.getCell(row, column);
            let shinies:number = cell.value as number;
            if (!shinies) {
                continue;
            }
            
            let firstCatch: boolean = false;
            if (!!cell.userEnteredFormat && !!cell.backgroundColor) {
                firstCatch = cell.backgroundColor.red == 1 && cell.backgroundColor.green == 1;
                lastWinner = players[p].data.id;
            };

            let pokemonId = getPokemon(cell.note);

            for (let i=0 ; i < shinies; i++) {
                let point: IPointEntity = {
                    data: {
                        id: uuid(),
                        type: 'point' as 'point',
                        attributes: {
                            ball: null,
                            catchDate: null,
                            firstCatch: firstCatch,
                            game: null,
                            method: null,
                            oldSystemPoint: true
                        },
                        relationships: {
                            competition: {
                                data: {
                                    id: competition.data.id,
                                    type: 'competition',
                                },
                            },
                            player: {
                                data: {
                                    id: players[p].data.id,
                                    type: 'player',
                                },
                            },
                            pokemon: {
                                data: {
                                    id: pokemonId,
                                    type: 'pokemon',
                                },
                            },
                        },
                    }
                };

                pointsContent +=
`  '${point.data.id}': ${util.inspect(point, false, null)},
`;

            }
        }

        pointsContent += '}';
        let fileId = ("" + (column - 1)).padStart(2, '0');
        fs.writeFileSync(`./src/data/points/${year}/${fileId}.data.ts`, pointsContent, { encoding: 'utf8'});
    }

    competitionContent += '}';
    fs.writeFileSync(`./src/data/competitions/${year}.data.ts`, competitionContent, { encoding: 'utf8'});    

    let pointsParentContent = '';
    for (let i=1; i < sheet.columnCount - 1; i++) {
        pointsParentContent += `import { pointsData${year}_${i} } from "./${year}/${i.toString().padStart(2, '0')}.data";\r`;
    }

    pointsParentContent += `export const pointsData${year} = {\n`;

    for (let i=1; i < sheet.columnCount - 1; i++) {
        pointsParentContent += `...pointsData${year}_${i},\n`;
    }

    pointsParentContent += '}';

    fs.writeFileSync(`./src/data/points/${year}.data.ts`, pointsParentContent, {encoding: 'utf8'});
}

async function addYear(sheet:GoogleSpreadsheetWorksheet) {
    const year = sheet.title;

    console.log('Parsing', year);
    await sheet.loadCells('A1:AD40');
    const players = getPlayers(sheet);
    addCompetitions(sheet, players, year);
}


async function main() {
    loadPokemon();
    parsePlayers();

    const auth:JWT = new JWT( {
        email: CREDS.client_email,
        key: CREDS.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    console.log("Finding spreadsheet");
    const doc:GoogleSpreadsheet = new GoogleSpreadsheet(SHEET_ID, auth);
        
    // loads document properties and worksheets
    console.log("Loading spreadsheet");
    await doc.loadInfo(); 

    // Skip the first sheet, it's the rules
    for (let i:number=1; i < doc.sheetCount; i++) {
        const sheet = doc.sheetsByIndex[i];
        await addYear(sheet);
    }
    
}

(async () => { 
    try {
        await main();
    } catch (e) {
        console.log("error", e);
    }
})()
