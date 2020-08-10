import React, { useState } from 'react';
import { View, AsyncStorage } from 'react-native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { useFocusEffect } from '@react-navigation/native';

const Favorites: React.FC = () => {
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);

  const loadFavorites = () => {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        setFavoriteTeachers(JSON.parse(response));
      }
    });
  }

  useFocusEffect(loadFavorites);

  return (
    <View style={styles.container}>
      <PageHeader title="Meus Proffys favoritos"></PageHeader>
      <ScrollView style={styles.teacherList} contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16
      }}>
        {favoriteTeachers.map((teacher: Teacher) =>
          <TeacherItem teacher={teacher} key={teacher.id} favorited />)}
      </ScrollView>
    </View>
  );
}

export default Favorites;