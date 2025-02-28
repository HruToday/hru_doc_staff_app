import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const Customicons = ({name, size = 25, color = {}, style = {}}) => {
  return <Icon name={name} size={size} color={color} style={style} />;
};

export default Customicons;
