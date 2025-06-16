import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import { Button, Rating } from "react-native-elements";
import axios from "axios";
import { API_BASE, postReview } from "../data/api";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      Alert.alert("Validation Error", "Please provide a rating and comment.");
      return;
    }

    setLoading(true);

    try {
      await postReview({
        productId,
        comment,
        rating,
      });

      setComment("");
      setRating(0);
      Alert.alert("Review Submitted", "Thank you for your feedback!");

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error("Failed to submit review:", error.message);
      Alert.alert("Error", "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Leave a Review</Text>
      <Rating
        imageSize={24}
        startingValue={rating}
        onFinishRating={setRating}
        style={styles.rating}
      />
      <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button
        title={loading ? "Submitting..." : "Submit Review"}
        onPress={handleSubmit}
        disabled={loading}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  rating: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2196f3",
  },
});

export default ReviewForm;
