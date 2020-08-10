import React, { useState } from 'react';
import { View, Image, Text, Linking, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import heartUnfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  bio: string;
  cost: number;
  whatsapp: string;
}
interface TeacherItemProps {
  teacher: Teacher,
  favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
  const [isFavorite, setIsFavorite] = useState(favorited);

  function handleLinkToWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`)
  }

  async function handleToggleFavorite() {
    let favoritesArray = [];
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }
    if (isFavorite) {
      setIsFavorite(false);
      favoritesArray = favoritesArray.filter((item: Teacher) => item.id !== teacher.id);
    } else {
      setIsFavorite(true);
      favoritesArray.push(teacher);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar}
          source={{ uri: teacher.avatar }} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>
        {teacher.bio}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>Preço/hora {'  '}
          <Text style={styles.priceValue}>R$ {teacher.cost},00</Text>
        </Text>
        <View style={styles.buttonsContainer}>
          <RectButton style={
            [styles.favoriteButton, (isFavorite ? styles.favorited : {})]
          }
            onPress={handleToggleFavorite}>
            {
              isFavorite ?
                <Image source={heartUnfavoriteIcon} /> :
                <Image source={heartOutlineIcon} />
            }
          </RectButton>
          <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
}

export default TeacherItem;