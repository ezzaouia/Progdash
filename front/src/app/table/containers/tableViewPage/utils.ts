import { random  } from 'lodash';

export interface DummyData {
  id: string;
  nbr: number;
  nbr2: number;
  nbr3: number;
  nbr4: number;
  cat: string;
  cat2: string;
  cat3: string;
  cat4: string[];
  stack: string;
  hint: string;
  line: {}[];
}


export const cats = [ 'cat1', 'cat2', 'cat3', 'cat4', 'cat5' ];

export const dummyData = ( size ) => {
  const data: DummyData[] = [];
  let nbr, nbr2, nbr3;
  for ( let i = 0; i < size; ++i ) {
    nbr = random( 0, 99 );
    nbr2 = random( 0, 99 );
    nbr3 = random( 0, 999 );

    data.push({
      id: 'Item ' + i,
      nbr,
      nbr2,
      nbr3,
      stack: nbr + nbr2 + nbr3,
      nbr4: random( 0, 999 ),
      cat: cats[Math.floor( Math.random() * 5 )],
      cat2: cats[Math.floor( Math.random() * 5 )],
      cat3: cats[Math.floor( Math.random() * 5 )],
      cat4: [ cats[Math.floor( Math.random() * 5 )], cats[Math.floor( Math.random() * 5 )] ],
      hint: cats[Math.floor( Math.random() * 5 )],
      line: Array.from({ length: 20 },  ( v, k ) => ({ x: k, y: random( 0, 99 ) })),
    });
  }
  return data;
};
