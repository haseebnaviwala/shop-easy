import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { getWishlist } from '../utils/storage';
import ProductCard from '../components/ProductCard';
import { useThemeContext } from '../context/ThemeContext';

const WishlistScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWishlist();
    });
    return unsubscribe;
  }, [navigation]);

  const loadWishlist = async () => {
    const list = await getWishlist();
    setWishlist(list);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      {wishlist.length === 0 ? (
        <Text style={[styles.emptyText, theme === 'dark' && { color: '#fff' }]}>
          Your wishlist is empty.
        </Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },
});

export default WishlistScreen;
