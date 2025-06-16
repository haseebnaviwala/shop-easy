import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { fetchProducts } from "../data/api";
import ProductCard from "../components/ProductCard";
import SearchFilter from "../components/SearchFilter";
import { useThemeContext } from "../context/ThemeContext";
import { getWishlist, toggleWishlistItem } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load wishlist on focus
  useFocusEffect(
    React.useCallback(() => {
      loadWishlist();
    }, [])
  );

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    const list = await getWishlist();
    setWishlistItems(list);
  };

  const handleWishlistToggle = async (product) => {
    const updated = await toggleWishlistItem(product);
    setWishlistItems(updated);
  };

  const isProductInWishlist = (product) => {
    return wishlistItems.some((item) => item.id === product.id);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#fff" },
      ]}
    >
      <SearchFilter
        searchText={searchText}
        setSearchText={setSearchText}
        products={products}
        setFilteredProducts={setFiltered}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("ProductDetail", { product: item })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
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
});

export default HomeScreen;
