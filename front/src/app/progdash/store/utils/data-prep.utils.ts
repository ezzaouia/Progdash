import { scaleOrdinal, schemeCategory10 } from "d3";
import {
  chain,
  mapValues,
  map,
  each,
  filter,
  size,
  differenceBy,
  orderBy,
  keys,
  maxBy,
  keyBy,
  includes,
  every
} from "lodash";

export const modulesDataAttr = modulesData => {
  // equivalent modules will not be displayed in same line
  const routeWithMaxNbrOfModule = chain(modulesData )
    .groupBy("routeId")
    .mapValues( size )
    .value();

  const maxId = maxBy(
    keys( routeWithMaxNbrOfModule ),
    k => routeWithMaxNbrOfModule[k]
  );

  const route1 = filter( modulesData, d => d.routeId === +maxId );
  const route2 = filter( modulesData, d => d.routeId !== +maxId );
  const all = [ ...route1, ...differenceBy( route2, route1, 'key' ) ];

  const sorted = orderBy( all, [ 'index' ], [ 'desc' ]);
  const displayed = orderBy( route1, [ 'index' ], [ 'desc' ]);

  const forLabel = [];
  const forLine = [];
  let rf, sf, rSumOfTopRules, sSumOfTopRules;

  each( displayed, ( v, __ ) => {
    rf = filter( displayed, ( e, ___ ) => e.index <= v.index );
    rSumOfTopRules = chain( rf )
      .map( 'nbrOfRules' )
      .sum()
      .value();
    forLabel.push({ ...v, rSumOfTopRules });
  });

  each( sorted, ( v, __ ) => {
    sf = filter( displayed, ( e, ___ ) => e.index < v.index );
    sSumOfTopRules = chain( sf )
      .map( 'nbrOfRules' )
      .sum()
      .value();
    forLine.push({ ...v, sSumOfTopRules });
  });

  const colorDomain = map( forLine, 'key' );
  const colorScheme = scaleOrdinal( schemeCategory10 ).domain( colorDomain );
  const forColor = mapValues( keyBy( forLine, 'key' ), ( _, key ) =>
    colorScheme( key )
  );
  const displayedNbrOfRules = chain( displayed )
    .map( 'nbrOfRules' )
    .sum()
    .value();
  const isHasSupProAndSup = every([ 'Supérieur', 'Pro', 'Pont supérieur' ], key =>
    includes( colorDomain, key )
  );

  return {
    all,
    forLabel,
    forLine,
    forColor,
    displayedNbrOfRules, // only displyed modules
    isHasSupProAndSup,
  };
};

export const tableCsvExportOptions = tableName => {
  const opts = {
    delimiter: {
      wrap: '"', // Double Quote (") character
      field: ',', // Comma field delimiter
      eol: '\n', // Newline delimiter
    },
    prependHeader: false,
    sortHeader: false,
    excelBOM: true,
    trimHeaderValues: true,
    trimFieldValues: true,
  };

  switch ( tableName ) {
    case 'details': {
      return {
        options: {
          ...opts,
          keys: [
            'fullName',
            'score.sum',
            'score.count',
            'time',
            'lastConnection',
            'connectionsNbr',
            'initialEval',
            'initialLevel.sum',
            'lastModule',
          ],
        },
        header: [
          'Apprenant',
          'Nbr. Règles Acquises',
          'Total Règle',
          'Temps Cumulé (min)',
          'Date Dernière Connexion',
          'Nbr. Connexions',
          'Eval. Initiale',
          'Nbr. Règles sues initialement',
          'Module atteint',
        ],
      };
    }
    case 'evaluations': {
      return {
        options: {
          ...opts,
          keys: [ 'fullName', 'evaluationName', 'time', 'score', 'mark' ],
        },
        header: [
          'Apprenant',
          'Évaluation',
          'Temps passé (min)',
          'Score (%)',
          'Note /20',
        ],
      };
    }
    default:
      break;
  }
};
