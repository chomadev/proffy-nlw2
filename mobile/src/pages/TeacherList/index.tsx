import React, { useState } from 'react';
import { View, Text, AsyncStorage } from 'react-native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api'

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  const loadFavorites = () => {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoriteTeachersIds = favoritedTeachers.map((favorite: Teacher) => favorite.id);
        setFavoriteIds(favoriteTeachersIds);
      }
    });
  }

  function handleToggleFilterVisible() {
    setIsFilterVisible(!isFilterVisible);
  }

  async function handleFilterSubmit() {
    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    });
    setTeachers(response.data);
    setIsFilterVisible(false);
    loadFavorites();
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponíveis" headerRight={(
        <BorderlessButton onPress={handleToggleFilterVisible}>
          <Feather name="filter" size={20} color={'#fff'} />
        </BorderlessButton>
      )}>

        {isFilterVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput placeholderTextColor='#c1bccc' style={styles.input}
              placeholder="Qual a matéria?" value={subject} onChangeText={text => setSubject(text)} />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput placeholderTextColor='#c1bccc' style={styles.input}
                  placeholder="Qual o dia?" value={week_day} onChangeText={text => setWeekDay(text)} />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput placeholderTextColor='#c1bccc' style={styles.input}
                  placeholder="Qual horário?" value={time} onChangeText={text => setTime(text)} />
              </View>
            </View>
            <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
              <Text style={styles.submitButtonText}>Buscar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>
      <ScrollView style={styles.teacherList} contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16
      }}>
        {
          teachers ?
            teachers.map((teacher: Teacher) =>
              <TeacherItem key={teacher.id} teacher={teacher} favorited={favoriteIds.includes(teacher.id)} />) :
            <Text>Nenhum professor encontrado</Text>
        }
      </ScrollView>
    </View >
  );
}

export default TeacherList;