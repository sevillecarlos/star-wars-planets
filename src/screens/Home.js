import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {useQuery, gql} from '@apollo/client';
import {PLANETS_FILMS} from '../graphql/queries';
import RNShake from 'react-native-shake';

const Home = () => {
  const [nextPlanetCounter, setNextPlanetCounter] = useState(0);
  const [planetsInfo, setPlanetsInfo] = useState([]);
  const [selectPlanet, setSelectPlanet] = useState(undefined);

  const {loading, error, data} = useQuery(PLANETS_FILMS);

  const changePlanet = () => {
    setNextPlanetCounter(prevState => {
      if (prevState >= 14) {
        return 0;
      }
      return prevState + 1;
    });
  };

  useEffect(() => {
    if (data) {
      const {
        allPlanets: {edges},
      } = data;

      setPlanetsInfo(edges);
    }
  }, [data]);

  useEffect(() => {
    if (planetsInfo.length !== 0) {
      const {
        node: {
          name,
          filmConnection: {edges},
        },
      } = planetsInfo[nextPlanetCounter];
      const FilmsTitle = edges.map(({node}) => node.title);
      const textFilms = FilmsTitle.join(', ');
      setSelectPlanet({name: name, films: textFilms});
    }
  }, [nextPlanetCounter]);

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      changePlanet();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={style.homeContainer}>
      {error && <Text>Error</Text>}
      {loading ? (
        <ActivityIndicator />
      ) : selectPlanet ? (
        <View>
          <Text style={style.planetText}>{selectPlanet?.name}</Text>
          <Text style={style.filmsText}>{selectPlanet?.films}</Text>
        </View>
      ) : (
        <Text style={style.shakeMsg}>Shake your device to see planets</Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  shakeMsg: {
    fontSize: 20,
    color: 'black',
  },
  planetText: {
    fontSize: 80,
    color: 'black',
  },
  filmsText: {
    fontSize: 20,
    color: 'black',
  },
});

export default Home;










