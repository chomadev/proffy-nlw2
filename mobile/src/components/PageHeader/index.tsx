import React, { ReactNode } from 'react';
import { View, Image, Text } from 'react-native';

import styles from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import backIcon from '../../assets/images/icons/back.png';
import logoImage from '../../assets/images/logo.png';

interface PageHeaderProps {
  title: string;
  headerRight?: ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, headerRight, children }) => {
  const { navigate } = useNavigation();

  function functionHandleGoBack() {
    navigate('Landing')
  }

  return (<View style={styles.container}>
    <View style={styles.topBar}>
      <BorderlessButton onPress={functionHandleGoBack}>
        <Image resizeMode='contain' source={backIcon} />
      </BorderlessButton>
      <Image resizeMode='contain' source={logoImage} />
    </View>

    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {headerRight}
    </View>

    {children}
  </View>)
}

export default PageHeader;