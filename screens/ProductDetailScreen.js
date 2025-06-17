import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { Button, Divider } from "react-native-elements";
import { useThemeContext } from "../context/ThemeContext";
import { toggleWishlistItem, getWishlist } from "../utils/storage";
import ReviewForm from "../components/ReviewForm";
import { useFocusEffect } from "@react-navigation/native";

import { fetchReviewsByProductId } from "../data/api"; // <-- import your API helper

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { theme } = useThemeContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkWishlist();
      loadReviews();
    }, [product])
  );

  const checkWishlist = async () => {
    const list = await getWishlist();
    const exists = list.some((item) => item.id === product.id);
    setIsWishlisted(exists);
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetchReviewsByProductId(product.id);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No reviews found, treat as empty list
        setReviews([]);
      } else {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      }
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleWishlistToggle = async () => {
    await toggleWishlistItem(product);
    checkWishlist();
    Alert.alert(
      "Wishlist Updated",
      isWishlisted ? "Removed from Wishlist" : "Added to Wishlist"
    );
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text
        style={[styles.reviewRating, theme === "dark" && { color: "#ffd700" }]}
      >
        Rating: {item.rating} ⭐
      </Text>
      <Text
        style={[styles.reviewComment, theme === "dark" && { color: "#ccc" }]}
      >
        {item.comment}
      </Text>
      <Divider style={{ marginVertical: 5 }} />
    </View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#fff" },
      ]}
    >
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={[styles.name, theme === "dark" && { color: "#fff" }]}>
          {product.name}
        </Text>
        <Text style={[styles.price, theme === "dark" && { color: "#ccc" }]}>
          ${product.price}
        </Text>
        <Text style={[styles.desc, theme === "dark" && { color: "#aaa" }]}>
          {product.description}
        </Text>

        <Button
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          onPress={handleWishlistToggle}
          buttonStyle={{ marginVertical: 10 }}
        />

        <Divider style={{ marginVertical: 10 }} />

        {/* Review Form */}
        <ReviewForm productId={product.id} onReviewAdded={loadReviews} />

        <Divider style={{ marginVertical: 10 }} />

        {/* Reviews list */}
        <Text
          style={[styles.reviewsTitle, theme === "dark" && { color: "#fff" }]}
        >
          Reviews ({reviews.length})
        </Text>

        {loadingReviews ? (
          <Text style={{ color: theme === "dark" ? "#ccc" : "#555" }}>
            Loading reviews...
          </Text>
        ) : reviews.length === 0 ? (
          <Text style={{ color: theme === "dark" ? "#ccc" : "#555" }}>
            No reviews yet.
          </Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderReview}
            scrollEnabled={false} // ScrollView already scrolls
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "contain",
  },
  info: {
    marginTop: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    marginVertical: 5,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewContainer: {
    marginBottom: 10,
  },
  reviewRating: {
    fontWeight: "600",
  },
  reviewComment: {
    fontStyle: "italic",
  },
});

export default ProductDetailScreen;
